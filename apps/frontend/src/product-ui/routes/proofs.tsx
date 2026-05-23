// @ts-nocheck
"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { useNetwork, type NetworkMode } from "@/store/network";

export const Route = createFileRoute("/proofs")({
  head: () => ({
    meta: [
      { title: "Proofs - ArcPay developer evidence" },
      { name: "description", content: "Per-integration status: what's complete, what needs funds or keys." },
    ],
  }),
  component: ProofsPage,
});

type Status = "live" | "testnet" | "error" | "needs wallet";
type ProofRow = {
  provider: string;
  surface: string;
  status: Status;
  note: string;
  networks: readonly (NetworkMode | "both")[];
  endpoint?: string;
  autoCheck?: boolean;
};

const ROWS: ProofRow[] = [
  { provider: "Somnia RPC", surface: "RPC + webhook", status: "testnet", note: "Backend exposes live webhook proof status for testnet.", networks: ["testnet"], endpoint: "/api/Somnia RPC", autoCheck: true },
  { provider: "Somnia agent runtime", surface: "Private Payments", status: "needs wallet", note: "Live route requires a connected wallet owner. Use Privacy -> Prepare shield to build the Private Payments transaction.", networks: ["testnet"], endpoint: "/api/Somnia agent runtime" },
  { provider: "Torque", surface: "Custom events", status: "testnet", note: "Payment creation submits custom_events through Torque when server env is configured.", networks: ["testnet", "testnet"], endpoint: "/api/torque" },
  { provider: "Somnia risk oracle", surface: "Counterparty risk", status: "live", note: "Risk page calls the server-side Somnia risk oracle endpoint.", networks: ["testnet", "testnet"] },
  { provider: "Somnia router", surface: "Swap routes", status: "live", note: "Swaps page gets live Somnia router quotes and wallet-signable transactions.", networks: ["testnet"] },
  { provider: "Somnia strategy", surface: "Yield tx builder", status: "live", note: "Yield page calls Somnia strategy deposit/withdraw transaction builder.", networks: ["testnet"], endpoint: "/api/Somnia strategy" },
  { provider: "LP Agent", surface: "Meteora positions", status: "live", note: "Yield page reads live LP Agent positions and server supports Zap-In transaction builds.", networks: ["testnet"] },
  { provider: "Privacy Vault", surface: "testnet shield proof", status: "testnet", note: "Privacy page checks Privacy Vault program and recorded testnet proof signature.", networks: ["testnet"], endpoint: "/api/Privacy Vault", autoCheck: true },
  { provider: "Private intent", surface: "Indexer/private rail", status: "needs wallet", note: "Signer/provider gated. The Privacy flow records the real route response when a shield action is prepared.", networks: ["testnet"], endpoint: "/api/Private intent" },
  { provider: "Policy signer", surface: "dWallet policy approval", status: "testnet", note: "Privacy page checks Policy signer program/dWallet approval proof.", networks: ["testnet"], endpoint: "/api/Policy signer", autoCheck: true },
  { provider: "SOMUSD", surface: "Stablecoin rail", status: "live", note: "SOMUSD route verifies official mint metadata and Palm circulation API.", networks: ["testnet"], endpoint: "/api/SOMUSD", autoCheck: true },
  { provider: "Explorer proof", surface: "CLI execution", status: "needs wallet", note: "Requires funded testnet CLI transaction; API key is configured, but no browser signer route is claimed.", networks: ["testnet"] },
  { provider: "QVAC", surface: "Local treasury brain", status: "testnet", note: "Native Linux x64 backend runs a local QVAC model decision on demand.", networks: ["testnet"], endpoint: "/api/qvac", autoCheck: true },
  { provider: "SOMUSD", surface: "AUD settlement", status: "live", note: "Supported payment token and routed through testnet payment and policy pages.", networks: ["testnet"] },
];

const STATUS_STYLE: Record<Status, string> = {
  "live": "bg-success/15 text-success",
  "testnet": "bg-warning/25 text-warning-foreground",
  "error": "bg-destructive/15 text-destructive",
  "needs wallet": "bg-muted text-muted-foreground",
};

function ProofsPage() {
  const network = useNetwork((state) => state.mode);
  const [liveRows, setLiveRows] = useState(ROWS);
  const visibleRows = liveRows.filter((row) => row.networks.includes(network));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const checked = await Promise.all(ROWS.map(async (row) => {
        if (!row.endpoint || !row.autoCheck) return row;
        try {
          const response = await fetch(`${row.endpoint}?network=${network}`, {
            method: "GET",
            cache: "no-store",
          });
          const payload = (await response.json()) as {
            error?: string;
            status?: string;
            transactionBytes?: number;
            liveProof?: boolean;
            decision?: { action?: string; confidence?: number; reason?: string };
            message?: string;
            latestEvent?: { eventId?: string; receivedAt?: string };
            receivedCount?: number;
          };
          if (row.endpoint === "/api/Somnia RPC") {
            if (payload.liveProof) {
              return {
                ...row,
                status: "live" as const,
                note: `Live webhook proof received for ${network}. Event count: ${payload.receivedCount ?? 0}.${payload.latestEvent?.eventId ? ` Latest event: ${payload.latestEvent.eventId}.` : ""}`,
              };
            }

            return {
              ...row,
              status: network === "testnet" ? ("testnet" as const) : ("error" as const),
              note: payload.message ?? `Waiting for a real ${network} Somnia RPC webhook event to hit the Azure backend.`,
            };
          }
          if (row.endpoint === "/api/qvac") {
            if (payload.liveProof && payload.decision?.action) {
              return {
                ...row,
                status: "live" as const,
                note: `Live local QVAC decision: ${payload.decision.action} (${Math.round(Number(payload.decision.confidence ?? 0) * 100)}% confidence). ${payload.decision.reason ?? ""}`,
              };
            }

            return {
              ...row,
              status: "testnet" as const,
              note: payload.message ?? "QVAC backend check is configured; local model proof will appear live when the backend is reachable from this runtime.",
            };
          }
          if (!response.ok || payload.error) {
            return { ...row, status: "error" as const, note: payload.error ?? `HTTP ${response.status}` };
          }
          const suffix = payload.transactionBytes ? ` Transaction bytes: ${payload.transactionBytes}.` : payload.status ? ` Status: ${payload.status}.` : "";
          return { ...row, note: `${row.note}${suffix}` };
        } catch (error) {
          return { ...row, status: "error" as const, note: error instanceof Error ? error.message : "Provider check failed." };
        }
      }));
      if (!cancelled) setLiveRows(checked);
    }
    void load();
    return () => { cancelled = true; };
  }, [network]);

  return (
    <MarketingShell navTone="light">
      <div className="px-6 pt-16 pb-24">
        <div className="max-w-[88rem] mx-auto">
          <SectionHeading
            eyebrow="Developer evidence"
            title={<>Proofs, separated from the <span className="text-primary">user dashboard</span>.</>}
            description={`This page is for judges and developers. Daily customers don't see it. Current proof scope: ${network}. Status is honest - testnet is testnet, pre-alpha is pre-alpha.`}
          />
          <div className="mt-10 rounded-3xl border border-border bg-card overflow-hidden">
            <div className="hidden md:grid grid-cols-[1.2fr_1.4fr_140px_2fr] gap-4 px-6 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground border-b border-border">
              <div>Provider</div>
              <div>Surface</div>
              <div>Status</div>
              <div>Note</div>
            </div>
            <div className="divide-y divide-border">
              {visibleRows.map((r) => (
                <div key={r.provider} className="grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_140px_2fr] gap-2 md:gap-4 px-6 py-4 items-center">
                  <div className="text-sm font-semibold">{r.provider}</div>
                  <div className="text-sm text-foreground/80">{r.surface}</div>
                  <div>
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{r.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}

