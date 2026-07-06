"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bot, Crown, RadioTower, RefreshCw, Rocket, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { buildCommunityLeaderboard } from "@/lib/community-beta";
import { fetchRecords, shortAddress, type LocalRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: LeaderboardRoute } };

const BOARD_ICONS = {
  "Top Operators": Crown,
  "Top Agents": Bot,
  "x402 Builders": RadioTower,
  "Proof Makers": Users,
};

function LeaderboardRoute() {
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    setWallet(window.localStorage.getItem("arcpay-somnia-wallet-session") ?? "");
    setRecords(await fetchRecords());
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const boards = useMemo(() => buildCommunityLeaderboard(records, wallet), [records, wallet]);
  const totalPoints = boards[0]?.rows[0]?.score ?? "0";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Trophy}
        eyebrow="Community beta"
        title="Leaderboard"
        description="Live beta ranking for connected operators, agent launches, paid work, and proof records."
        actions={<div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void refresh()} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <Link href="/quests" className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">Complete quests</Link>
        </div>}
      />

      <section className="rounded-[2rem] border border-border bg-[radial-gradient(circle_at_10%_10%,rgba(34,197,94,0.10),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Rocket className="h-3.5 w-3.5 text-primary" /> Wave 1 starts here
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Reward real Somnia activity, not empty clicks.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
              This board reads the current workspace records and scores verified actions: connected wallet, agent launches, x402 orders, card events, privacy proofs, and trading evidence.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-5 text-center shadow-sm">
            <div className="text-4xl font-semibold tracking-tight">{totalPoints}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">your points</div>
            <div className="mt-2 text-xs text-muted-foreground">{wallet ? shortAddress(wallet) : "connect wallet"}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        {boards.map((board) => {
          const Icon = BOARD_ICONS[board.title as keyof typeof BOARD_ICONS] ?? Trophy;
          return (
          <div key={board.title} className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></span>
              <h3 className="text-xl font-semibold tracking-tight">{board.title}</h3>
            </div>
            <div className="mt-5 space-y-2">
              {board.rows.map(({ name, score, hint }, index) => (
                <div key={name} className="flex items-center justify-between rounded-2xl bg-muted/45 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-sm font-bold">{index + 1}</span>
                    <span>
                      <span className="block font-medium">{name}</span>
                      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{score}</span>
                </div>
              ))}
            </div>
          </div>
          );
        })}
      </section>
    </div>
  );
}
