#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { id, keccak256, toUtf8Bytes } from "ethers";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const deploymentPath = path.join(root, "deployments", "somnia-testnet.json");
const packagedDeploymentPath = path.join(__dirname, "deployment.json");

function readDeployment() {
  const file = fs.existsSync(deploymentPath) ? deploymentPath : packagedDeploymentPath;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const server = new McpServer({
  name: "arcpay-somnia",
  version: "0.1.3",
});

server.tool("get_deployment", "Return Somnia testnet contract addresses and network metadata.", {}, async () => ({
  content: [{ type: "text", text: JSON.stringify(readDeployment(), null, 2) }],
}));

server.tool("derive_agent_id", "Derive the bytes32 agent id used by AgentRegistry.", {
  slug: z.string().min(1),
}, async ({ slug }) => ({
  content: [{ type: "text", text: id(slug) }],
}));

server.tool("derive_invoice_id", "Derive the bytes32 invoice id used by AgentInvoiceBook.", {
  publicId: z.string().min(1),
}, async ({ publicId }) => ({
  content: [{ type: "text", text: keccak256(toUtf8Bytes(publicId)) }],
}));

server.tool("derive_claim_hash", "Derive the on-chain claim-code hash for OperatorControls.", {
  code: z.string().min(1),
}, async ({ code }) => ({
  content: [{ type: "text", text: keccak256(toUtf8Bytes(code)) }],
}));

server.tool("derive_privacy_commitment", "Derive a Privacy Intent commitment or nullifier from secret text.", {
  secret: z.string().min(1),
}, async ({ secret }) => ({
  content: [{ type: "text", text: keccak256(toUtf8Bytes(secret)) }],
}));

server.tool("privacy_intent_guide", "Return builder instructions for integrating ArcPay Privacy Intents on Somnia.", {}, async () => {
  const deployment = readDeployment();
  return {
    content: [{
      type: "text",
      text: [
        "ArcPay Privacy Intents for Somnia",
        `Vault: ${deployment.contracts.SomniaPrivacyVault}`,
        `SOMUSD: ${deployment.somUsdToken}`,
        "commitment = keccak256(secret)",
        "nullifier = keccak256(releaseSecret)",
        "SOMUSD flow: approve vault, then createTokenIntent(commitment, SOMUSD, amount, encryptedMemoUri).",
        "STT flow: createNativeIntent(commitment, encryptedMemoUri) with msg.value.",
        "Release: releaseIntent(commitment, nullifier, recipient).",
        "Boundary: this hides metadata/recipient during intent phase, not a full shielded pool.",
      ].join("\n"),
    }],
  };
});

server.tool("invoice_guide", "Return builder instructions for ArcPay STT/SOMUSD invoices on Somnia.", {}, async () => {
  const deployment = readDeployment();
  return {
    content: [{
      type: "text",
      text: [
        "ArcPay Somnia Invoices",
        `InvoiceBook: ${deployment.contracts.AgentInvoiceBook}`,
        `SOMUSD: ${deployment.somUsdToken}`,
        "invoiceId = keccak256(publicInvoiceId)",
        "Create STT invoice: createInvoice(invoiceId, payerOrZero, address(0), amountWei, metadataUri).",
        "Create SOMUSD invoice: createInvoice(invoiceId, payerOrZero, SOMUSD, amountBaseUnits, metadataUri).",
        "Pay STT: payNativeInvoice(invoiceId) with exact msg.value.",
        "Pay SOMUSD: approve InvoiceBook, then payTokenInvoice(invoiceId).",
        "Cancel unpaid: issuer calls cancelInvoice(invoiceId).",
        "Proof: npm run smoke:live includes on-chain invoice settlement.",
      ].join("\n"),
    }],
  };
});

server.tool("x402_guide", "Return builder instructions for the ArcPay Somnia x402 payment-gated agent server.", {}, async () => {
  const deployment = readDeployment();
  return {
    content: [{
      type: "text",
      text: [
        "ArcPay Somnia x402",
        `OrderBook: ${deployment.contracts.AgentOrderBook}`,
        `Registry: ${deployment.contracts.AgentRegistry}`,
        "Run: npm run x402",
        "Protected resource: GET /agent/:slug/work",
        "No order returns HTTP 402 with exact STT payment requirements.",
        "Pay by calling AgentOrderBook.createOrder(agentId, requestUri) with quoted msg.value.",
        "Verify: POST /x402/verify with { orderId, agentSlug }.",
        "Unlock: GET /agent/:slug/work?orderId=... after Fulfilled or Settled.",
        "Proof: npm run smoke:x402.",
      ].join("\n"),
    }],
  };
});

server.tool("agent_onboarding_payload", "Generate a bring-your-own-agent onboarding payload for ArcPay Somnia.", {
  slug: z.string().min(1),
  endpoint: z.string().url().optional(),
  priceStt: z.string().optional(),
}, async ({ slug, endpoint, priceStt = "0.001" }) => {
  const deployment = readDeployment();
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        protocol: "arcpay-somnia-agent-onboarding",
        network: deployment.network,
        chainId: deployment.chainId,
        agentSlug: slug,
        agentId: id(slug),
        endpoint: endpoint ?? `https://x402.20.208.46.195.nip.io/agent/${slug}/work`,
        priceStt,
        contracts: {
          registry: deployment.contracts.AgentRegistry,
          orderBook: deployment.contracts.AgentOrderBook,
          policy: deployment.contracts.TreasuryPolicy,
          operatorControls: deployment.contracts.OperatorControls,
          spendCardVault: deployment.contracts.AgentSpendCardVault,
          reputation: deployment.contracts.AgentReputationBook,
        },
        nextSteps: [
          "Register the slug/capabilities on AgentRegistry.",
          "Create or redeem a claim code in OperatorControls if the agent is external.",
          "Attach workspace policy and optional per-agent limits.",
          "Quote x402, create escrowed order, verify/fulfill, then record audit evidence.",
        ],
      }, null, 2),
    }],
  };
});

server.tool("somusd_card_plan", "Generate a SOMUSD spend-card setup plan for an agent.", {
  slug: z.string().min(1),
  agentWallet: z.string().optional(),
  limitSomusd: z.string().optional(),
}, async ({ slug, agentWallet = "<agent-wallet-address>", limitSomusd = "5" }) => {
  const deployment = readDeployment();
  const cardSlug = `${slug}-somusd-card`;
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        protocol: "arcpay-somnia-somusd-card",
        network: deployment.network,
        chainId: deployment.chainId,
        cardSlug,
        cardId: keccak256(toUtf8Bytes(cardSlug)),
        agentWallet,
        limitSomusd,
        contracts: {
          spendCardVault: deployment.contracts.AgentSpendCardVault,
          somusd: deployment.somUsdToken,
        },
        calls: [
          "SOMUSD.approve(AgentSpendCardVault, amountBaseUnits)",
          "AgentSpendCardVault.createCard(cardId, agentWallet, SOMUSD, limitBaseUnits, label)",
          "AgentSpendCardVault.topUpCard(cardId, amountBaseUnits)",
          "AgentSpendCardVault.setCardStatus(cardId, true|false)",
          "AgentSpendCardVault.spendCard(cardId, recipient, amountBaseUnits, memo) by assigned agent",
        ],
        proofRequired: ["cardId", "createCard tx hash", "approve tx hash", "topUpCard tx hash", "cards(cardId) state", "spend tx hash if used"],
      }, null, 2),
    }],
  };
});

server.tool("policy_plan", "Generate global workspace and per-agent policy requirements for ArcPay execution.", {
  slug: z.string().min(1),
  dailyLimit: z.string().optional(),
}, async ({ slug, dailyLimit = "10" }) => ({
  content: [{
    type: "text",
    text: JSON.stringify({
      protocol: "arcpay-somnia-policy-plan",
      agentSlug: slug,
      agentId: id(slug),
      workspacePolicy: {
        scope: "Global workspace controls",
        enforcedAcross: ["payments", "orders", "x402", "cards", "invoices", "privacy", "swaps", "yield"],
        checks: ["wallet required", "treasury pause", "allowed token", "allowed network", "risk floor", "per-transaction max", "daily max"],
      },
      agentPolicy: {
        scope: "Per-agent controls",
        dailyLimitSttOrSomusd: dailyLimit,
        allowedActions: ["x402 work", "escrow order", "SOMUSD card spend"],
        evidenceRequired: ["tx hash", "x402 verification", "ArcPay order id", "risk or receipt evidence when applicable"],
      },
    }, null, 2),
  }],
}));

server.tool("evidence_template", "Return the audit evidence checklist ArcPay requires before an agent can claim completion.", {
  slug: z.string().optional(),
}, async ({ slug = "research-agent" }) => ({
  content: [{
    type: "text",
    text: [
      `Agent: ${slug}`,
      "Wallet address and chain id 50312.",
      "Agent slug, agent id, registered endpoint, and capability metadata.",
      "Policy snapshot: global workspace policy plus per-agent limits.",
      "x402 quote response: HTTP status, payment requirements, request URI, amount.",
      "Order evidence: createOrder tx hash, order id, state before/after fulfill, settle/refund tx.",
      "Card evidence: card id, approve/top-up tx, card state, spend tx if used.",
      "Privacy evidence: commitment, encrypted memo URI, create/release tx, nullifier.",
      "Invoice evidence: invoice id, create/pay/cancel tx, payer and token state.",
      "Somnia Agents evidence: receipt id/output when Parse Website, JSON API Request, or LLM Inference is used.",
      "Audit page screenshot and explorer links for every tx hash.",
    ].join("\n"),
  }],
}));

server.tool("somnia_defi_adapters", "Return Somnia DEX, swap, liquidity, and yield adapter candidates with required audit evidence.", {}, async () => ({
  content: [{
    type: "text",
    text: [
      "ArcPay Somnia DeFi Adapters",
      "dreamDEX CLOB: fully on-chain spot CLOB with zero maker/taker fees, USDso settlement, REST/WebSocket/CLI/CCXT access. Evidence: market quote, pool address, signed order tx hash, order/fill status. Docs: https://docs.dreamdex.io/ld25g222WKDrLlJMcR41",
      "Somnia Exchange: native swap venue. Evidence: route quote, wallet simulation, tx hash, before/after balance. URL: https://somnia.exchange",
      "Somnex: aggregator, liquidity, and perps venue. Evidence: venue quote, position/risk summary, tx hash. URL: https://somnex.xyz",
      "Potion Swap: testnet DEX candidate. Evidence: quote screenshot, pool route, tx hash. URL: https://potion-swap.xyz",
      "Custom Somnia DEX adapter: builder-owned router from Somnia DEX tutorial. Evidence: adapter address, quote response, fill tx. Docs: https://docs.somnia.network/developer/how-to-guides/advanced/build-a-dex-on-somnia",
      "Policy: ArcPay records route/yield intent first. Completion requires real Somnia transaction evidence. dreamDEX HTTP API responses are quote/build evidence, not execution proof without a signed tx.",
    ].join("\n"),
  }],
}));

server.tool("somnia_agents", "Return official Somnia Agents IDs, contracts, receipt policy, and ArcPay integration guidance.", {}, async () => ({
  content: [{
    type: "text",
    text: JSON.stringify({
      network: "Somnia Testnet",
      agentsUrl: "https://agents.testnet.somnia.network",
      docsUrl: "https://docs.somnia.network/agents",
      contracts: {
        platformContract: "0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776",
        agentRegistry: "0x08D1Fc808f1983d2Ea7B63a28ECD4d8C885Cd02A",
      },
      agents: [
        {
          name: "LLM Parse Website",
          id: "12875401142070969085",
          methods: 2,
          cost: "0.10 STT/SOMI per validator",
          arcpayUse: "Parse HTML websites into structured evidence before order settlement.",
        },
        {
          name: "LLM Inference",
          id: "12847293847561029384",
          methods: 4,
          cost: "variable",
          arcpayUse: "Generate receipt-backed reasoning for treasury decisions and risk notes.",
        },
        {
          name: "JSON API Request",
          id: "13174292974160097713",
          methods: 6,
          cost: "variable",
          arcpayUse: "Fetch public APIs and attach selector output to audit records.",
        },
      ],
      receiptPolicy: [
        "Attach Somnia Agent receipts to ArcPay orders, invoices, privacy intents, or audit records.",
        "Do not mark completion from inference alone; require receipt plus ArcPay order state or tx hash.",
        "Use JSON API Request for structured APIs, LLM Parse Website for HTML pages, and LLM Inference for reasoning.",
      ],
    }, null, 2),
  }],
}));

server.tool("demo_path", "Return the operator demo path for ArcPay Somnia.", {}, async () => ({
  content: [{
    type: "text",
    text: [
      "Connect an EVM wallet to Somnia Testnet.",
      "Register an agent on /agents.",
      "Set policy and allowlist the agent on /policies.",
      "Create and settle an escrowed agent order on /orders.",
      "Create/redeem claim codes and trigger webhook breaker on /operator.",
      "Request and fulfill risk oracle result on /oracle.",
      "Create and release encrypted Privacy Intents with nullifiers on /privacy.",
      "Create, pay, cancel, and sync STT/SOMUSD invoices on /invoices.",
      "Show /audit and /proofs.",
    ].join("\n"),
  }],
}));

server.tool("smoke_commands", "Return the verification commands operators can run locally and against Somnia testnet.", {}, async () => ({
  content: [{
    type: "text",
    text: [
      "npm run build:frontend",
      "npm test",
      "npm run check:worker",
      "npm run check:x402",
      "npm run smoke:auth",
      "npm run smoke:live",
      "npm run smoke:x402",
    ].join("\n"),
  }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
