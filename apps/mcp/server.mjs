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
      "Create and release encrypted Privacy Intents with nullifiers on /privacy.",
      "Show /audit and /proofs.",
    ].join("\n"),
  }],
}));

server.tool("smoke_commands", "Return the verification commands judges can run locally and against Somnia testnet.", {}, async () => ({
  content: [{
    type: "text",
    text: [
      "npm run build:frontend",
      "npm test",
      "npm run check:worker",
      "npm run smoke:auth",
      "npm run smoke:live",
    ].join("\n"),
  }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
