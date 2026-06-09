"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CheckCircle2, Copy, ExternalLink, LockKeyhole, RadioTower, RefreshCcw, Send, ServerCog, UnlockKeyhole } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { agentIdFromSlug, orderBookContract, shortAddress, writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: X402Route } };

type PaymentRequirement = {
  ok: boolean;
  x402Version: string;
  network: string;
  chainId: number;
  currency: string;
  agent: {
    slug: string;
    agentId: string;
    owner: string;
    name: string;
    endpoint: string;
    capabilities: string;
  };
  accepts: Array<{
    amountWei: string;
    amountStt: string;
    payTo: string;
    action: string;
    args: { agentId: string; requestUri: string };
    unlockUrl: string;
    verificationUrl: string;
  }>;
};

type Verification = {
  ok: boolean;
  paid?: boolean;
  unlocked?: boolean;
  settled?: boolean;
  statusName?: string;
  amountStt?: string;
  requester?: string;
  provider?: string;
  resultUri?: string;
  error?: string;
};

type UnlockResult = {
  ok: boolean;
  unlocked?: boolean;
  result?: {
    summary: string;
    evidenceUri: string;
    generatedAt: string;
    nextAction: string;
  };
  reason?: string;
  verification?: Verification;
};

function X402Route() {
  const [form, setForm] = useState({
    serverUrl: process.env.NEXT_PUBLIC_X402_SERVER_URL || "https://x402.20.208.46.195.nip.io",
    agentSlug: "research-agent",
    orderId: "",
    resultUri: "ipfs://arcpay-x402-result/research-agent",
    adminSecret: "",
  });
  const [status, setStatus] = useState("Get a price, pay, then unlock the agent result.");
  const [quote, setQuote] = useState<PaymentRequirement | null>(null);
  const [verification, setVerification] = useState<Verification | null>(null);
  const [unlock, setUnlock] = useState<UnlockResult | null>(null);
  const [busy, setBusy] = useState(false);

  const protectedUrl = useMemo(() => {
    const base = cleanServerUrl(form.serverUrl);
    return `${base}/agent/${encodeURIComponent(form.agentSlug)}/work`;
  }, [form.agentSlug, form.serverUrl]);
  const quotedPayment = quote?.accepts[0];
  const serverHost = serverLabel(form.serverUrl);
  const canPay = Boolean(quote) && !busy;
  const payDisabledReason = busy ? "Action in progress." : quote ? "" : "Quote endpoint first.";

  async function quoteEndpoint() {
    setBusy(true);
    setStatus("Requesting x402 payment requirements...");
    setUnlock(null);
    setVerification(null);
    try {
      const res = await fetch(`${cleanServerUrl(form.serverUrl)}/x402/payment-requirements/${encodeURIComponent(form.agentSlug)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Quote failed");
      setQuote(body);
      setStatus(`Quote ready: ${body.accepts[0].amountStt} STT for ${body.agent.name || form.agentSlug}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Quote failed.");
    } finally {
      setBusy(false);
    }
  }

  async function checkProtected() {
    setBusy(true);
    setStatus("Checking protected resource...");
    try {
      const suffix = form.orderId.trim() ? `?orderId=${encodeURIComponent(form.orderId.trim())}` : "";
      const res = await fetch(`${protectedUrl}${suffix}`);
      const body = await res.json();
      setUnlock(body);
      setStatus(res.status === 402 ? "Resource is locked and returned HTTP 402 payment requirements." : "Resource unlocked.");
      if (body.accepts) setQuote(body);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Protected check failed.");
    } finally {
      setBusy(false);
    }
  }

  async function payOrder() {
    if (!quotedPayment) {
      setStatus("Quote the endpoint before paying.");
      return;
    }
    setBusy(true);
    setStatus("Creating escrowed Somnia order from wallet...");
    try {
      const accept = quotedPayment;
      const contract = await orderBookContract() as any;
      const agentId = accept.args?.agentId || agentIdFromSlug(form.agentSlug);
      const requestUri = accept.args?.requestUri || protectedUrl;
      const tx = await contract.createOrder(agentId, requestUri, { value: BigInt(accept.amountWei) });
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
      setForm((current) => ({ ...current, orderId }));
      writeRecord({ id: crypto.randomUUID(), type: "x402", title: `Paid x402 order for ${form.agentSlug}`, status: "paid", amount: `${accept.amountStt} STT`, txHash: tx.hash });
      setStatus(`x402 order created: ${shortAddress(orderId)}.`);
      await verifyOrder(orderId);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOrder(nextOrderId = form.orderId) {
    if (!nextOrderId.trim()) {
      setStatus("Order ID is required for verification.");
      return;
    }
    setBusy(true);
    setStatus("Verifying order against x402 server...");
    try {
      const res = await fetch(`${cleanServerUrl(form.serverUrl)}/x402/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId: nextOrderId.trim(), agentSlug: form.agentSlug }),
      });
      const body = await res.json();
      setVerification(body);
      setStatus(body.unlocked ? "Order is fulfilled and unlock-ready." : `Order verified: ${body.statusName || "unknown"}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Verification failed.");
    } finally {
      setBusy(false);
    }
  }

  async function fulfillOrder() {
    if (!form.orderId.trim()) {
      setStatus("Order ID is required for provider fulfillment.");
      return;
    }
    setBusy(true);
    setStatus("Requesting provider fulfillment through x402 server...");
    try {
      const res = await fetch(`${cleanServerUrl(form.serverUrl)}/agent/${encodeURIComponent(form.agentSlug)}/provider/fulfill`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(form.adminSecret ? { authorization: `Bearer ${form.adminSecret}` } : {}),
        },
        body: JSON.stringify({ orderId: form.orderId.trim(), resultUri: form.resultUri.trim() }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error || "Fulfillment failed");
      writeRecord({ id: crypto.randomUUID(), type: "x402", title: `Fulfilled x402 order ${shortAddress(form.orderId)}`, status: "fulfilled", txHash: body.txs?.at(-1) });
      setStatus(`Provider fulfilled order: ${body.statusName}.`);
      await verifyOrder(form.orderId);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Fulfillment failed.");
    } finally {
      setBusy(false);
    }
  }

  async function unlockResource() {
    if (!form.orderId.trim()) {
      setStatus("Order ID is required to unlock the protected resource.");
      return;
    }
    await checkProtected();
  }

  async function copy(value: string) {
    await navigator.clipboard?.writeText(value);
    setStatus("Copied.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={RadioTower}
        eyebrow="Paid agent work"
        title="x402 payments"
        description="Let agents or users pay for a protected service and unlock the result after payment is verified."
        actions={
          <button disabled={busy} onClick={() => void quoteEndpoint()} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50">
            <RefreshCcw className="h-4 w-4" /> Get price
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ServerCog} label="Server" value="Reachable" hint={serverHost} />
        <StatCard icon={LockKeyhole} label="Access" value={quote ? "Priced" : "Locked"} hint="Pay to unlock" />
        <StatCard icon={CheckCircle2} label="Payment" value={verification?.statusName || "--"} hint="Order status" />
        <StatCard icon={UnlockKeyhole} label="Result" value={unlock?.unlocked ? "Open" : "Closed"} hint="Available after payment" emphasis />
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{status}</div>

      <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Payment server</div>
            <div className="mt-1 break-all font-mono text-xs text-foreground">{cleanServerUrl(form.serverUrl)}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void copy(cleanServerUrl(form.serverUrl))} className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-2 text-xs font-semibold">
              <Copy className="h-3.5 w-3.5" /> Copy server
            </button>
            <a href={cleanServerUrl(form.serverUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background">
              <ExternalLink className="h-3.5 w-3.5" /> Open
            </a>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Server URL"><input className="ap-in" value={form.serverUrl} onChange={(event) => setForm({ ...form, serverUrl: event.target.value })} /></Field>
          <Field label="Agent slug"><input className="ap-in" value={form.agentSlug} onChange={(event) => setForm({ ...form, agentSlug: event.target.value })} /></Field>
          <Field label="Order ID"><input className="ap-in font-mono" value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })} /></Field>
          <Field label="Result URI"><input className="ap-in" value={form.resultUri} onChange={(event) => setForm({ ...form, resultUri: event.target.value })} /></Field>
          <Field label="Admin secret"><input className="ap-in" type="password" value={form.adminSecret} onChange={(event) => setForm({ ...form, adminSecret: event.target.value })} /></Field>
          <div className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">Protected URL</div>
            <div className="break-all font-mono text-xs">{protectedUrl}</div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button disabled={busy} onClick={() => void quoteEndpoint()} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">Get price</button>
          <button disabled={busy} onClick={() => void checkProtected()} className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold disabled:opacity-50">Check access</button>
          <div className="flex flex-col">
            <button disabled={!canPay} onClick={() => void payOrder()} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-50"><Send className="h-4 w-4" /> Pay</button>
            {payDisabledReason ? <span className="mt-1 px-2 text-[11px] font-medium text-muted-foreground">{payDisabledReason}</span> : null}
          </div>
          <button disabled={busy} onClick={() => void verifyOrder()} className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold disabled:opacity-50">Verify</button>
          <button disabled={busy} onClick={() => void fulfillOrder()} className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold disabled:opacity-50">Fulfill result</button>
          <button disabled={busy} onClick={() => void unlockResource()} className="rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-success-foreground disabled:opacity-50">Unlock</button>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Payment requirement">
          {quote ? (
            <div className="space-y-3 text-sm">
              <Row label="Agent" value={`${quote.agent.name || quote.agent.slug} (${quote.agent.slug})`} />
              <Row label="Agent ID" value={shortAddress(quote.agent.agentId)} mono />
              <Row label="Owner" value={shortAddress(quote.agent.owner)} mono />
              {quotedPayment ? <Row label="Amount" value={`${quotedPayment.amountStt} ${quote.currency}`} mono /> : null}
              {quotedPayment ? <Row label="Action" value={quotedPayment.action} mono /> : null}
              {quotedPayment ? <Row label="OrderBook" value={shortAddress(quotedPayment.payTo)} mono /> : null}
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => void copy(JSON.stringify(quote, null, 2))} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold"><Copy className="h-3.5 w-3.5" /> Copy quote</button>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={LockKeyhole}
              title="No price loaded"
              description="Get the price first. ArcPay will show the exact payment before creating an order."
              actionLabel="Get price"
              onAction={() => void quoteEndpoint()}
            />
          )}
        </Panel>

        <Panel title="Verification and unlock">
          {verification || unlock ? (
            <div className="space-y-3 text-sm">
              {verification ? (
                <>
                  <Row label="Paid" value={String(Boolean(verification.paid))} />
                  <Row label="Unlocked" value={String(Boolean(verification.unlocked))} />
                  <Row label="Settled" value={String(Boolean(verification.settled))} />
                  <Row label="Status" value={verification.statusName || "--"} />
                  {verification.provider ? <Row label="Provider" value={shortAddress(verification.provider)} mono /> : null}
                  {verification.requester ? <Row label="Requester" value={shortAddress(verification.requester)} mono /> : null}
                  {verification.resultUri ? <Row label="Result URI" value={verification.resultUri} mono /> : null}
                </>
              ) : null}
              {unlock?.result ? (
                <div className="rounded-2xl bg-success/10 p-4 text-success">
                  <div className="font-semibold">{unlock.result.summary}</div>
                  <div className="mt-1 break-all font-mono text-xs">{unlock.result.evidenceUri}</div>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              icon={UnlockKeyhole}
              title="No result yet"
              description="Pay or paste an order id, then verify it before unlocking the agent result."
              actionLabel="Verify order"
              onAction={() => void verifyOrder()}
            />
          )}
        </Panel>
      </div>

    </div>
  );
}

function cleanServerUrl(value: string) {
  return (value || "http://127.0.0.1:4030").replace(/\/+$/, "");
}

function serverLabel(value: string) {
  try {
    return new URL(value).host;
  } catch {
    return "x402";
  }
}

function Field({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>{children}</label>;
}

function Panel({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return <section className="rounded-3xl border border-border bg-card p-5 md:p-6"><h2 className="text-lg font-semibold tracking-tight">{title}</h2><div className="mt-4">{children}</div></section>;
}

function Row({ label, value, mono }: { readonly label: string; readonly value: string; readonly mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-muted/50 p-3">
      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <span className={`max-w-[70%] truncate text-right text-sm ${mono ? "font-mono" : "font-medium"}`}>{value}</span>
    </div>
  );
}
