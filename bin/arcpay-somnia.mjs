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
  } else if (command === "demo-path") {
    console.log([
      "1. Connect wallet and switch to Somnia Testnet.",
      "2. Open /agents and register a provider.",
      "3. Open /policies, set limits, and allow the agent.",
      "4. Open /orders and create an escrowed order.",
      "5. Move order through accept -> processing -> fulfill -> settle or fail/refund.",
      "6. Open /operator for claim-code and webhook circuit-breaker proof.",
      "7. Open /oracle for Somnia agent risk callback proof.",
      "8. Open /proofs for deployed addresses and build commands.",
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
