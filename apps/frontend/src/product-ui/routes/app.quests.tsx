"use client";

import Link from "next/link";
import { Bot, CreditCard, EyeOff, RadioTower, Rocket, Trophy, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = { options: { component: QuestsRoute } };

const QUESTS = [
  { title: "Enter Somnia beta", body: "Connect your wallet and create an ArcPay workspace.", points: 50, href: "/wallet", icon: Rocket },
  { title: "Launch your first agent", body: "Pick a template, add an endpoint, and publish your agent profile.", points: 250, href: "/launch-agent", icon: Bot },
  { title: "Get paid for work", body: "Create an x402 paid task and save the order proof.", points: 300, href: "/x402", icon: RadioTower },
  { title: "Issue an agent card", body: "Create a SOMUSD budget card for a controlled agent spend flow.", points: 200, href: "/cards", icon: CreditCard },
  { title: "Add private proof", body: "Create a privacy intent with encrypted memo details.", points: 200, href: "/privacy", icon: EyeOff },
  { title: "Complete a trading proof", body: "Run a swap or yield proof and keep the tx evidence.", points: 250, href: "/swaps", icon: WalletCards },
];

function QuestsRoute() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Trophy}
        eyebrow="Community beta"
        title="Quests"
        description="Complete useful Somnia Testnet actions, collect proof, and earn ArcPay beta points."
        actions={<Link href="/leaderboard" className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">View leaderboard</Link>}
      />

      <section className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_55%,#edf7ff_100%)] p-6 shadow-sm md:p-8">
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
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {QUESTS.map((quest) => (
          <Link key={quest.title} href={quest.href} className="group rounded-3xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-2xl bg-primary/10 p-3 text-primary"><quest.icon className="h-5 w-5" /></span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{quest.points} pts</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{quest.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{quest.body}</p>
            <div className="mt-5 text-sm font-semibold text-primary">Start quest</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
