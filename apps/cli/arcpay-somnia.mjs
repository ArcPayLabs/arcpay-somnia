#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { id, keccak256, toUtf8Bytes } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoDeploymentPath = path.join(process.cwd(), "deployments", "somnia-testnet.json");
const packageDeploymentPath = path.join(__dirname, "deployment.json");

function deployment() {
  const file = fs.existsSync(repoDeploymentPath) ? repoDeploymentPath : packageDeploymentPath;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function usage() {
  console.log(`ArcPay Somnia CLI

Commands:
  arcpay-somnia contracts              Print deployed Somnia addresses
  arcpay-somnia wallet                 Print network wallet instructions
  arcpay-somnia agent-id <slug>        Derive bytes32 agent id
  arcpay-somnia invoice-id <publicId>  Derive bytes32 invoice id
  arcpay-somnia claim-hash <code>      Derive claim-code hash
  arcpay-somnia privacy-commit <text>  Derive Privacy Intent commitment/nullifier
  arcpay-somnia privacy-abi            Print Privacy Intent contract ABI
  arcpay-somnia privacy-guide          Print builder integration guide
  arcpay-somnia invoice-guide          Print invoice settlement guide
  arcpay-somnia x402-guide             Print x402 HTTP payment gate guide
  arcpay-somnia somnia-agents          Print official Somnia Agents IDs and ArcPay receipt policy
  arcpay-somnia defi-adapters          Print Somnia DEX, swap, and yield adapter map
  arcpay-somnia demo-path              Print operator demo steps
  arcpay-somnia smoke                  Print smoke-test commands
  arcpay-somnia mcp-config             Print MCP host config
`);
}

const [, , command, ...args] = process.argv;

try {
  if (!command || command === "help" || command === "--help") {
    usage();
  } else if (command === "contracts") {
    console.log(JSON.stringify(deployment().contracts, null, 2));
  } else if (command === "wallet") {
    console.log("Add Somnia Testnet to an EVM wallet:");
    console.log("Chain ID: 50312 / 0xc488");
    console.log("RPC: https://dream-rpc.somnia.network");
    console.log("Currency: STT");
    console.log("Explorer: https://somnia-testnet.socialscan.io");
  } else if (command === "agent-id") {
    console.log(id(args.join(" ") || "agent"));
  } else if (command === "invoice-id") {
    console.log(keccak256(toUtf8Bytes(args.join(" ") || "invoice")));
  } else if (command === "claim-hash") {
    console.log(keccak256(toUtf8Bytes(args.join(" "))));
  } else if (command === "privacy-commit") {
    console.log(keccak256(toUtf8Bytes(args.join(" "))));
  } else if (command === "privacy-abi") {
    console.log(JSON.stringify([
      "function createNativeIntent(bytes32 commitment,string encryptedMemoUri) payable",
      "function createTokenIntent(bytes32 commitment,address token,uint256 amount,string encryptedMemoUri)",
      "function releaseIntent(bytes32 commitment,bytes32 nullifier,address recipient)",
      "function cancelIntent(bytes32 commitment)",
      "function intents(bytes32 commitment) view returns (address operator,address token,uint256 amount,string encryptedMemoUri,bool released,bool cancelled,uint256 createdAt)",
    ], null, 2));
  } else if (command === "privacy-guide") {
    const info = deployment();
    console.log([
      "ArcPay Privacy Intents for Somnia",
      "",
      `Vault: ${info.contracts.SomniaPrivacyVault}`,
      `SOMUSD: ${info.somUsdToken}`,
      "",
      "1. commitment = keccak256(secret)",
      "2. nullifier = keccak256(releaseSecret)",
      "3. approve SOMUSD to the vault for token intents",
      "4. call createTokenIntent(commitment, SOMUSD, amount, encryptedMemoUri)",
      "5. later call releaseIntent(commitment, nullifier, recipient)",
      "",
      "Privacy boundary: metadata and recipient are hidden during intent phase; release transfer is public.",
    ].join("\n"));
  } else if (command === "invoice-guide") {
    const info = deployment();
    console.log([
      "ArcPay Somnia Invoices",
      "",
      `InvoiceBook: ${info.contracts.AgentInvoiceBook}`,
      `SOMUSD: ${info.somUsdToken}`,
      "",
      "1. invoiceId = keccak256(publicInvoiceId).",
      "2. STT invoice: createInvoice(invoiceId, payerOrZero, address(0), amountWei, metadataUri).",
      "3. SOMUSD invoice: createInvoice(invoiceId, payerOrZero, SOMUSD, amountBaseUnits, metadataUri).",
      "4. Payer signs payNativeInvoice(invoiceId) with exact msg.value or approves SOMUSD then payTokenInvoice(invoiceId).",
      "5. Issuer can cancel unpaid invoices with cancelInvoice(invoiceId).",
      "",
      "Proof command: npm run smoke:live",
    ].join("\n"));
  } else if (command === "x402-guide") {
    const info = deployment();
    console.log([
      "ArcPay Somnia x402",
      "",
      `Registry: ${info.contracts.AgentRegistry}`,
      `OrderBook: ${info.contracts.AgentOrderBook}`,
      "",
      "1. Register an agent slug in AgentRegistry.",
      "2. GET https://x402.20.208.46.195.nip.io/agent/:slug/work returns HTTP 402 requirements.",
      "3. Payer calls AgentOrderBook.createOrder(agentId, requestUri) with quoted msg.value.",
      "4. Provider fulfills the order.",
      "5. GET /agent/:slug/work?orderId=... unlocks only after Fulfilled or Settled.",
      "",
      "Proof command: npm run smoke:x402",
    ].join("\n"));
  } else if (command === "somnia-agents") {
    console.log(JSON.stringify({
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
    }, null, 2));
  } else if (command === "defi-adapters") {
    console.log([
      "ArcPay Somnia DeFi Adapters",
      "",
      "dreamDEX CLOB",
      "- Role: fully on-chain central limit order book with zero maker/taker fees",
      "- Execution: REST/CLI market discovery plus wallet-signed Somnia transaction",
      "- Evidence: market quote, pool address, signed order tx hash, order/fill status, before/after balance",
      "- Docs: https://docs.dreamdex.io/ld25g222WKDrLlJMcR41",
      "- Testnet pools: SOMI/USDso 0x259fD6559214dd5aD3752322426eA9F9fABEFff4, WBTC/USDso 0x3605f28aA7C50e7441211e77Cb0762d49539326C, WETH/USDso 0xD180195da5459C7a0DEA188ed61216ec43682b50",
      "",
      "Somnia Exchange",
      "- Role: native swap venue",
      "- Evidence: route quote, wallet simulation, tx hash, before/after balance",
      "- URL: https://somnia.exchange",
      "",
      "Somnex",
      "- Role: aggregator, liquidity, and perps venue",
      "- Evidence: venue quote, position/risk summary, tx hash",
      "- URL: https://somnex.xyz",
      "",
      "Potion Swap",
      "- Role: testnet DEX candidate",
      "- Evidence: quote screenshot, pool route, tx hash",
      "- URL: https://potion-swap.xyz",
      "",
      "Custom Somnia DEX adapter",
      "- Role: builder-owned router from Somnia DEX tutorial",
      "- Evidence: adapter address, quote response, fill tx",
      "- Docs: https://docs.somnia.network/developer/how-to-guides/advanced/build-a-dex-on-somnia",
      "",
      "Policy: ArcPay records route/yield intent first. Completion requires real Somnia transaction evidence. dreamDEX HTTP API responses are quote/build evidence, not execution proof without a signed tx.",
    ].join("\n"));
  } else if (command === "demo-path") {
    console.log([
      "1. Connect wallet and switch to Somnia Testnet.",
      "2. Register a provider on /agents.",
      "3. Set policy and allowlist the agent on /policies.",
      "4. Create an escrowed order on /orders.",
      "5. Move order through accept -> processing -> fulfill -> settle or fail/refund.",
      "6. Create claim codes and webhook circuit breakers on /operator.",
      "7. Request risk scoring on /oracle.",
      "8. Create and release encrypted Privacy Intents on /privacy.",
      "9. Create, pay, cancel, and sync STT/SOMUSD invoices on /invoices.",
      "10. Show /audit, /status, and /proofs.",
    ].join("\n"));
  } else if (command === "smoke") {
    console.log([
      "Run local + live verification:",
      "npm run build:frontend",
      "npm test",
      "npm run check:worker",
      "npm run check:x402",
      "npm run smoke:auth",
      "npm run smoke:live",
      "npm run smoke:x402",
    ].join("\n"));
  } else if (command === "mcp-config") {
    console.log(JSON.stringify({
      mcpServers: {
        "arcpay-somnia": {
          command: "arcpay-somnia-mcp",
        },
      },
    }, null, 2));
  } else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
