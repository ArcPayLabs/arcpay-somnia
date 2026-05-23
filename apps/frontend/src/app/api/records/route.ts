import { NextResponse } from "next/server";
import { createRecord, listRecords } from "@/lib/server/records";
import { readSession, sessionCookie } from "@/lib/server/session";

function sessionFromRequest(request: Request) {
  return readSession(request.headers.get("cookie")?.match(new RegExp(`${sessionCookie}=([^;]+)`))?.[1]);
}

export async function GET(request: Request) {
  const session = sessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await listRecords(session.address));
}

export async function POST(request: Request) {
  const session = sessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json();
  const record = await createRecord(session.address, {
    type: String(body.type ?? "audit"),
    title: String(body.title ?? "Untitled"),
    status: String(body.status ?? "created"),
    amount: body.amount ? String(body.amount) : undefined,
    txHash: body.txHash ? String(body.txHash) : undefined,
  });
  return NextResponse.json(record);
}
