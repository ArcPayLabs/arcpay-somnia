import { NextResponse } from "next/server";
import { verifyMessage } from "ethers";
import { challengeCookie, createSession, readChallenge, sessionCookie, sessionTtlSeconds } from "@/lib/server/session";

export async function POST(request: Request) {
  const body = await request.json();
  const challenge = readChallenge(request.headers.get("cookie")?.match(/arcpay_somnia_challenge=([^;]+)/)?.[1]);
  if (!challenge) {
    return NextResponse.json({ error: "challenge_expired" }, { status: 401 });
  }
  const recovered = verifyMessage(challenge.message, String(body.signature ?? "")).toLowerCase();
  if (recovered !== challenge.address) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }
  const response = NextResponse.json({ address: recovered });
  response.cookies.set(sessionCookie, createSession(recovered), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionTtlSeconds,
    path: "/",
  });
  response.cookies.delete(challengeCookie);
  return response;
}
