import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@somnia/lib/server/access";
import { readUsageAnalytics } from "@somnia/lib/server/usage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = requireAdmin(request);
  if (!session) return unauthorized();
  return NextResponse.json(await readUsageAnalytics());
}
