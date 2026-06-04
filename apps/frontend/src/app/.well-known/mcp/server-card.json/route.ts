import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    schema_version: "0.1",
    serverInfo: {
      name: "ArcPay Somnia MCP",
      version: "0.1.5",
      description: "Hosted ArcPay tools for Somnia agent treasury, x402, privacy, invoices, and evidence planning.",
    },
    transport: {
      type: "http",
      endpoint: "https://arcpay-somnia.vercel.app/api/mcp",
      auth: "bearer-or-public-rate-limited",
    },
    capabilities: {
      tools: true,
      resources: false,
      prompts: false,
    },
    packages: {
      npm: "@arcpaylabs/somnia-mcp",
      cli: "@arcpaylabs/somnia-cli",
      starter: "@arcpaylabs/somnia-x402-agent-starter",
    },
  });
}
