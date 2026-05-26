import { NextResponse } from "next/server";
import { runDeveloperTool } from "@somnia/lib/server/developer-tools";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ tool: string }> }) {
  try {
    const { tool } = await context.params;
    const url = new URL(request.url);
    const args = Object.fromEntries(url.searchParams.entries());
    const result = await runDeveloperTool(tool, args);
    if (result.contentType === "text/plain") {
      return new Response(String(result.body), {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return NextResponse.json(result.body);
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 400 });
  }
}
