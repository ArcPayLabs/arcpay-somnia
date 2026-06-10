#!/usr/bin/env node
import "dotenv/config";
import { id, keccak256, toUtf8Bytes } from "ethers";

const serverUrl = (process.env.ARCPAY_X402_SERVER_URL || "https://x402.20.208.46.195.nip.io").replace(/\/+$/, "");
const appUrl = (process.env.ARCPAY_APP_URL || "https://arcpay-somnia.vercel.app").replace(/\/+$/, "");
const chainId = 50312;
const contracts = {
  registry: "0x350F8f29a5A10eE4d85642CE3AB72497982ee09D",
  orderBook: "0x6A07886d465Bd64ED3264F4e824C1dF2884a7B45",
  policy: "0x4c0f962e6555399f45C628DC7F77d4cC6171BB2A",
  operatorControls: "0xb7b26AD2cCBf6613A43f2Db4a550eDF1D7dB8b32",
  spendCardVault: "0x0480E467bA12E33DA163FeA45a20C30133F84B93",
  privacyVault: "0x6948a15dED7F6708BD4DfD8c3Ee5314bC5B53D14",
  reputation: "0xBB9aB7d9e2ad5205F390580119b139bce84C8096",
  somusd: "0x02b8316775057e2096471473663d51ceafbe3e3b",
};
const [, , command = "help", arg1 = "research-agent", arg2 = "research-agent"] = process.argv;

async function main() {
  if (command === "quote") {
    const body = await getJson(`/x402/payment-requirements/${encodeURIComponent(arg1)}`);
    print(body);
  } else if (command === "locked") {
    const response = await fetch(`${serverUrl}/agent/${encodeURIComponent(arg1)}/work`);
    const body = await response.json();
    print({ status: response.status, body });
  } else if (command === "verify") {
    const body = await postJson("/x402/verify", { orderId: arg1, agentSlug: arg2 });
    print(body);
  } else if (command === "unlock") {
    const body = await getJson(`/agent/${encodeURIComponent(arg1)}/work?orderId=${encodeURIComponent(arg2)}`);
    print(body);
  } else if (command === "agent-id") {
    console.log(id(arg1));
  } else if (command === "onboard") {
    print(onboardPayload(arg1, arg2));
  } else if (command === "card") {
    print(cardPlan(arg1, arg2));
  } else if (command === "policy") {
    print(policyPlan(arg1, arg2));
  } else if (command === "evidence") {
    print(evidenceTemplate(arg1));
  } else {
    console.log([
      "ArcPay Somnia x402 Agent Starter",
      "",
      "Commands:",
      "  node src/agent-client.mjs quote <agentSlug>",
      "  node src/agent-client.mjs locked <agentSlug>",
      "  node src/agent-client.mjs verify <orderId> <agentSlug>",
      "  node src/agent-client.mjs unlock <agentSlug> <orderId>",
      "  node src/agent-client.mjs agent-id <agentSlug>",
      "  node src/agent-client.mjs onboard <agentSlug> <endpoint>",
      "  node src/agent-client.mjs card <agentSlug> <agentWallet>",
      "  node src/agent-client.mjs policy <agentSlug> <dailyLimit>",
      "  node src/agent-client.mjs evidence <agentSlug>",
    ].join("\n"));
  }
}

async function getJson(path) {
  const response = await fetch(`${serverUrl}${path}`);
  const body = await response.json();
  if (!response.ok && response.status !== 402) throw new Error(body.error || `HTTP ${response.status}`);
  return body;
}

async function postJson(path, payload) {
  const response = await fetch(`${serverUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
  return body;
}

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}

function onboardPayload(agentSlug, endpoint = `${serverUrl}/agent/${agentSlug}/work`) {
  return {
    protocol: "arcpay-somnia-agent-onboarding",
    chain: "somnia-testnet",
    chainId,
    app: appUrl,
    x402Server: serverUrl,
    agentSlug,
    agentId: id(agentSlug),
    endpoint,
    contracts,
    nextSteps: [
      "Register the agent slug/capabilities in ArcPay or AgentRegistry.",
      "If external, create/redeem an OperatorControls claim code.",
      "Attach workspace policy and optional per-agent limits.",
      "Use quote -> create order -> verify -> fulfill -> unlock for x402 paid work.",
    ],
  };
}

function cardPlan(agentSlug, agentWallet = "<agent-wallet-address>") {
  const cardSlug = `${agentSlug}-somusd-card`;
  return {
    protocol: "arcpay-somnia-somusd-card",
    chainId,
    agentSlug,
    agentWallet,
    cardSlug,
    cardId: keccak256(toUtf8Bytes(cardSlug)),
    contracts: {
      spendCardVault: contracts.spendCardVault,
      somusd: contracts.somusd,
    },
    calls: [
      "approve SOMUSD to AgentSpendCardVault",
      "createCard(cardId, agentWallet, SOMUSD, limitBaseUnits, label)",
      "topUpCard(cardId, amountBaseUnits)",
      "setCardStatus(cardId, true) before spend",
      "agent calls spendCard(cardId, recipient, amountBaseUnits, memo)",
    ],
  };
}

function policyPlan(agentSlug, dailyLimit = "10") {
  return {
    protocol: "arcpay-somnia-policy-plan",
    agentSlug,
    agentId: id(agentSlug),
    workspacePolicy: ["treasury pause", "allowed token", "allowed network", "risk floor", "per-tx max", "daily max"],
    agentPolicy: {
      dailyLimit,
      allowedActions: ["x402", "order", "card-spend"],
      evidenceRequired: ["tx hash", "x402 verification", "order state", "risk/receipt evidence where applicable"],
    },
  };
}

function evidenceTemplate(agentSlug) {
  return {
    agentSlug,
    required: [
      "agent id and registration tx or claim-code redemption",
      "policy snapshot before action",
      "x402 quote response or order request",
      "Somnia tx hash for every signed operation",
      "order/card/invoice/privacy state after execution",
      "audit page record and explorer URL",
    ],
  };
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
