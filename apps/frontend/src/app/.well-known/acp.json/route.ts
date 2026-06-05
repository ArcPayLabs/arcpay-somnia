import { NextResponse } from "next/server";

const origin = "https://arcpay-somnia.vercel.app";

export function GET() {
  return NextResponse.json({
    protocol: {
      name: "acp",
      version: "0.1.0",
    },
    name: "ArcPay Somnia",
    version: "0.1.0",
    api_base_url: origin,
    transports: ["https", "mcp", "x402"],
    supported_transports: ["https", "mcp", "x402"],
    website: origin,
    network: {
      chain: "somnia-testnet",
      currency: "STT",
    },
    capabilities: {
      services: [
        {
          id: "somnia-agent-treasury",
          name: "Somnia agent treasury",
          description: "Policy-gated x402 work, Somnia Agents, privacy intents, cards, invoices, and audit evidence.",
          payment_protocols: ["x402"],
          auth: `${origin}/auth.md`,
          openapi: `${origin}/openapi.json`,
        },
      ],
      features: [
        "x402-paid-agent-work",
        "mcp-tools",
        "agent-onboarding",
        "policy-gated-spend",
        "privacy-intents",
        "somnia-agents",
        "audit-evidence",
      ],
    },
    discovery: {
      openapi: `${origin}/openapi.json`,
      llms: `${origin}/llms.txt`,
      apiCatalog: `${origin}/.well-known/api-catalog`,
      mcp: `${origin}/.well-known/mcp/server-card.json`,
      x402: `${origin}/platform/v2/x402/discovery/resources`,
    },
  });
}
