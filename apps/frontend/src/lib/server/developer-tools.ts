import { id, keccak256, toUtf8Bytes } from "ethers";
import deployment from "../../../../../deployments/somnia-testnet.json";

type ToolResult = {
  contentType: "application/json" | "text/plain";
  body: unknown;
};

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

const network = {
  name: "Somnia Testnet",
  chainId: 50312,
  rpcUrl: "https://dream-rpc.somnia.network",
  explorerUrl: "https://somnia-testnet.socialscan.io",
  currency: "STT",
};

const somniaDefiAdapters = [
  {
    name: "dreamDEX CLOB",
    category: "onchain-clob",
    execution: "REST/CLI market discovery plus wallet-signed Somnia transaction",
    url: "https://docs.dreamdex.io/ld25g222WKDrLlJMcR41",
    apiDocs: "https://docs.dreamdex.io/ld25g222WKDrLlJMcR41/developers/http-api.md",
    contractDocs: "https://docs.dreamdex.io/ld25g222WKDrLlJMcR41/developers/contracts.md",
    requiredEvidence: ["market quote", "pool address", "signed order transaction hash", "order/fill status", "before/after balance"],
  },
  {
    name: "Somnia Exchange",
    category: "swap",
    execution: "wallet-signed route execution",
    url: "https://somnia.exchange",
    requiredEvidence: ["quote", "wallet simulation", "transaction hash", "before/after balance"],
  },
  {
    name: "Somnex",
    category: "aggregator-liquidity-perps",
    execution: "agent-prepared route or strategy intent",
    url: "https://somnex.xyz",
    requiredEvidence: ["venue quote", "position/risk summary", "transaction hash", "risk snapshot"],
  },
  {
    name: "Potion Swap",
    category: "testnet-dex",
    execution: "manual signer or agent handoff",
    url: "https://potion-swap.xyz",
    requiredEvidence: ["quote screenshot", "pool route", "transaction hash"],
  },
  {
    name: "Custom Somnia DEX adapter",
    category: "builder-router",
    execution: "contract adapter based on Somnia DEX tutorial",
    url: "https://docs.somnia.network/developer/how-to-guides/advanced/build-a-dex-on-somnia",
    requiredEvidence: ["adapter address", "quote response", "fill transaction hash"],
  },
];

export const developerTools: ToolDefinition[] = [
  {
    name: "get_deployment",
    description: "Return ArcPay Somnia deployment metadata and contract addresses.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "derive_agent_id",
    description: "Derive the bytes32 agent id used by AgentRegistry.",
    inputSchema: { type: "object", required: ["slug"], properties: { slug: { type: "string" } } },
  },
  {
    name: "derive_invoice_id",
    description: "Derive the bytes32 invoice id used by AgentInvoiceBook.",
    inputSchema: { type: "object", required: ["publicId"], properties: { publicId: { type: "string" } } },
  },
  {
    name: "derive_claim_hash",
    description: "Derive the claim-code hash used by OperatorControls.",
    inputSchema: { type: "object", required: ["code"], properties: { code: { type: "string" } } },
  },
  {
    name: "derive_privacy_commitment",
    description: "Derive a Privacy Intent commitment or nullifier from secret text.",
    inputSchema: { type: "object", required: ["secret"], properties: { secret: { type: "string" } } },
  },
  {
    name: "privacy_intent_guide",
    description: "Return integration steps for ArcPay Privacy Intents.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "invoice_guide",
    description: "Return integration steps for STT and SOMUSD invoices.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "x402_guide",
    description: "Return integration steps for x402 paid agent endpoints.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "somnia_defi_adapters",
    description: "Return Somnia swap, liquidity, and yield adapter candidates with required audit evidence.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "starter_kit",
    description: "Return the recommended starter-kit files for a Somnia x402 agent.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "roadmap",
    description: "Return the ArcPay Somnia product roadmap.",
    inputSchema: { type: "object", properties: {} },
  },
];

export async function runDeveloperTool(name: string, args: Record<string, unknown> = {}): Promise<ToolResult> {
  switch (name) {
    case "get_deployment":
      return json({ network, deployment });
    case "derive_agent_id":
      return text(id(requiredString(args.slug, "slug")));
    case "derive_invoice_id":
      return text(keccak256(toUtf8Bytes(requiredString(args.publicId, "publicId"))));
    case "derive_claim_hash":
      return text(keccak256(toUtf8Bytes(requiredString(args.code, "code"))));
    case "derive_privacy_commitment":
      return text(keccak256(toUtf8Bytes(requiredString(args.secret, "secret"))));
    case "privacy_intent_guide":
      return text([
        "ArcPay Privacy Intents",
        `Vault: ${deployment.contracts.SomniaPrivacyVault}`,
        `SOMUSD: ${deployment.somUsdToken}`,
        "1. commitment = keccak256(secret).",
        "2. For STT, call createNativeIntent(commitment, encryptedMemoUri) with msg.value.",
        "3. For SOMUSD, approve the vault and call createTokenIntent(commitment, SOMUSD, amount, encryptedMemoUri).",
        "4. Release with releaseIntent(commitment, nullifier, recipient).",
        "5. Cancellation refunds unreleased intents to the operator.",
        "Boundary: this hides metadata and recipient until release; it is not a full shielded pool.",
      ].join("\n"));
    case "invoice_guide":
      return text([
        "ArcPay Somnia Invoices",
        `InvoiceBook: ${deployment.contracts.AgentInvoiceBook}`,
        `SOMUSD: ${deployment.somUsdToken}`,
        "1. invoiceId = keccak256(publicInvoiceId).",
        "2. Create STT invoices with token address(0) and amountWei.",
        "3. Create SOMUSD invoices with the SOMUSD token address and base-unit amount.",
        "4. Pay STT with payNativeInvoice(invoiceId) and exact msg.value.",
        "5. Pay SOMUSD by approving InvoiceBook, then calling payTokenInvoice(invoiceId).",
      ].join("\n"));
    case "x402_guide":
      return text([
        "ArcPay Somnia x402",
        "Server: https://x402.20.208.46.195.nip.io",
        `Registry: ${deployment.contracts.AgentRegistry}`,
        `OrderBook: ${deployment.contracts.AgentOrderBook}`,
        "1. Register an agent slug in AgentRegistry.",
        "2. GET /agent/:slug/work returns HTTP 402 with exact STT payment requirements.",
        "3. Payer calls AgentOrderBook.createOrder(agentId, requestUri) with quoted msg.value.",
        "4. Provider fulfills the order.",
        "5. GET /agent/:slug/work?orderId=... unlocks after Fulfilled or Settled.",
      ].join("\n"));
    case "somnia_defi_adapters":
      return json({
        network,
        adapters: somniaDefiAdapters,
        policy: [
          "No adapter may mark execution complete without a Somnia tx hash or venue response.",
          "dreamDEX integration must use documented market discovery plus wallet-signed order/vault transactions; HTTP API alone is not execution proof.",
          "Every route must carry max slippage, executor, asset pair, and before/after balance evidence.",
          "Yield and LP intents must record drawdown limits and risk notes before wallet signing.",
        ],
      });
    case "starter_kit":
      return json({
        files: [
          "starter-kits/somnia-x402-agent/README.md",
          "starter-kits/somnia-x402-agent/package.json",
          "starter-kits/somnia-x402-agent/src/agent-client.mjs",
          "starter-kits/somnia-x402-agent/src/env.example",
        ],
        commands: [
          "npm install",
          "cp src/env.example .env",
          "node src/agent-client.mjs quote research-agent",
        ],
      });
    case "roadmap":
      return json({
        phases: [
          "Deploy Mintlify and keep /openapi.json + /llms.txt public.",
          "Publish Somnia x402 starter kit and privacy-intent examples.",
          "Operate the hosted MCP-style JSON-RPC bridge with auth and rate limits.",
          "Expand agent discovery with reputation and service analytics.",
          "Package the Somnia x402 gateway, privacy intents, and policy controls as reusable builder infrastructure.",
        ],
      });
    default:
      throw new Error(`Unknown developer tool: ${name}`);
  }
}

function requiredString(value: unknown, key: string) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error(`${key} is required`);
  return text;
}

function json(body: unknown): ToolResult {
  return { contentType: "application/json", body };
}

function text(body: string): ToolResult {
  return { contentType: "text/plain", body };
}
