import { NextResponse, type NextRequest } from "next/server";

const MARKDOWN_HOME = `# ArcPay Somnia

ArcPay Somnia is a control plane and developer distribution layer for AI-agent treasury operations on Somnia Testnet.

## Agent entrypoints

- App: https://arcpay-somnia.vercel.app
- Docs: https://arcpay-somnia.vercel.app/docs/overview
- OpenAPI: https://arcpay-somnia.vercel.app/openapi.json
- Hosted MCP bridge: https://arcpay-somnia.vercel.app/api/mcp
- Agent skills index: https://arcpay-somnia.vercel.app/.well-known/agent-skills/index.json
- Somnia Agents status: https://arcpay-somnia.vercel.app/api/somnia/agents/status
- x402 gateway: https://x402.20.208.46.195.nip.io

## Capabilities

- Agent registry and bring-your-own-agent onboarding
- x402 protected paid agent work
- Official Somnia Agents receipt integration
- STT escrow and order verification
- SOMUSD spend cards
- Privacy intents and audit release records
- Risk, reputation, analytics, CLI, MCP, and starter kits
`;

export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  if (request.nextUrl.pathname === "/" && accept.includes("text/markdown")) {
    return new NextResponse(MARKDOWN_HOME, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(MARKDOWN_HOME.split(/\s+/).length),
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
