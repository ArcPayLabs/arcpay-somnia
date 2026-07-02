"use client";

import Link from "next/link";
import { Bot, ChartCandlestick, FileText, MessageCircle, RadioTower, Search, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = { options: { component: LaunchAgentRoute } };

const TEMPLATES = [
  { name: "Research Agent", icon: Search, body: "Sell paid research, website parsing, market summaries, and verification reports.", slug: "research-agent" },
  { name: "Trading Assistant", icon: ChartCandlestick, body: "Create a budget-controlled strategy assistant for swap, yield, and risk proof flows.", slug: "trading-agent" },
  { name: "Market Data Agent", icon: RadioTower, body: "Expose price, API, and alert data through paid x402 requests.", slug: "market-data-agent" },
  { name: "Invoice Agent", icon: FileText, body: "Bill clients, request payment, and attach settlement proof.", slug: "invoice-agent" },
  { name: "Risk Checker", icon: ShieldCheck, body: "Review wallets, routes, and agent actions before spend is approved.", slug: "risk-agent" },
  { name: "Community Helper", icon: MessageCircle, body: "Answer FAQs, route tasks, and help users onboard into Somnia.", slug: "community-agent" },
];

function LaunchAgentRoute() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Sparkles}
        eyebrow="Agent launchpad"
        title="Launch your agent"
        description="Pick a template, set a budget, and turn your agent into a paid Somnia service."
        actions={<Link href="/agents" className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">Advanced registry</Link>}
      />

      <section className="overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_12%_15%,rgba(34,197,94,0.12),transparent_26%),radial-gradient(circle_at_88%_14%,rgba(14,165,233,0.16),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#eff6ff_100%)] p-6 shadow-sm md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_21rem] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              No-code first, developer-ready later
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Agent creation should feel as easy as creating a profile.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Pick what your agent does, choose how it earns, set a safe budget, then publish it into a Somnia payment loop with proof.
            </p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Beta path</div>
            <div className="mt-3 grid gap-2">
              {["Template", "Budget", "Paid task", "Proof points"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-background px-3 py-2 text-sm font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs text-background">{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((template) => (
          <Link key={template.slug} href={`/agents?template=${template.slug}`} className="group rounded-3xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
            <span className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary"><template.icon className="h-5 w-5" /></span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{template.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{template.body}</p>
            <div className="mt-5 text-sm font-semibold text-primary">Use template</div>
          </Link>
        ))}
      </section>

      <section className="grid gap-3 rounded-[2rem] border border-border bg-card p-5 md:grid-cols-4 md:p-6">
        {[
          ["1", "Pick a useful agent"],
          ["2", "Set a safe spend limit"],
          ["3", "Publish a paid task"],
          ["4", "Earn beta proof"],
        ].map(([step, label]) => (
          <div key={step} className="rounded-2xl bg-muted/45 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">{step}</div>
            <div className="mt-4 font-semibold">{label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
