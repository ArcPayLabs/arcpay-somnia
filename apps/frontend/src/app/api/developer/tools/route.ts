import { NextResponse } from "next/server";
import { developerTools, runDeveloperTool } from "@somnia/lib/server/developer-tools";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "arcpay-somnia-developer-tools",
    transport: "http",
    tools: developerTools,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await runDeveloperTool(String(body.tool ?? ""), asRecord(body.args));
    return NextResponse.json({
      ok: true,
      tool: String(body.tool ?? ""),
      contentType: result.contentType,
      result: result.body,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 400 });
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
