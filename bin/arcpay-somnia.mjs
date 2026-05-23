#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { id, keccak256, toUtf8Bytes } from "ethers";

const root = process.cwd();
const deploymentPath = path.join(root, "deployments", "somnia-testnet.json");

function deployment() {
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Missing ${deploymentPath}. Run npm run deploy:somnia first.`);
  }
  return JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
}

function usage() {
  console.log(`ArcPay Somnia CLI

Commands:
  arcpay-somnia contracts              Print deployed Somnia addresses
  arcpay-somnia wallet                 Print network wallet instructions
  arcpay-somnia agent-id <slug>        Derive bytes32 agent id
  arcpay-somnia claim-hash <code>      Derive claim-code hash
  arcpay-somnia privacy-commit <text>  Derive Privacy Intent commitment/nullifier
  arcpay-somnia privacy-abi            Print Privacy Intent contract ABI
  arcpay-somnia privacy-guide          Print builder integration guide
  arcpay-somnia demo-path              Print judge demo steps
  arcpay-somnia mcp-config             Print MCP host config
`);
}

const [, , command, ...args] = process.argv;

try {
  if (!command || command === "help" || command === "--help") {
    usage();
  } else if (command === "contracts") {
    const info = deployment();
    console.log(JSON.stringify(info.contracts, null, 2));
  } else if (command === "wallet") {
    console.log("Add Somnia Testnet to an EVM wallet:");
    console.log("Chain ID: 50312 / 0xc488");
    console.log("RPC: https://dream-rpc.somnia.network");
    console.log("Currency: STT");
    console.log("Explorer: https://somnia-testnet.socialscan.io");
  } else if (command === "agent-id") {
    console.log(id(args.join(" ") || "agent"));
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
  } else if (command === "demo-path") {
    console.log([
      "1. Connect wallet and switch to Somnia Testnet.",
      "2. Open /agents and register a provider.",
      "3. Open /policies, set limits, and allow the agent.",
      "4. Open /orders and create an escrowed order.",
      "5. Move order through accept -> processing -> fulfill -> settle or fail/refund.",
      "6. Open /operator for claim-code and webhook circuit-breaker proof.",
      "7. Open /oracle for Somnia agent risk callback proof.",
      "8. Open /privacy for encrypted-metadata payment intents.",
      "9. Open /proofs for deployed addresses and build commands.",
    ].join("\n"));
  } else if (command === "mcp-config") {
    console.log(JSON.stringify({
      mcpServers: {
        "arcpay-somnia": {
          command: "node",
          args: [path.join(root, "apps", "mcp", "server.mjs")],
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
