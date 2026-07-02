"use client";

import Link from "next/link";
import { Bot, CreditCard, Lock, Rocket, Route as RouteIcon, ShieldAlert, Sparkles, Trophy, Wallet, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatCard } from "@/components/primitives/StatCard";
import { CONTRACTS, balances, currentConnectedAddress, fetchRecords, shortAddress, type LocalRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: DashboardRoute } };

function DashboardRoute() {
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [greeting, setGreeting] = useState("Welcome back.");

  useEffect(() => {
    setGreeting(resolveGreeting());
    void fetchRecords().then(setRecords);
    currentConnectedAddress().then(async (address) => {
      if (!address) return;
      setWallet(address);
      setBalance(await balances(address));
    }).catch(() => undefined);
  }, []);

  const counts = useMemo(() => ({
    payments: records.filter((record) => record.type === "payment").length,
    orders: records.filter((record) => record.type === "order").length,
    agents: records.filter((record) => record.type === "agent").length,
    privacy: records.filter((record) => record.type === "privacy").length,
    audit: records.filter((record) => record.type === "audit").length,
    pending: records.filter((record) => ["pending", "escrowed", "requested"].includes(record.status.toLowerCase())).length,
  }), [records]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Workflow}
        eyebrow="Overview"
        title={greeting}
        description="Launch agents, set budgets, get paid for work, and collect proof on Somnia Testnet."
        actions={<Link href="/agents" className="rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background">Launch agent</Link>}
        back={false}
      />
      <section className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,#ffffff_0%,#f6f8fb_46%,#eef7ff_100%)] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Community beta
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
              Create an agent. Give it a budget. Earn proof.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              ArcPay turns Somnia agents into usable workspaces for builders, traders, and teams. Complete missions, collect points, and show the community what your agent can do.
            </p>
          </div>
          <div className="grid min-w-[18rem] gap-2 rounded-3xl border border-white bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Beta points</span>
              <span className="text-2xl font-semibold tracking-tight">{estimatePoints(counts)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, estimatePoints(counts) / 12)}%` }} />
            </div>
            <Link href="/agents" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">
              Start next mission <Rocket className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex flex-wrap items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center"><Workflow className="w-5 h-5" /></div>
        <div className="flex-1 min-w-[240px]">
          <div className="text-sm font-semibold">Next best action</div>
          <div className="text-sm text-muted-foreground">
            {wallet ? `${shortAddress(wallet)} has ${Number(balance || 0).toFixed(4)} STT. Start with an agent, policy, or payment.` : "Connect a wallet to load your balance and start."}
          </div>
        </div>
        <Link href={wallet ? "/agents" : "/wallet"} className="text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground">
          {wallet ? "Register agent" : "Connect wallet"}
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Wallet} label="Balance" value={wallet ? `${Number(balance || 0).toFixed(4)} STT` : "--"} hint="Connected wallet" />
        <StatCard icon={Workflow} label="Orders" value={counts.orders} hint="Agent work and payments" />
        <StatCard icon={CreditCard} label="SOMUSD cards" value={records.filter((record) => record.title.toLowerCase().includes("card")).length} hint="Agent card events" />
        <StatCard icon={Lock} label="Privacy intents" value={counts.privacy} hint="Commitment-based intents" emphasis />
      </div>
      <section className="grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Beta missions</div>
              <h2 className="mt-1 text-lg font-medium">Your next actions</h2>
            </div>
            <Link href="/agents" className="text-sm font-medium text-primary">Launch agent</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {missions(counts).map((mission) => (
              <Link key={mission.title} href={mission.href} className={`rounded-2xl border p-4 transition hover:border-primary/60 ${mission.done ? "border-success/30 bg-success/10" : "border-border bg-background"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold tracking-tight">{mission.title}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{mission.body}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs font-semibold">{mission.points} pts</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Leaderboard preview</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Top operators will rank by verified agent actions, proof records, and builder referrals.</p>
          <div className="mt-4 space-y-2">
            {leaderboardRows(wallet, counts).map((row, index) => (
              <div key={row.name} className="flex items-center justify-between rounded-2xl bg-muted/45 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-xs font-bold">{index + 1}</span>
                  <span className="text-sm font-medium">{row.name}</span>
                </div>
                <span className="text-sm font-semibold">{row.points}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Latest activity</div>
          <h2 className="mt-1 text-lg font-medium">Treasury feed</h2>
          <div className="mt-4 divide-y divide-border">
            {records.slice(0, 8).map((record) => (
              <div key={record.id} className="flex items-center justify-between gap-4 py-3">
                <div><div className="text-sm font-medium">{record.title}</div><div className="text-xs text-muted-foreground">{new Date(record.createdAt).toLocaleString()}</div></div>
                <code className="text-sm">{record.amount ?? record.status}</code>
              </div>
            ))}
            {!records.length ? (
              <EmptyState
                icon={Workflow}
                title="No treasury activity yet"
                description="Start with a wallet, register an agent, then create an order, x402 payment, invoice, card, or privacy intent. Every signed action will appear here and in Audit."
                actionHref="/agents"
                actionLabel="Register first agent"
              />
            ) : null}
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Workspace</div>
          <h2 className="mt-1 text-lg font-medium">System health</h2>
          <div className="mt-4 space-y-3">
            <StatCard icon={RouteIcon} label="Contracts" value={Object.keys(CONTRACTS).length} hint="Deployed modules" />
            <StatCard icon={ShieldAlert} label="Policy queue" value={counts.pending} hint="Pending review records" />
            <StatCard icon={Bot} label="Agents indexed" value={counts.agents} hint="Registry events" />
          </div>
        </section>
      </div>
    </div>
  );
}

function estimatePoints(counts: { payments: number; orders: number; agents: number; privacy: number; audit: number; pending: number }) {
  return counts.agents * 250 + counts.orders * 300 + counts.privacy * 200 + counts.payments * 150 + counts.audit * 50;
}

function missions(counts: { payments: number; orders: number; agents: number; privacy: number; audit: number; pending: number }) {
  return [
    { title: "Launch your first agent", body: "Create an agent profile with a service endpoint, capabilities, and price.", href: "/agents", points: 250, done: counts.agents > 0 },
    { title: "Get paid for agent work", body: "Create an x402 quote/order and unlock paid work with evidence.", href: "/x402", points: 300, done: counts.orders > 0 },
    { title: "Issue an agent card", body: "Give an agent a SOMUSD budget that can be topped up or frozen.", href: "/cards", points: 200, done: false },
    { title: "Add private proof", body: "Create a privacy intent with encrypted memo details and release evidence.", href: "/privacy", points: 200, done: counts.privacy > 0 },
  ];
}

function leaderboardRows(wallet: string, counts: { payments: number; orders: number; agents: number; privacy: number; audit: number; pending: number }) {
  return [
    { name: wallet ? shortAddress(wallet) : "Your workspace", points: `${estimatePoints(counts)} pts` },
    { name: "Research agents", points: "1,250 pts" },
    { name: "Strategy desk", points: "980 pts" },
  ];
}

function resolveGreeting() {
  if (typeof window === "undefined") return "Welcome back.";
  const key = "arcpay-somnia-dashboard-visit-date";
  const today = new Date().toISOString().slice(0, 10);
  const lastVisit = window.localStorage.getItem(key);
  window.localStorage.setItem(key, today);
  if (lastVisit === today) return "Welcome back.";
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  return "Good evening.";
}
