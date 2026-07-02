"use client";

import Link from "next/link";
import { Bot, Crown, RadioTower, Rocket, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = { options: { component: LeaderboardRoute } };

const BOARDS = [
  { title: "Top Operators", icon: Crown, rows: [["0xB883...f448", "1,850"], ["Research DAO", "1,250"], ["Strategy desk", "980"]] },
  { title: "Top Agents", icon: Bot, rows: [["research-agent", "920"], ["market-scout", "760"], ["invoice-bot", "610"]] },
  { title: "x402 Builders", icon: RadioTower, rows: [["paid-research", "14 calls"], ["data-checker", "9 calls"], ["risk-reader", "7 calls"]] },
  { title: "Beta Teams", icon: Users, rows: [["Somnia traders", "5 proofs"], ["Agent studio", "3 agents"], ["Builder guild", "2 endpoints"]] },
];

function LeaderboardRoute() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Trophy}
        eyebrow="Community beta"
        title="Leaderboard"
        description="A preview of the ArcPay beta ranking system for operators, agents, builders, and teams."
        actions={<Link href="/quests" className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">Complete quests</Link>}
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
              The production leaderboard will rank users by verified actions: agent launches, x402 orders, card events, privacy proofs, swap/yield evidence, and builder referrals.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-5 text-center shadow-sm">
            <div className="text-4xl font-semibold tracking-tight">50</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Wave 1 seats</div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        {BOARDS.map((board) => (
          <div key={board.title} className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-primary/10 p-3 text-primary"><board.icon className="h-5 w-5" /></span>
              <h3 className="text-xl font-semibold tracking-tight">{board.title}</h3>
            </div>
            <div className="mt-5 space-y-2">
              {board.rows.map(([name, score], index) => (
                <div key={name} className="flex items-center justify-between rounded-2xl bg-muted/45 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-sm font-bold">{index + 1}</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{score}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
