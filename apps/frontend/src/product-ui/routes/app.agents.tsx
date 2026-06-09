"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Bot, CheckCircle2, Copy, DatabaseZap, ExternalLink, PlugZap, Plus, ReceiptText, Sparkles, Workflow } from "lucide-react";
import { ActionDrawer } from "@/components/primitives/ActionDrawer";
import { AsyncButton } from "@/components/primitives/AsyncButton";
import { EmptyState } from "@/components/app/EmptyState";
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
  const [status, setStatus] = useState("Register a paid service endpoint, then attach policies, orders, cards, and audit evidence to that agent.");
  const [template, setTemplate] = useState<(typeof AGENT_TEMPLATES)[number]>(AGENT_TEMPLATES[0]);
  const [copied, setCopied] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const agentId = agentIdFromSlug(form.slug);
  const protectedUrl = `https://x402.20.208.46.195.nip.io/agent/${encodeURIComponent(form.slug)}/work`;

  async function registerAgent() {
    const validation = validateAgentForm(form);
    if (validation) {
      setStatus(validation);
      return;
    }
    setStatus("Submitting agent registry transaction...");
    const contract = await registryContract() as any;
    const tx = await contract.registerAgent(agentId, form.name, form.endpoint, form.capabilities, toWei(form.price));
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "agent", title: `Registered ${form.name}`, status: "confirmed", txHash: tx.hash });
    setStatus(`Agent registered on Somnia: ${tx.hash}`);
    setDrawerOpen(false);
    await loadAgent();
  }

  async function loadAgent() {
    const contract = await registryContract() as any;
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

  function applyTemplate(next: (typeof AGENT_TEMPLATES)[number]) {
    setTemplate(next);
    setForm({
      slug: next.slug,
      name: next.name,
      endpoint: next.endpoint,
      capabilities: next.capabilities,
      price: next.price,
    });
    setStatus(`${next.name} template loaded. Review endpoint, price, and capabilities before registering.`);
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard?.writeText(value);
    setCopied(label);
    setStatus(`${label} copied.`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bot}
        eyebrow="Agent discovery"
        title="Agents"
        description="Connect your agent service, set a price, and make it available for paid work."
        actions={
          <button type="button" onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:opacity-90">
            <Plus className="h-4 w-4" /> Register service agent
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard icon={Bot} label="Selected agent" value={form.slug} hint="Service slug" />
        <StatCard icon={Sparkles} label="Price" value={`${form.price} STT`} hint="Per call" />
        <StatCard icon={DatabaseZap} label="Capabilities" value={form.capabilities.split(",").length} hint="Published service tags" emphasis />
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{status}</div>

      <section className="min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <ReceiptText className="h-3.5 w-3.5" /> Built-in receipt agents
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Use AI receipts when a task needs proof.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Use website parsing, inference, or JSON API checks to attach proof before an agent order is marked complete.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="https://agents.testnet.somnia.network" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">
              Open agents <ExternalLink className="h-4 w-4" />
            </a>
            <button type="button" onClick={() => void copy(JSON.stringify(SOMNIA_AGENTS_PAYLOAD, null, 2), "Receipt agent map")} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold">
              <Copy className="h-4 w-4" /> Copy receipt map
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {SOMNIA_OFFICIAL_AGENTS.map((item) => (
            <button key={item.id} type="button" onClick={() => void copy(item.id, `${item.name} ID`)} className="min-w-0 rounded-2xl border border-border bg-background p-4 text-left transition hover:border-primary/60">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.kind}</div>
              <h3 className="mt-2 truncate text-lg font-semibold tracking-tight">{item.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="mt-4 text-xs font-semibold text-primary">Copy agent ID</div>
            </button>
          ))}
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <PlugZap className="h-3.5 w-3.5" /> Bring your own agent
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Publish any Somnia-ready service endpoint.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Register a slug, capability metadata, HTTPS endpoint, and STT price. ArcPay turns that into a discoverable service that can be paid through the live x402 gateway and governed by treasury policy.
            </p>
          </div>
          <a href="https://docs.somnia.network/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold">
            Somnia docs <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {AGENT_TEMPLATES.map((item) => (
            <button
              type="button"
              key={item.slug}
              onClick={() => applyTemplate(item)}
              className={`rounded-2xl border p-4 text-left transition hover:border-primary/60 ${template.slug === item.slug ? "border-primary bg-primary/10" : "border-border bg-muted/30"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold tracking-tight">{item.name}</div>
                {template.slug === item.slug ? <CheckCircle2 className="h-4 w-4 text-primary" /> : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.capabilities}</div>
            </button>
          ))}
        </div>

        <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="min-w-0 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Workflow className="h-4 w-4" /> Onboarding path
            </div>
            <div className="mt-4 space-y-3">
              {[
                "Expose an HTTPS endpoint for your agent service.",
                "Register the slug, capabilities, endpoint, and STT price on Somnia.",
                "Use x402 payment requirements so clients can pay before work unlocks.",
                "Let ArcPay policy, audit records, and privacy intents govern the work.",
              ].map((step, index) => (
                <div key={step} className="flex min-w-0 gap-3 rounded-2xl bg-muted/40 p-3 text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                  <span className="min-w-0 text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 rounded-2xl border border-border bg-background p-4">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Connection details</div>
            <div className="mt-4 grid gap-2">
              {[
                ["Slug", form.slug],
                ["Agent ID", agentId],
                ["Endpoint", form.endpoint],
                ["Price", `${form.price} STT`],
                ["x402 URL", protectedUrl],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-2xl bg-foreground p-3 text-background">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">{label}</div>
                  <div className="mt-1 truncate font-mono text-xs">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => void copy(agentId, "Agent ID")} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold"><Copy className="h-3.5 w-3.5" /> Copy ID</button>
              <button type="button" onClick={() => void copy(protectedUrl, "x402 URL")} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold"><Copy className="h-3.5 w-3.5" /> Copy x402 URL</button>
              <button type="button" onClick={() => void copy(templateSnippet(form.slug), "Starter snippet")} className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background"><Copy className="h-3.5 w-3.5" /> Copy starter snippet</button>
              {copied ? <span className="px-2 py-2 text-xs font-medium text-muted-foreground">{copied} ready.</span> : null}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-xl font-semibold tracking-tight">How onboarding works</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A service agent is any HTTPS endpoint or external agent that can sell work through ArcPay. Register it once, then use Orders, x402, Cards, Policies, and Operator claim codes to govern how it gets paid and audited.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" /> Register service agent
            </button>
            <AsyncButton onClick={loadAgent} onError={setStatus} className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold" loadingLabel="Loading...">Load selected slug</AsyncButton>
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
            <div className="mt-5">
              <EmptyState
                icon={Bot}
                title="No agent loaded"
                description="Register a Somnia service agent or load an existing slug to inspect its endpoint, price, capabilities, and registry owner."
                actionLabel="Load by slug"
                onAction={() => void loadAgent()}
              />
            </div>
          )}
        </section>
      </div>

      <ActionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Register service agent"
        description="Publish a service endpoint that other agents or operators can pay through ArcPay x402 and govern with policy."
      >
        <div className="grid gap-4">
          <Field label="Service slug" hint="Used for the agent ID and x402 URL.">
            <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="ap-in" placeholder="research-agent" />
          </Field>
          <Field label="Display name" hint="Shown in the operator dashboard.">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="ap-in" placeholder="Treasury Research Agent" />
          </Field>
          <Field label="HTTPS endpoint" hint="The agent service URL clients will request.">
            <input value={form.endpoint} onChange={(event) => setForm({ ...form, endpoint: event.target.value })} className="ap-in" placeholder="https://..." />
          </Field>
          <Field label="Capabilities" hint="Comma-separated tags such as search, risk, invoices.">
            <input value={form.capabilities} onChange={(event) => setForm({ ...form, capabilities: event.target.value })} className="ap-in" placeholder="risk-scoring, invoice-review" />
          </Field>
          <Field label="Price per call, STT" hint="Amount requested before the result unlocks.">
            <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="ap-in" inputMode="decimal" placeholder="0.01" />
          </Field>
        </div>
        <div className="mt-6 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
          After registration, use the x402 page to quote the protected resource, Orders to escrow work, Policies to limit spend, and Cards to delegate a SOMUSD budget to the agent wallet.
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <AsyncButton onClick={registerAgent} onError={setStatus} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground" loadingLabel="Submitting...">
            <Plus className="h-4 w-4" /> Register on Somnia
          </AsyncButton>
          <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold">Cancel</button>
        </div>
      </ActionDrawer>
    </div>
  );
}

function Field({ children, hint, label }: { children: ReactNode; hint?: string; label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function validateAgentForm(form: { slug: string; name: string; endpoint: string; capabilities: string; price: string }) {
  if (!form.slug.trim()) return "Service slug is required.";
  if (!/^[a-z0-9][a-z0-9-]{2,62}$/i.test(form.slug.trim())) return "Use a simple slug such as research-agent.";
  if (!form.name.trim()) return "Display name is required.";
  if (!/^https:\/\/.+/i.test(form.endpoint.trim())) return "Use a valid HTTPS endpoint.";
  if (!form.capabilities.trim()) return "Add at least one capability.";
  const price = Number.parseFloat(form.price);
  if (!Number.isFinite(price) || price <= 0) return "Enter a valid positive STT price.";
  return "";
}

const AGENT_TEMPLATES = [
  {
    slug: "research-agent",
    name: "Treasury Research Agent",
    endpoint: "https://example.com/somnia-agent/research",
    capabilities: "risk-scoring, invoice-review, payment-routing",
    price: "0.01",
    description: "Paid research endpoint for counterparty checks, invoice context, and treasury recommendations.",
  },
  {
    slug: "routing-agent",
    name: "Real-Time Routing Agent",
    endpoint: "https://example.com/somnia-agent/routing",
    capabilities: "real-time-routing, policy-checks, x402-quotes",
    price: "0.005",
    description: "Somnia-speed payment coordinator for route intents, x402 quotes, and policy-safe execution plans.",
  },
  {
    slug: "privacy-agent",
    name: "Privacy Intent Agent",
    endpoint: "https://example.com/somnia-agent/privacy",
    capabilities: "privacy-intents, encrypted-memos, disclosure-reports",
    price: "0.008",
    description: "Agent service for encrypted memo pointers, recipient disclosure workflows, and audit-safe privacy reports.",
  },
] as const;

const SOMNIA_AGENT_CONTRACTS = {
  "Platform contract": "0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776",
  "Agent registry": "0x08D1Fc808f1983d2Ea7B63a28ECD4d8C885Cd02A",
};

const SOMNIA_OFFICIAL_AGENTS = [
  {
    name: "LLM Parse Website",
    kind: "website-to-receipt",
    id: "12875401142070969085",
    methods: "2",
    cost: "0.10 STT/SOMI per validator",
    description: "Search a domain or scrape a URL, convert HTML, extract structured data with AI, and return an inspectable receipt.",
  },
  {
    name: "LLM Inference",
    kind: "inference",
    id: "12847293847561029384",
    methods: "4",
    cost: "variable",
    description: "String-in/string-out inference for agent reasoning steps that need an execution receipt before ArcPay settlement.",
  },
  {
    name: "JSON API Request",
    kind: "oracle-data",
    id: "13174292974160097713",
    methods: "6",
    cost: "variable",
    description: "Fetch public JSON APIs and extract selector-path values for price, market, proof, or treasury monitoring workflows.",
  },
] as const;

const SOMNIA_AGENTS_PAYLOAD = {
  network: "Somnia Testnet",
  platformContract: SOMNIA_AGENT_CONTRACTS["Platform contract"],
  agentRegistry: SOMNIA_AGENT_CONTRACTS["Agent registry"],
  agents: SOMNIA_OFFICIAL_AGENTS,
  arcpayRule: "Attach Somnia Agent receipts to ArcPay orders before settlement or audit completion.",
};

function templateSnippet(slug: string) {
  return [
    `const res = await fetch("https://x402.20.208.46.195.nip.io/agent/${encodeURIComponent(slug)}/work");`,
    "if (res.status === 402) {",
    "  const quote = await res.json();",
    "  // Pay quote.accepts[0] through AgentOrderBook.createOrder(agentId, requestUri).",
    "}",
  ].join("\n");
}
