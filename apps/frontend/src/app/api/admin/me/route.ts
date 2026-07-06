import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@somnia/lib/server/access";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = requireAdmin(request);
  if (!session) return unauthorized();
  return NextResponse.json({ ok: true, admin: true, address: session.address });
}
