"use client";

import { useState } from "react";
import { ArrowLeftRight, Bot, CheckCircle2, Route as RouteIcon, ShieldCheck, Workflow } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: SwapsRoute } };

const venues = [
  {
    name: "dreamDEX CLOB",
    role: "fully on-chain central limit order book",
    mode: "REST/CLI quote plus wallet-signed Somnia transaction",
    evidence: "market quote, pool address, signed order tx hash, fill/order status",
    url: "https://docs.dreamdex.io/ld25g222WKDrLlJMcR41/welcome/quick-start",
  },
  {
    name: "Somnia Exchange",
    role: "native swap venue",
    mode: "wallet execution",
    evidence: "route quote, wallet simulation, tx hash",
    url: "https://somnia.exchange",
  },
  {
    name: "Somnex",
    role: "aggregator / liquidity / perps venue",
    mode: "agent-prepared route intent",
    evidence: "venue quote, position/risk evidence, tx hash",
    url: "https://somnex.xyz",
  },
  {
    name: "Potion Swap",
    role: "testnet DEX candidate",
    mode: "manual signer execution",
    evidence: "quote screenshot, pool route, tx hash",
    url: "https://potion-swap.xyz",
  },
  {
    name: "Custom Somnia DEX adapter",
    role: "builder-owned router from Somnia DEX tutorial",
    mode: "contract adapter",
    evidence: "adapter address, quote response, fill tx",
    url: "https://docs.somnia.network/developer/how-to-guides/advanced/build-a-dex-on-somnia",
  },
];

function SwapsRoute() {
  const [form, setForm] = useState({ from: "SOMI", to: "USDso", amount: "1", maxSlippage: "0.5", venue: "dreamDEX CLOB", agent: "treasury-router" });
  const [message, setMessage] = useState("Select a Somnia venue, bind the route to policy, then attach quote and transaction evidence before marking it executed.");

  function saveIntent() {
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `${form.venue} swap intent ${form.amount} ${form.from} to ${form.to}`, amount: `${form.amount} ${form.from}`, status: "somnia_route_intent_saved" });
    setMessage("Somnia route intent saved. Next step: collect venue quote evidence, pass policy, then execute with wallet or agent order.");
  }

  const reviewItems = [
    { label: "Source asset", value: form.from },
    { label: "Target asset", value: form.to },
    { label: "Venue", value: form.venue },
    { label: "Max slippage", value: `${form.maxSlippage}%` },
    { label: "Executor", value: form.agent },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={ArrowLeftRight} eyebrow="Swap" title="Plan a swap" description="Choose what to swap, set a safety limit, and save the route before any wallet signature." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard icon={RouteIcon} label="Route" value={form.venue} hint="Best venue target" />
        <StatCard icon={ShieldCheck} label="Safety" value="On" hint="Policy checks first" />
        <StatCard icon={Bot} label="Agent" value={form.agent} hint="Optional executor" emphasis />
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-[0.75fr_1fr] gap-4">
        <form className="rounded-2xl border border-border bg-card p-5 space-y-4" onSubmit={(event) => { event.preventDefault(); saveIntent(); }}>
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className="block">
              <span className="text-sm font-medium capitalize">{key}</span>
              {key === "venue" ? (
                <select className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3" value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })}>
                  {venues.map((venue) => <option key={venue.name}>{venue.name}</option>)}
                </select>
              ) : (
                <input className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3" value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
              )}
            </label>
          ))}
          <button className="h-12 rounded-xl bg-primary px-4 font-semibold text-primary-foreground" type="submit">Save route</button>
          <div className="rounded-xl border border-border bg-muted p-3 text-sm text-muted-foreground">{message}</div>
        </form>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Workflow className="h-4 w-4" /> Execution path
            </div>
            <div className="mt-5 space-y-3">
              {[
                "Choose a Somnia venue and capture route quote evidence.",
                "Run workspace policy, slippage, and emergency-pause checks before signing.",
                "Create an escrowed agent order when an autonomous executor is used.",
                "Attach fill tx hash, venue response, and final balances to the audit record.",
              ].map((step, index) => (
                <div key={step} className="flex gap-3 rounded-2xl bg-muted/40 p-3 text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {venues.map((venue) => (
              <article className="rounded-2xl border border-border bg-card p-5" key={venue.name}>
                <h2 className="text-lg font-semibold">{venue.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{venue.role}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div><dt className="font-medium">Mode</dt><dd className="text-muted-foreground">{venue.mode}</dd></div>
                  <div><dt className="font-medium">Evidence</dt><dd className="text-muted-foreground">{venue.evidence}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {reviewItems.map((item) => (
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
