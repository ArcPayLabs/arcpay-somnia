import { NextResponse } from "next/server";

const origin = "https://arcpay-somnia.vercel.app";

export function GET() {
  return NextResponse.json({
    ucp: {
      version: "0.1.0",
      profile: "agent-commerce",
    },
    protocol: "universal-commerce-protocol",
    name: "ArcPay Somnia",
    website: origin,
    services: [
      {
        id: "somnia-x402-agent-work",
        name: "Somnia x402 agent work",
        capabilities: ["paid_agent_resource", "policy_escrow", "audit_evidence"],
        endpoint: "https://x402.20.208.46.195.nip.io/agent/research-agent/work",
      },
    ],
    capabilities: ["x402", "mcp", "agent_onboarding", "wallet_auth", "privacy_intents"],
    payments: {
      x402: `${origin}/platform/v2/x402/discovery/resources`,
      protectedResource: "https://x402.20.208.46.195.nip.io/agent/research-agent/work",
    },
    agentAccess: {
      auth: `${origin}/auth.md`,
      mcp: `${origin}/api/mcp`,
      skills: `${origin}/.well-known/agent-skills/index.json`,
    },
  });
}
