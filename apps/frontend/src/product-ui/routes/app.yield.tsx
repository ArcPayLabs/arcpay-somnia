"use client";

import { useState } from "react";
import { Bot, ShieldCheck, TrendingUp, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: YieldRoute } };

function YieldRoute() {
  const [form, setForm] = useState({ asset: "SOMUSD", amount: "10", target: "low-risk treasury yield", maxDrawdown: "2", agent: "yield-strategy-agent" });
  const [message, setMessage] = useState("Somnia yield is represented as governed strategy intent until a stable vault adapter is selected.");

  function saveIntent() {
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `Yield intent ${form.amount} ${form.asset}`, amount: `${form.amount} ${form.asset}`, status: "strategy_intent_saved" });
    setMessage("Yield intent saved. Convert it into an escrowed strategy order when an adapter is selected.");
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={TrendingUp} eyebrow="Yield strategy" title="Agent-managed yield intents" description="Prepare policy-approved strategy requests for Somnia-native vaults and autonomous strategy agents." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard icon={TrendingUp} label="Strategy" value="Intent" hint="No simulated APY" />
        <StatCard icon={ShieldCheck} label="Policy" value="Required" hint="Spend controls first" />
        <StatCard icon={WalletCards} label="Asset" value={form.asset} hint="Treasury asset" />
        <StatCard icon={Bot} label="Agent" value="Ready" hint={form.agent} emphasis />
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-[0.75fr_1fr] gap-4">
        <form className="rounded-2xl border border-border bg-card p-5 space-y-4" onSubmit={(event) => { event.preventDefault(); saveIntent(); }}>
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className="block">
              <span className="text-sm font-medium capitalize">{key}</span>
              <input className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3" value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </label>
          ))}
          <button className="h-12 rounded-xl bg-primary px-4 font-semibold text-primary-foreground" type="submit">Save yield intent</button>
          <div className="rounded-xl border border-border bg-muted p-3 text-sm text-muted-foreground">{message}</div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["Strategy request", "Risk boundary", "Card compatible", "Agent order path"].map((title) => (
            <article className="rounded-2xl border border-border bg-card p-5" key={title}>
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="mt-10 text-xl font-medium">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Use governed intent records instead of claiming unsupported live vault execution.</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
