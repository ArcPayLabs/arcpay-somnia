"use client";

import { BookOpen, Bot, CreditCard, Gauge, KeyRound, Lock, Network, RadioTower, ShieldCheck, Workflow } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { SectionHeading } from "@/components/primitives/SectionHeading";

export const Route = { options: { component: DocsPage } };

const DOCS = [
  { icon: Network, title: "Network", body: "Somnia Testnet, chain 50312, STT gas, SocialScan explorer, and fixed testnet-only routing for this build." },
  { icon: Bot, title: "Agent registry", body: "Operators register agents with capability metadata, endpoints, prices, and active status so other agents can discover services." },
  { icon: RadioTower, title: "x402 endpoints", body: "Paid agent endpoints return HTTP 402 with exact Somnia order requirements, then unlock after on-chain fulfillment or settlement." },
  { icon: Workflow, title: "Order lifecycle", body: "Agent orders move through pending, accepted, processing, fulfilled, settled, refunded, or failed states with audit records." },
  { icon: CreditCard, title: "SOMUSD cards", body: "Virtual spend cards assign token budgets to agents with top-up, freeze, activate, and spend controls." },
  { icon: ShieldCheck, title: "Policies", body: "Allowed tokens, blocked actions, contractor allowlist, risk floor, emergency pause, spend caps, and approval thresholds are enforced before actions." },
  { icon: Gauge, title: "Somnia agent risk", body: "Risk requests quote the live Somnia requester deposit, create an on-chain request, and store callback evidence for policy review." },
  { icon: Lock, title: "Privacy vault", body: "Somnia privacy intents create commitments, encrypted memo URIs, delayed recipient release, and one-time nullifiers." },
  { icon: KeyRound, title: "Wallet auth", body: "EVM wallet challenge signing creates the ArcPay session. Email sign-in remains optional for profile sync." },
  { icon: BookOpen, title: "MCP and CLI", body: "Agent-facing docs, skill.md, llms.txt, and CLI/MCP surfaces explain how autonomous clients can operate ArcPay." },
];

function DocsPage() {
  return (
    <MarketingShell navTone="light">
      <main className="px-6 pb-24 pt-16">
        <div className="mx-auto max-w-[88rem]">
          <SectionHeading
            align="center"
            eyebrow="Docs"
            title={<>Build with <span className="text-primary">ArcPay on Somnia</span>.</>}
            description="A product map for the contracts, agent flows, x402 endpoints, and Somnia testnet operations behind ArcPay."
          />
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {DOCS.map((item) => (
              <article key={item.title} className="rounded-3xl border border-border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
