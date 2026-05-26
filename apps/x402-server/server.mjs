import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Contract, Interface, JsonRpcProvider, Wallet, formatEther, id } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const deploymentPath = path.join(root, "deployments", "somnia-testnet.json");
const STATUS = ["Pending", "Accepted", "Processing", "Fulfilled", "Settled", "Refunded", "Failed"];
const ZERO = "0x0000000000000000000000000000000000000000";

const registryAbi = [
  "function agents(bytes32) view returns (address owner,string name,string endpoint,string capabilities,uint256 priceWei,bool active,uint256 createdAt,uint256 updatedAt)",
];
const orderBookAbi = [
  "function createOrder(bytes32 agentId,string requestUri) payable returns (bytes32)",
  "function acceptOrder(bytes32 orderId)",
  "function markProcessing(bytes32 orderId)",
  "function fulfillOrder(bytes32 orderId,string resultUri)",
  "function orders(bytes32) view returns (bytes32 orderId,bytes32 agentId,address requester,address provider,uint256 amountWei,string requestUri,string resultUri,uint8 status,uint256 createdAt,uint256 updatedAt)",
];
const orderBookInterface = new Interface(orderBookAbi);

loadEnv();

export function createX402Server(options = {}) {
  const deployment = readDeployment();
  const rpcUrl = options.rpcUrl || process.env.SOMNIA_RPC_URL || "https://dream-rpc.somnia.network";
  const provider = new JsonRpcProvider(rpcUrl, deployment.chainId || 50312);
  const registry = new Contract(deployment.contracts.AgentRegistry, registryAbi, provider);
  const orderBook = new Contract(deployment.contracts.AgentOrderBook, orderBookAbi, provider);
  const providerKey = options.providerPrivateKey || process.env.X402_PROVIDER_PRIVATE_KEY || process.env.PRIVATE_KEY || "";
  const signer = providerKey ? new Wallet(providerKey, provider) : null;
  const orderBookSigner = signer ? orderBook.connect(signer) : null;
  const adminSecret = options.adminSecret || process.env.X402_ADMIN_SECRET || "";

  return http.createServer(async (req, res) => {
    try {
      setCors(res);
      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        return res.end();
      }
      await route({ req, res, deployment, registry, orderBook, orderBookSigner, adminSecret });
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        ok: false,
        error: error?.shortMessage || error?.message || String(error),
      });
    }
  });
}

function setCors(res) {
  res.setHeader("access-control-allow-origin", process.env.X402_ALLOWED_ORIGIN || "*");
  res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type,authorization,x-arcpay-order-id");
  res.setHeader("access-control-expose-headers", "x-accept-payment");
}

async function route(ctx) {
  const { req, res, deployment, registry, orderBook, orderBookSigner, adminSecret } = ctx;
  const url = new URL(req.url || "/", originFor(req));
  const parts = url.pathname.split("/").filter(Boolean);

  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, {
      ok: true,
      service: "arcpay-somnia-x402",
      network: deployment.network,
      chainId: deployment.chainId,
      orderBook: deployment.contracts.AgentOrderBook,
    });
  }

  if (req.method === "GET" && url.pathname === "/x402/demo") {
    return sendJson(res, 200, demoPayload(deployment));
  }

  if (req.method === "GET" && parts[0] === "x402" && parts[1] === "payment-requirements" && parts[2]) {
    const requirements = await paymentRequirements({ slug: parts[2], req, registry, deployment });
    return sendJson(res, 200, requirements);
  }

  if (req.method === "POST" && url.pathname === "/x402/verify") {
    const body = await readBody(req);
    const result = await verifyOrder({
      orderId: body.orderId,
      slug: body.agentSlug || body.slug,
      requester: body.requester,
      orderBook,
    });
    return sendJson(res, 200, result);
  }

  if (parts[0] === "agent" && parts[1] && parts[2] === "work" && req.method === "GET") {
    const slug = parts[1];
    const orderId = url.searchParams.get("orderId") || req.headers["x-arcpay-order-id"];
    if (!orderId) {
      const requirements = await paymentRequirements({ slug, req, registry, deployment });
      return sendPaymentRequired(res, requirements, { reason: "missing_order_id" });
    }

    const verification = await verifyOrder({ orderId, slug, orderBook });
    if (!verification.unlocked) {
      const requirements = await paymentRequirements({ slug, req, registry, deployment });
      return sendPaymentRequired(res, requirements, { reason: "order_not_fulfilled", verification });
    }

    return sendJson(res, 200, {
      ok: true,
      unlocked: true,
      x402Version: "arcpay-somnia-escrow-v1",
      orderId,
      agentSlug: slug,
      result: {
        summary: `Paid Somnia x402 work unlocked for ${slug}.`,
        evidenceUri: verification.resultUri,
        generatedAt: new Date().toISOString(),
        nextAction: "Settle the order from the requester wallet if it is not already settled.",
      },
      verification,
    });
  }

  if (parts[0] === "agent" && parts[1] && parts[2] === "provider" && parts[3] === "fulfill" && req.method === "POST") {
    if (!orderBookSigner) {
      return sendJson(res, 503, { ok: false, error: "X402_PROVIDER_PRIVATE_KEY or PRIVATE_KEY is required for provider fulfillment." });
    }
    if (adminSecret && req.headers.authorization !== `Bearer ${adminSecret}`) {
      return sendJson(res, 401, { ok: false, error: "invalid x402 provider authorization" });
    }
    const body = await readBody(req);
    const result = await providerFulfill({
      orderBookSigner,
      orderId: body.orderId,
      resultUri: body.resultUri || `x402://arcpay-somnia/${parts[1]}/${body.orderId}`,
    });
    return sendJson(res, 200, result);
  }

  return sendJson(res, 404, {
    ok: false,
    error: "not_found",
    routes: ["/health", "/x402/demo", "/x402/payment-requirements/:agentSlug", "/x402/verify", "/agent/:agentSlug/work"],
  });
}

async function paymentRequirements({ slug, req, registry, deployment }) {
  const agentId = id(slug);
  const agent = await registry.agents(agentId);
  if (agent.owner === ZERO) {
    const error = new Error(`agent not registered: ${slug}`);
    error.statusCode = 404;
    throw error;
  }
  if (!agent.active) {
    const error = new Error(`agent inactive: ${slug}`);
    error.statusCode = 409;
    throw error;
  }

  const requestUri = `${originFor(req)}/agent/${encodeURIComponent(slug)}/work`;
  const calldata = orderBookInterface.encodeFunctionData("createOrder", [agentId, requestUri]);

  return {
    ok: true,
    x402Version: "arcpay-somnia-escrow-v1",
    status: 402,
    reason: "payment_required",
    network: deployment.network,
    chainId: deployment.chainId,
    currency: "STT",
    asset: "native",
    agent: {
      slug,
      agentId,
      owner: agent.owner,
      name: agent.name,
      endpoint: agent.endpoint,
      capabilities: agent.capabilities,
      active: agent.active,
    },
    accepts: [{
      scheme: "exact",
      amountWei: agent.priceWei.toString(),
      amountStt: formatEther(agent.priceWei),
      payTo: deployment.contracts.AgentOrderBook,
      contract: "AgentOrderBook",
      action: "createOrder(bytes32,string)",
      calldata,
      args: { agentId, requestUri },
      verificationUrl: `${originFor(req)}/x402/verify`,
      unlockUrl: `${originFor(req)}/agent/${encodeURIComponent(slug)}/work?orderId={orderId}`,
    }],
    instructions: [
      "Call AgentOrderBook.createOrder(agentId, requestUri) with msg.value equal to amountWei.",
      "Send the resulting orderId to /x402/verify or append ?orderId=... to the protected resource.",
      "The resource unlocks only after the provider fulfills or the requester settles the on-chain order.",
    ],
  };
}

async function verifyOrder({ orderId, slug, requester, orderBook }) {
  if (!orderId || typeof orderId !== "string") {
    return { ok: false, paid: false, unlocked: false, error: "orderId required" };
  }
  const order = await orderBook.orders(orderId);
  if (order.requester === ZERO) {
    return { ok: true, paid: false, unlocked: false, orderId, statusName: "Missing" };
  }
  const expectedAgentId = slug ? id(slug) : null;
  const agentMatches = !expectedAgentId || order.agentId.toLowerCase() === expectedAgentId.toLowerCase();
  const requesterMatches = !requester || order.requester.toLowerCase() === requester.toLowerCase();
  const status = Number(order.status);
  const paid = status >= 0 && status <= 4;
  const unlocked = agentMatches && requesterMatches && (status === 3 || status === 4);

  return {
    ok: true,
    paid,
    unlocked,
    orderId,
    agentId: order.agentId,
    requester: order.requester,
    provider: order.provider,
    amountWei: order.amountWei.toString(),
    amountStt: formatEther(order.amountWei),
    requestUri: order.requestUri,
    resultUri: order.resultUri,
    status,
    statusName: STATUS[status] || `Unknown(${status})`,
    agentMatches,
    requesterMatches,
    settled: status === 4,
  };
}

async function providerFulfill({ orderBookSigner, orderId, resultUri }) {
  const order = await orderBookSigner.orders(orderId);
  const status = Number(order.status);
  const txs = [];

  if (order.requester === ZERO) {
    return { ok: false, error: "order missing", orderId };
  }
  if (status === 0) txs.push(await wait(orderBookSigner.acceptOrder(orderId)));
  if (status <= 1) txs.push(await wait(orderBookSigner.markProcessing(orderId)));
  if (status <= 2) txs.push(await wait(orderBookSigner.fulfillOrder(orderId, resultUri)));

  const next = await orderBookSigner.orders(orderId);
  return {
    ok: true,
    orderId,
    status: Number(next.status),
    statusName: STATUS[Number(next.status)] || `Unknown(${Number(next.status)})`,
    resultUri: next.resultUri,
    txs: txs.map((receipt) => receipt.hash),
  };
}

function demoPayload(deployment) {
  return {
    ok: true,
    title: "ArcPay Somnia x402 demo",
    steps: [
      "Register an agent in AgentRegistry with a public endpoint.",
      "Call GET /agent/:slug/work and receive HTTP 402 with exact Somnia payment requirements.",
      "Pay by calling AgentOrderBook.createOrder with the quoted value.",
      "Provider fulfills the order from its wallet.",
      "Call GET /agent/:slug/work?orderId=... and receive unlocked agent output.",
    ],
    contracts: deployment.contracts,
    smoke: "npm run smoke:x402",
  };
}

async function wait(txPromise) {
  return (await txPromise).wait();
}

function sendPaymentRequired(res, requirements, extra = {}) {
  res.setHeader("X-Accept-Payment", "arcpay-somnia-x402");
  return sendJson(res, 402, { ...requirements, ...extra });
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body, bigintReplacer, 2));
}

function bigintReplacer(_key, value) {
  return typeof value === "bigint" ? value.toString() : value;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function originFor(req) {
  const host = req.headers?.host || `127.0.0.1:${process.env.X402_SERVER_PORT || "4030"}`;
  const proto = req.headers?.["x-forwarded-proto"] || "http";
  return `${proto}://${host}`;
}

function readDeployment() {
  return JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
}

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index > 0 && !process.env[trimmed.slice(0, index)]) {
      process.env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
    }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.X402_SERVER_PORT || "4030");
  createX402Server().listen(port, () => {
    console.log(`ArcPay Somnia x402 server listening on http://127.0.0.1:${port}`);
  });
}
