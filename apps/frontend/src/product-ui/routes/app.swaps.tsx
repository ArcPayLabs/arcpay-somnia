"use client";

import { useState } from "react";
import { ArrowLeftRight, Bot, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: SwapsRoute } };

function SwapsRoute() {
  const [form, setForm] = useState({ from: "STT", to: "SOMUSD", amount: "1", maxSlippage: "0.5", agent: "treasury-router" });
  const [message, setMessage] = useState("Somnia swap routing is modeled as policy-ready intents until a stable router adapter is selected.");

  function saveIntent() {
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `Swap intent ${form.amount} ${form.from} to ${form.to}`, amount: `${form.amount} ${form.from}`, status: "intent_saved" });
    setMessage("Swap intent saved. Convert this into an escrowed agent order for execution.");
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={ArrowLeftRight} eyebrow="Treasury routing" title="Swap intents" description="Prepare policy-checked Somnia route intents without pretending a swap executed." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard icon={RouteIcon} label="Route type" value="Intent" hint="No fake fills" />
        <StatCard icon={ShieldCheck} label="Policy" value="Required" hint="Before execution" />
        <StatCard icon={Bot} label="Executor" value={form.agent} hint="Agent order ready" emphasis />
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-[0.75fr_1fr] gap-4">
        <form className="rounded-2xl border border-border bg-card p-5 space-y-4" onSubmit={(event) => { event.preventDefault(); saveIntent(); }}>
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className="block">
              <span className="text-sm font-medium capitalize">{key}</span>
              <input className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3" value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </label>
          ))}
          <button className="h-12 rounded-xl bg-primary px-4 font-semibold text-primary-foreground" type="submit">Save swap intent</button>
          <div className="rounded-xl border border-border bg-muted p-3 text-sm text-muted-foreground">{message}</div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["Intent, not fake fill", "Router-ready fields", "Policy-first execution", "Agent order handoff"].map((title) => (
            <article className="rounded-2xl border border-border bg-card p-5" key={title}>
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              <h2 className="mt-10 text-xl font-medium">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Somnia execution can be connected later without changing the operator workflow.</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
