"use client";

import { useState } from "react";
import { Gauge, Sparkles, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { hashText, riskOracleContract, shortAddress, toWei, writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: OracleRoute } };

function OracleRoute() {
  const [prompt, setPrompt] = useState("Score contractor wallet before SOMUSD card funding");
  const [orderId, setOrderId] = useState(hashText("demo-order"));
  const [status, setStatus] = useState("Request Somnia risk oracle decisions and persist evidence for policy checks.");
  const [requestId, setRequestId] = useState("");

  async function requestRisk() {
    const oracle = await riskOracleContract() as any;
    const tx = await oracle.requestRisk(orderId, prompt, { value: toWei("0.001") });
    const receipt = await tx.wait();
    const nextRequestId = receipt.logs?.[0]?.topics?.[1] ?? "";
    setRequestId(nextRequestId);
    writeRecord({ id: crypto.randomUUID(), type: "oracle", title: "Requested Somnia risk score", status: "requested", txHash: tx.hash });
    setStatus(`Risk oracle requested: ${tx.hash}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={Gauge} eyebrow="Risk oracle" title="Oracle" description="Request on-chain risk evidence that policies can use before agent orders, spend cards, or contractor payouts proceed." />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard icon={Gauge} label="Oracle" value="Live" hint="Somnia testnet contract" />
        <StatCard icon={Sparkles} label="Fee" value="0.001 STT" hint="Demo request value" />
        <StatCard label="Last request" value={requestId ? shortAddress(requestId) : "--"} hint="Event-derived id" emphasis />
      </div>
      <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{status}</div>
      <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Order id</span>
            <input className="ap-in" value={orderId} onChange={(event) => setOrderId(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Risk prompt</span>
            <textarea className="ap-in min-h-28" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
          </label>
        </div>
        <button onClick={() => void requestRisk()} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          <Wand2 className="h-4 w-4" /> Request risk
        </button>
      </section>
    </div>
  );
}
