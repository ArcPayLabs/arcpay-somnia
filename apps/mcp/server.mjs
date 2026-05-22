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

function readDeployment() {
  return JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
}

const server = new McpServer({
  name: "arcpay-somnia",
  version: "0.1.0",
});

server.tool("get_deployment", "Return Somnia testnet contract addresses and network metadata.", {}, async () => ({
  content: [{ type: "text", text: JSON.stringify(readDeployment(), null, 2) }],
}));

server.tool("derive_agent_id", "Derive the bytes32 agent id used by AgentRegistry.", {
  slug: z.string().min(1),
}, async ({ slug }) => ({
  content: [{ type: "text", text: id(slug) }],
}));

server.tool("derive_claim_hash", "Derive the on-chain claim-code hash for OperatorControls.", {
  code: z.string().min(1),
}, async ({ code }) => ({
  content: [{ type: "text", text: keccak256(toUtf8Bytes(code)) }],
}));

server.tool("demo_path", "Return the judge demo path for ArcPay Somnia.", {}, async () => ({
  content: [{
    type: "text",
    text: [
      "Connect an EVM wallet to Somnia Testnet.",
      "Register an agent on /agents.",
      "Set policy and allowlist the agent on /policies.",
      "Create and settle an escrowed agent order on /orders.",
      "Create/redeem claim codes and trigger webhook breaker on /operator.",
      "Request and fulfill risk oracle result on /oracle.",
      "Show /audit and /proofs.",
    ].join("\n"),
  }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
