"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bot, CheckCircle2, CreditCard, EyeOff, RadioTower, RefreshCw, Rocket, Trophy, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { QUEST_RULES, questEvidence, questProgress, type QuestRule } from "@/lib/community-beta";
import { fetchRecords, shortAddress, type LocalRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: QuestsRoute } };

const QUEST_ICONS: Record<QuestRule["id"], typeof Rocket> = {
  wallet: Rocket,
  agent: Bot,
  x402: RadioTower,
  card: CreditCard,
  privacy: EyeOff,
  trading: WalletCards,
};

function QuestsRoute() {
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

  const questState = useMemo(() => questProgress(records, wallet), [records, wallet]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Trophy}
        eyebrow="Community beta"
        title="Quests"
        description="Complete useful Somnia Testnet actions, collect proof, and earn ArcPay beta points."
        actions={<div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void refresh()} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh proof
          </button>
          <Link href="/leaderboard" className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">View leaderboard</Link>
        </div>}
      />

      <section className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_55%,#edf7ff_100%)] p-6 shadow-sm md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Wave 1 missions
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
            Make agent finance feel like a game, backed by real proof.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            Points are earned from actions that matter: launching agents, creating paid tasks, issuing cards, building private proof, and producing transaction evidence on Somnia Testnet.
          </p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your beta points</div>
            <div className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{questState.points}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {wallet ? `Wallet ${shortAddress(wallet)}` : "Connect a wallet to start."}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {QUEST_RULES.map((quest) => {
          const complete = questState.completed.has(quest.id);
          const evidence = questEvidence(quest, records, wallet);
          const Icon = QUEST_ICONS[quest.id];
          return (
          <Link key={quest.title} href={quest.href} className={`group rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg ${complete ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></span>
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${complete ? "bg-success/10 text-success" : "bg-muted"}`}>
                {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                {complete ? "Done" : `${quest.points} pts`}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{quest.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{quest.body}</p>
            <div className="mt-4 rounded-2xl bg-background px-3 py-2 text-xs text-muted-foreground">
              {complete ? evidence : "Not complete yet. Start the quest and refresh proof after the transaction or record is saved."}
            </div>
            <div className="mt-5 text-sm font-semibold text-primary">{complete ? "Review proof" : "Start quest"}</div>
          </Link>
          );
        })}
      </section>
    </div>
  );
}
