"use client";

import { useState } from "react";
import { Bot, DatabaseZap, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { agentIdFromSlug, fromWei, registryContract, shortAddress, toWei, writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: AgentsRoute } };

function AgentsRoute() {
  const [form, setForm] = useState({
    slug: "research-agent",
    name: "Treasury Research Agent",
    endpoint: "https://example.com/somnia-agent/research",
    capabilities: "risk-scoring, invoice-review, payment-routing",
    price: "0.01",
  });
  const [agent, setAgent] = useState<Record<string, string> | null>(null);
  const [status, setStatus] = useState("Register an agent so other Somnia agents can discover and hire it.");

  async function registerAgent() {
    setStatus("Submitting agent registry transaction...");
    const contract = await registryContract() as any;
    const agentId = agentIdFromSlug(form.slug);
    const tx = await contract.registerAgent(agentId, form.name, form.endpoint, form.capabilities, toWei(form.price));
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "agent", title: `Registered ${form.name}`, status: "confirmed", txHash: tx.hash });
    setStatus(`Agent registered on Somnia: ${tx.hash}`);
    await loadAgent();
  }

  async function loadAgent() {
    const contract = await registryContract() as any;
    const agentId = agentIdFromSlug(form.slug);
    const next = await contract.agents(agentId);
    setAgent({
      id: agentId,
      owner: next[0],
      name: next[1],
      endpoint: next[2],
      capabilities: next[3],
      price: fromWei(next[4]),
      active: String(next[5]),
    });
    setStatus("Agent loaded from Somnia registry.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bot}
        eyebrow="Agent discovery"
        title="Agents"
        description="Publish agent capability metadata, endpoints, and STT pricing into the Somnia registry so autonomous clients can discover and hire services."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard icon={Bot} label="Registry" value="Live" hint="Somnia contract" />
        <StatCard icon={Sparkles} label="Price" value={`${form.price} STT`} hint="Per service call" />
        <StatCard icon={DatabaseZap} label="Capabilities" value={form.capabilities.split(",").length} hint="Discovery tags" emphasis />
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{status}</div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-xl font-semibold tracking-tight">Register service agent</h2>
          <div className="mt-5 grid gap-4">
            {Object.entries(form).map(([key, value]) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{key}</span>
                <input value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="ap-in" />
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => void registerAgent()} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" /> Register on Somnia
            </button>
            <button onClick={() => void loadAgent()} className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold">Load by slug</button>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-xl font-semibold tracking-tight">Registry result</h2>
          {agent ? (
            <div className="mt-5 space-y-3">
              {Object.entries(agent).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-4 rounded-2xl bg-muted/50 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{key}</span>
                  <span className="max-w-[70%] truncate text-right font-mono text-sm">{key === "owner" || key === "id" ? shortAddress(value) : value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-muted/50 p-8 text-center text-sm text-muted-foreground">No agent loaded yet.</div>
          )}
        </section>
      </div>
    </div>
  );
}
