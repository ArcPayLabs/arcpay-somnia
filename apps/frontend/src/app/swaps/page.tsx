"use client";

import { useState } from "react";
import { ArrowLeftRight, Bot, Route, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { writeRecord } from "@/lib/somnia";

export default function SwapsPage() {
  const [form, setForm] = useState({ from: "STT", to: "SOMUSD", amount: "1", maxSlippage: "0.5", agent: "treasury-router" });
  const [status, setStatus] = useState("");

  function saveIntent() {
    writeRecord({
      id: crypto.randomUUID(),
      type: "audit",
      title: `Swap intent ${form.amount} ${form.from} to ${form.to}`,
      amount: `${form.amount} ${form.from}`,
      status: "intent_saved",
    });
    setStatus("Swap intent saved. Route it through an approved agent order when a live Somnia router adapter is selected.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Treasury routing"
        title="Swap intents for Somnia"
        description="ArcPay exposes swap intents as policy-checked agent tasks, ready for a Somnia router adapter when a stable production route is available."
        badges={["Intent-first", "No fake fills", "Agent executable"]}
      />
      <section className="intent-layout section">
        <form className="intent-card" onSubmit={(event) => { event.preventDefault(); saveIntent(); }}>
          <h2>Prepare route intent</h2>
          <div className="intent-pair">
            <label className="field"><span>From</span><input value={form.from} onChange={(event) => setForm({ ...form, from: event.target.value })} /></label>
            <label className="field"><span>To</span><input value={form.to} onChange={(event) => setForm({ ...form, to: event.target.value })} /></label>
          </div>
          <label className="field"><span>Amount</span><input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label>
          <label className="field"><span>Max slippage %</span><input value={form.maxSlippage} onChange={(event) => setForm({ ...form, maxSlippage: event.target.value })} /></label>
          <label className="field"><span>Execution agent</span><input value={form.agent} onChange={(event) => setForm({ ...form, agent: event.target.value })} /></label>
          <button type="submit">Save swap intent</button>
          {status ? <div className="notice">{status}</div> : null}
        </form>
        <div className="intent-side">
          <article><ArrowLeftRight /><h2>Intent, not fake fill</h2><p>The page records route intent and policy context instead of pretending a swap executed.</p></article>
          <article><Route /><h2>Router-ready</h2><p>Token pair, amount, slippage, and execution agent map cleanly to a future Somnia DEX adapter.</p></article>
          <article><ShieldCheck /><h2>Policy first</h2><p>Use order approval and spend limits before allowing a route agent to move funds.</p></article>
          <article><Bot /><h2>Agent executable</h2><p>The intent can become an escrowed order with a result URI once an agent executes it.</p></article>
        </div>
      </section>
    </>
  );
}
