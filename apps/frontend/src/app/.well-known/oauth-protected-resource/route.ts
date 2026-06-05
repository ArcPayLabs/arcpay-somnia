import { NextResponse } from "next/server";

const origin = "https://arcpay-somnia.vercel.app";

export function GET() {
  return NextResponse.json({
    resource: origin,
    authorization_servers: [`${origin}/.well-known/oauth-authorization-server`],
    bearer_methods_supported: ["header"],
    scopes_supported: [
      "wallet:read",
      "workspace:read",
      "mcp:read",
      "mcp:tools",
      "x402:read",
      "records:read",
      "records:write",
    ],
    resource_documentation: `${origin}/docs/overview`,
    protected_resources: [
      `${origin}/api/mcp`,
      `${origin}/api/developer/tools`,
      "https://x402.20.208.46.195.nip.io/agent/research-agent/work",
    ],
  });
}
