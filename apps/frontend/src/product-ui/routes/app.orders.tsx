"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Play, RefreshCcw, Workflow } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { PageHeader } from "@/components/app/PageHeader";
import { ActionDrawer } from "@/components/primitives/ActionDrawer";
import { AsyncButton } from "@/components/primitives/AsyncButton";
import { StatCard } from "@/components/primitives/StatCard";
import { agentIdFromSlug, fromWei, orderBookContract, shortAddress, toWei, writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: OrdersRoute } };

function OrdersRoute() {
  const [form, setForm] = useState({ agentSlug: "research-agent", requestUri: "ipfs://arcpay/demo-request.json", amount: "0.01", orderId: "" });
  const [order, setOrder] = useState<Record<string, string> | null>(null);
  const [status, setStatus] = useState("Create escrowed work only after the agent, request URI, and amount are confirmed.");
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function createOrder() {
    const validation = validateOrder(form);
    if (validation) {
      setStatus(validation);
      return;
    }
    setStatus("Creating order on Somnia...");
    const contract = await orderBookContract() as any;
    const tx = await contract.createOrder(agentIdFromSlug(form.agentSlug), form.requestUri, { value: toWei(form.amount) });
    const receipt = await tx.wait();
    const parsed = receipt.logs
      ?.map((log: unknown) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((event: { name?: string } | null) => event?.name === "OrderCreated");
    const orderId = parsed?.args?.orderId ?? "";
    if (!orderId) throw new Error("OrderCreated event missing.");
    writeRecord({ id: crypto.randomUUID(), type: "order", title: `Created ${form.agentSlug} order`, status: "pending", amount: form.amount, txHash: tx.hash });
    setForm((current) => ({ ...current, orderId }));
    setStatus(`Order created: ${tx.hash}`);
    setDrawerOpen(false);
  }

  async function loadOrder() {
    if (!form.orderId.trim()) {
      setStatus("Paste or create an order ID before loading order state.");
      return;
    }
    const contract = await orderBookContract() as any;
    const next = await contract.orders(form.orderId.trim());
    setOrder({
      id: next[0],
      agentId: next[1],
      requester: next[2],
      provider: next[3],
      amount: fromWei(next[4]),
      requestUri: next[5],
      resultUri: next[6],
      status: String(next[7]),
    });
    setStatus("Order loaded from Somnia.");
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={Workflow} eyebrow="Order state machine" title="Orders" description="Create, load, and reconcile Somnia agent orders with escrowed STT and state-machine evidence." />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">
          <Play className="h-4 w-4" /> New order
        </button>
        <AsyncButton onClick={loadOrder} onError={setStatus} className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm font-semibold" loadingLabel="Loading...">
          <RefreshCcw className="h-4 w-4" /> Load order
        </AsyncButton>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard icon={Workflow} label="Lifecycle" value="7 states" hint="Pending to failed" />
        <StatCard label="Escrow" value={`${form.amount} STT`} hint="Native value" />
        <StatCard label="Agent" value={form.agentSlug} hint="Registry slug" emphasis />
      </div>
      <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{status}</div>
      <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Selected agent"><input className="ap-in" value={form.agentSlug} onChange={(event) => setForm({ ...form, agentSlug: event.target.value })} /></Field>
          <Field label="Order id"><input className="ap-in" value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })} placeholder="Paste order id to inspect" /></Field>
        </div>
      </section>
      <ResultCard record={order} />
      <ActionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Create agent order" description="Escrow STT for paid agent work. The wallet will only open after the required fields pass validation.">
        <div className="grid gap-4">
          <Field label="Agent slug"><input className="ap-in" value={form.agentSlug} onChange={(event) => setForm({ ...form, agentSlug: event.target.value })} placeholder="research-agent" /></Field>
          <Field label="Amount STT"><input className="ap-in" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} inputMode="decimal" placeholder="0.01" /></Field>
          <Field label="Request URI"><input className="ap-in" value={form.requestUri} onChange={(event) => setForm({ ...form, requestUri: event.target.value })} placeholder="ipfs://... or https://..." /></Field>
        </div>
        <div className="mt-6 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
          Use x402 first when the order came from a protected HTTP 402 resource. This page creates the escrow state used for settlement and audit.
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <AsyncButton onClick={createOrder} onError={setStatus} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground" loadingLabel="Creating...">
            <Play className="h-4 w-4" /> Create order
          </AsyncButton>
          <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold">Cancel</button>
        </div>
      </ActionDrawer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>{children}</label>;
}

function validateOrder(form: { agentSlug: string; requestUri: string; amount: string }) {
  if (!form.agentSlug.trim()) return "Agent slug is required.";
  if (!form.requestUri.trim()) return "Request URI is required.";
  const amount = Number.parseFloat(form.amount);
  if (!Number.isFinite(amount) || amount <= 0) return "Enter a valid positive STT amount.";
  return "";
}

function ResultCard({ record }: { record: Record<string, string> | null }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
      {record ? <div className="grid gap-3 md:grid-cols-2">{Object.entries(record).map(([key, value]) => <div key={key} className="rounded-2xl bg-muted/50 p-3"><div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{key}</div><div className="mt-1 truncate font-mono text-sm">{value.startsWith("0x") ? shortAddress(value) : value}</div></div>)}</div> : (
        <EmptyState
          icon={Workflow}
          title="No order selected"
          description="Create an escrowed agent order, or paste an existing order id to load state-machine evidence from the Somnia contract."
        />
      )}
    </section>
  );
}
