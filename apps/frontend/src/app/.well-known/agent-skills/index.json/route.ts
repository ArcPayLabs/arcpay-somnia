import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

const skills = [
  {
    name: "ArcPay Somnia x402 agent payments",
    type: "mcp-tool",
    description: "Plan and verify x402 paid Somnia agent work with escrow evidence.",
    url: "https://arcpay-somnia.vercel.app/api/mcp",
  },
  {
    name: "ArcPay Somnia privacy intents",
    type: "mcp-tool",
    description: "Prepare privacy commitments, nullifiers, release notes, and audit evidence.",
    url: "https://arcpay-somnia.vercel.app/api/mcp",
  },
  {
    name: "ArcPay Somnia starter kit",
    type: "npm-package",
    description: "Plug-and-play client for builders selling or consuming paid agent work through ArcPay x402.",
    url: "https://www.npmjs.com/package/@arcpaylabs/somnia-x402-agent-starter",
  },
  {
    name: "ArcPay Somnia official agent receipts",
    type: "api",
    description: "Expose official Somnia Agents IDs, platform contracts, and receipt requirements for ArcPay order/audit flows.",
    url: "https://arcpay-somnia.vercel.app/api/somnia/agents/status",
  },
].map((skill) => ({
  ...skill,
  sha256: createHash("sha256").update(`${skill.name}:${skill.url}`).digest("hex"),
}));

export function GET() {
  return NextResponse.json({
    $schema: "https://agentskills.io/schemas/agent-skills-index-v0.2.json",
    name: "ArcPay Somnia agent skills",
    description: "Discovery index for ArcPay Somnia agent treasury, x402, privacy, and evidence tools.",
    skills,
  });
}
