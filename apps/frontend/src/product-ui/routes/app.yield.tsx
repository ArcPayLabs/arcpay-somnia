"use client";

import { useState } from "react";
import { Bot, CheckCircle2, ShieldCheck, TrendingUp, WalletCards, Workflow } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: YieldRoute } };

const strategies = [
  {
    name: "dreamDEX maker yield",
    asset: "USDso",
    mode: "resting CLOB order / market-maker intent",
    risk: "inventory risk, price drift, pool depth, order cancellation discipline",
  },
  {
    name: "Somnia Exchange LP",
    asset: "STT/SOMUSD",
    mode: "liquidity provision intent",
    risk: "impermanent loss, pool depth, fee volatility",
  },
  {
    name: "Somnex liquidity / perps risk",
    asset: "STT, SOMUSD",
    mode: "agent-prepared allocation with venue evidence",
    risk: "leverage, funding, liquidation, venue liquidity",
  },
  {
    name: "Potion Swap LP",
    asset: "testnet pool pair",
    mode: "manual signer LP intent",
    risk: "experimental pool contracts and shallow liquidity",
  },
  {
    name: "Treasury hold / no-yield",
    asset: "STT or SOMUSD",
    mode: "capital preservation policy",
    risk: "opportunity cost only",
  },
];

function YieldRoute() {
  const [form, setForm] = useState({ strategy: "dreamDEX maker yield", asset: "USDso", amount: "10", target: "policy-bound CLOB maker yield", maxDrawdown: "2", agent: "yield-strategy-agent" });
  const [message, setMessage] = useState("Somnia yield is handled as a governed strategy intent: route, risk, tx hash, and post-action balances are required before audit completion.");

  function saveIntent() {
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `${form.strategy} yield intent ${form.amount} ${form.asset}`, amount: `${form.amount} ${form.asset}`, status: "somnia_yield_intent_saved" });
    setMessage("Somnia strategy intent saved. Next step: collect venue evidence, pass policy, and attach execution tx before marking it live.");
  }

  const guardrails = [
    { label: "Strategy", value: form.strategy },
    { label: "Asset", value: form.asset },
    { label: "Amount", value: form.amount },
    { label: "Risk limit", value: `${form.maxDrawdown}% max drawdown` },
    { label: "Executor", value: form.agent },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={TrendingUp} eyebrow="Treasury" title="Plan yield" description="Choose a treasury strategy, set risk limits, and save the plan before any funds move." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard icon={TrendingUp} label="Strategy" value={form.strategy} hint="Planned route" />
        <StatCard icon={ShieldCheck} label="Safety" value="On" hint="Policy first" />
        <StatCard icon={WalletCards} label="Asset" value={form.asset} hint="Treasury asset" />
        <StatCard icon={Bot} label="Agent" value={form.agent} hint="Optional executor" emphasis />
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-[0.75fr_1fr] gap-4">
        <form className="rounded-2xl border border-border bg-card p-5 space-y-4" onSubmit={(event) => { event.preventDefault(); saveIntent(); }}>
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className="block">
              <span className="text-sm font-medium capitalize">{key}</span>
              {key === "strategy" ? (
                <select className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3" value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })}>
                  {strategies.map((strategy) => <option key={strategy.name}>{strategy.name}</option>)}
                </select>
              ) : (
                <input className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3" value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
              )}
            </label>
          ))}
          <button className="h-12 rounded-xl bg-primary px-4 font-semibold text-primary-foreground" type="submit">Save strategy</button>
          <div className="rounded-xl border border-border bg-muted p-3 text-sm text-muted-foreground">{message}</div>
        </form>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Workflow className="h-4 w-4" /> Strategy lifecycle
            </div>
            <div className="mt-5 space-y-3">
              {[
                "Select Somnia venue, asset, risk limit, and executor agent.",
                "Evaluate against policy, emergency pause, and drawdown limits.",
                "Create an escrowed strategy order only after operator approval.",
                "Attach quote, LP/position evidence, tx hash, and final balance snapshot.",
              ].map((step, index) => (
                <div key={step} className="flex gap-3 rounded-2xl bg-muted/40 p-3 text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {strategies.map((strategy) => (
              <article className="rounded-2xl border border-border bg-card p-5" key={strategy.name}>
                <h2 className="text-lg font-semibold">{strategy.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{strategy.mode}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div><dt className="font-medium">Assets</dt><dd className="text-muted-foreground">{strategy.asset}</dd></div>
                  <div><dt className="font-medium">Risk checks</dt><dd className="text-muted-foreground">{strategy.risk}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {guardrails.map((item) => (
              <article className="rounded-2xl border border-border bg-card p-5" key={item.label}>
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h2 className="mt-8 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">{item.label}</h2>
                <p className="mt-2 break-all text-xl font-semibold">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
