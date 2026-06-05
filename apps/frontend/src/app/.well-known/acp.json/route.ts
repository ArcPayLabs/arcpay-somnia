import { NextResponse } from "next/server";

const origin = "https://arcpay-somnia.vercel.app";

export function GET() {
  return NextResponse.json({
    protocol: "agentic-commerce-protocol",
    name: "ArcPay Somnia",
    version: "0.1.0",
    website: origin,
    network: {
      chain: "somnia-testnet",
      currency: "STT",
    },
    capabilities: [
      "x402-paid-agent-work",
      "mcp-tools",
      "agent-onboarding",
      "policy-gated-spend",
      "privacy-intents",
      "somnia-agents",
      "audit-evidence",
    ],
    discovery: {
      openapi: `${origin}/openapi.json`,
      llms: `${origin}/llms.txt`,
      apiCatalog: `${origin}/.well-known/api-catalog`,
      mcp: `${origin}/.well-known/mcp/server-card.json`,
      x402: `${origin}/platform/v2/x402/discovery/resources`,
    },
  });
}
