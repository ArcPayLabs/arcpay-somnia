import { NextResponse } from "next/server";
import { adminAddressSet } from "@somnia/lib/server/access";

export const dynamic = "force-dynamic";

const TABLE = "arcpay_somnia_beta_signups";
const APPROVED_STATUSES = new Set(["invited", "active"]);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = normalizeEmail(url.searchParams.get("email"));
    const wallet = normalizeWallet(url.searchParams.get("wallet"));

    if (wallet && adminAddressSet().has(wallet)) {
      return NextResponse.json({ ok: true, approved: true, status: "admin", reason: "admin_wallet" });
    }

    if (!email && !wallet) {
      return NextResponse.json({ ok: true, approved: false, status: "missing_identity", reason: "email_or_wallet_required" });
    }

    if (!hasSupabase()) {
      return NextResponse.json({ ok: false, approved: false, status: "unavailable", reason: "supabase_not_configured" }, { status: 503 });
    }

    const filters = [];
    if (email) filters.push(`email.eq.${escapePostgrest(email)}`);
    if (wallet) filters.push(`wallet_address.ilike.${escapePostgrest(wallet)}`);
    const firstFilter = filters[0] ?? "";
    const query = filters.length === 1
      ? firstFilter.replace(/\.(eq|ilike)\./, "=$1.")
      : `or=(${filters.join(",")})`;

    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${TABLE}?select=id,email,wallet_address,status,updated_at&${query}&order=updated_at.desc&limit=5`, {
      headers: supabaseHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, approved: false, status: "lookup_failed", reason: await response.text() }, { status: 502 });
    }

    const rows = await response.json() as Array<{ status: string; email: string | null; wallet_address: string | null }>;
    const approvedRow = rows.find((row) => APPROVED_STATUSES.has(row.status));
    const latest = rows[0];

    return NextResponse.json({
      ok: true,
      approved: Boolean(approvedRow),
      status: approvedRow?.status ?? latest?.status ?? "not_found",
      matchedBy: approvedRow ? matchType(approvedRow, email, wallet) : latest ? matchType(latest, email, wallet) : null,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, approved: false, status: "lookup_failed", reason: friendlyError(error) }, { status: 503 });
  }
}

function normalizeEmail(value: string | null) {
  const email = String(value ?? "").trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : "";
}

function normalizeWallet(value: string | null) {
  const wallet = String(value ?? "").trim().toLowerCase();
  return /^0x[a-f0-9]{40}$/.test(wallet) ? wallet : "";
}

function matchType(row: { email: string | null; wallet_address: string | null }, email: string, wallet: string) {
  if (wallet && row.wallet_address?.toLowerCase() === wallet) return "wallet";
  if (email && row.email?.toLowerCase() === email) return "email";
  return "record";
}

function hasSupabase() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return { apikey: key, Authorization: `Bearer ${key}` };
}

function escapePostgrest(value: string) {
  return encodeURIComponent(value.replace(/[(),]/g, ""));
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("ENOTFOUND") || message.includes("fetch failed")) return "beta_storage_unreachable";
  return message.slice(0, 240) || "beta_access_failed";
}
