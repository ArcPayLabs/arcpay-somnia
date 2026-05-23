"use client";

import { useState } from "react";
import { Bot, ShieldCheck, TrendingUp, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { writeRecord } from "@/lib/somnia";

export default function YieldPage() {
  const [form, setForm] = useState({ asset: "SOMUSD", amount: "10", target: "low-risk treasury yield", maxDrawdown: "2", agent: "yield-strategy-agent" });
  const [status, setStatus] = useState("");

  function saveIntent() {
    writeRecord({
      id: crypto.randomUUID(),
      type: "audit",
      title: `Yield intent ${form.amount} ${form.asset}`,
      amount: `${form.amount} ${form.asset}`,
      status: "strategy_intent_saved",
    });
    setStatus("Yield intent saved. Convert it into an agent order after selecting a live Somnia strategy adapter.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Yield strategy"
        title="Agent-managed yield intents"
        description="ArcPay models yield as policy-approved agent work, ready to connect to Somnia-native vaults or strategy contracts as the ecosystem matures."
        badges={["No fake APY", "Policy-approved", "Vault-ready"]}
      />
      <section className="intent-layout section">
        <form className="intent-card" onSubmit={(event) => { event.preventDefault(); saveIntent(); }}>
          <h2>Prepare strategy intent</h2>
          <label className="field"><span>Asset</span><input value={form.asset} onChange={(event) => setForm({ ...form, asset: event.target.value })} /></label>
          <label className="field"><span>Amount</span><input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label>
          <label className="field"><span>Target strategy</span><input value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} /></label>
          <label className="field"><span>Max drawdown %</span><input value={form.maxDrawdown} onChange={(event) => setForm({ ...form, maxDrawdown: event.target.value })} /></label>
          <label className="field"><span>Strategy agent</span><input value={form.agent} onChange={(event) => setForm({ ...form, agent: event.target.value })} /></label>
          <button type="submit">Save yield intent</button>
          {status ? <div className="notice">{status}</div> : null}
        </form>
        <div className="intent-side">
          <article><TrendingUp /><h2>Strategy request</h2><p>Define asset, amount, target, and risk boundary before funds are committed.</p></article>
          <article><ShieldCheck /><h2>Policy-approved</h2><p>Any live execution should pass spend ceilings, agent allowlist, and emergency pause checks.</p></article>
          <article><WalletCards /><h2>Card compatible</h2><p>SOMUSD card balances can be separated from longer-horizon treasury strategy intents.</p></article>
          <article><Bot /><h2>Agent order path</h2><p>Strategy work can become an escrowed agent order with a returned analysis or execution proof.</p></article>
        </div>
      </section>
    </>
  );
}
