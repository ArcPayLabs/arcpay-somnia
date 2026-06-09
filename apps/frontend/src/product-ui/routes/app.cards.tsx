"use client";

import { useState } from "react";
import { CreditCard, Pause, Plus, WalletCards } from "lucide-react";
import { ActionDrawer } from "@/components/primitives/ActionDrawer";
import { AsyncButton } from "@/components/primitives/AsyncButton";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { connectedAddress, erc20Contract, hashText, shortAddress, SOMUSD_TOKEN_ADDRESS, spendCardVaultContract, toUnits, writeRecord } from "@somnia/lib/somnia";

export const Route = { options: { component: CardsRoute } };

function CardsRoute() {
  const [form, setForm] = useState({ slug: "research-card-001", agent: "", label: "Research Agent SOMUSD Card", limit: "5", topUp: "5" });
  const [drawer, setDrawer] = useState<"create" | "fund" | null>(null);
  const [status, setStatus] = useState("Create SOMUSD cards for agents with limits, top-ups, freeze, and activation controls.");

  async function createCard() {
    const error = validateCardForm(form);
    if (error) {
      setStatus(error);
      return;
    }
    const vault = await spendCardVaultContract() as any;
    const agent = form.agent.trim() || await connectedAddress();
    const tx = await vault.createCard(hashText(form.slug), agent, SOMUSD_TOKEN_ADDRESS, toUnits(form.limit), form.label);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "card", title: `Created ${form.label}`, status: "created", amount: form.limit, txHash: tx.hash });
    setStatus(`Card created: ${tx.hash}`);
    setDrawer(null);
  }

  async function topUpCard() {
    const error = validateSlugAndAmount(form.slug, form.topUp, "top-up");
    if (error) {
      setStatus(error);
      return;
    }
    const amount = toUnits(form.topUp);
    const token = await erc20Contract(SOMUSD_TOKEN_ADDRESS) as any;
    const vault = await spendCardVaultContract() as any;
    const approve = await token.approve(vault.target, amount);
    await approve.wait();
    const tx = await vault.topUpCard(hashText(form.slug), amount);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "card", title: `Topped up ${form.slug}`, status: "funded", amount: form.topUp, txHash: tx.hash });
    setStatus(`Card topped up: ${tx.hash}`);
    setDrawer(null);
  }

  async function setActive(active: boolean) {
    if (!form.slug.trim()) {
      setStatus("Card slug is required before changing card status.");
      return;
    }
    const vault = await spendCardVaultContract() as any;
    const tx = await vault.setCardStatus(hashText(form.slug), active);
    await tx.wait();
    setStatus(active ? `Card activated: ${tx.hash}` : `Card frozen: ${tx.hash}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CreditCard}
        eyebrow="Agent spend cards"
        title="SOMUSD cards"
        description="Create token-backed agent budgets with card limits and operational freeze controls."
        actions={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setDrawer("create")} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">
              <Plus className="h-4 w-4" /> Create card
            </button>
            <button type="button" onClick={() => setDrawer("fund")} className="rounded-full bg-muted px-4 py-2.5 text-sm font-semibold">
              Fund card
            </button>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard icon={WalletCards} label="Token" value="SOMUSD" hint={shortAddress(SOMUSD_TOKEN_ADDRESS)} />
        <StatCard label="Limit" value={`${form.limit} SOMUSD`} hint="Per card" />
        <StatCard label="Controls" value="Freeze" hint="Activation requires wallet approval" emphasis />
      </div>
      <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{status}</div>

      <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Summary label="Selected card" value={form.slug} />
          <Summary label="Assigned agent" value={form.agent || "Connect wallet at signing"} />
          <Summary label="Top-up amount" value={`${form.topUp} SOMUSD`} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <AsyncButton onClick={() => setActive(false)} onError={setStatus} className="inline-flex items-center gap-2 rounded-full bg-muted px-5 py-2.5 text-sm font-semibold" loadingLabel="Freezing...">
            <Pause className="h-4 w-4" /> Freeze
          </AsyncButton>
          <AsyncButton onClick={() => setActive(true)} onError={setStatus} className="rounded-full bg-muted px-5 py-2.5 text-sm font-semibold" loadingLabel="Activating...">
            Activate
          </AsyncButton>
        </div>
      </section>

      <ActionDrawer
        open={drawer === "create"}
        title="Create SOMUSD card"
        description="Create a policy-bound spend card for one agent. Leave agent wallet blank to use the connected signer."
        onClose={() => setDrawer(null)}
      >
        <div className="grid gap-4">
          <Field label="Card slug"><input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="ap-in" /></Field>
          <Field label="Agent wallet"><input value={form.agent} onChange={(event) => setForm({ ...form, agent: event.target.value })} className="ap-in" placeholder="0x agent wallet or blank for signer" /></Field>
          <Field label="Label"><input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} className="ap-in" /></Field>
          <Field label="Limit SOMUSD"><input value={form.limit} onChange={(event) => setForm({ ...form, limit: event.target.value })} className="ap-in" inputMode="decimal" /></Field>
          <AsyncButton onClick={createCard} onError={setStatus} className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground" loadingLabel="Creating card...">
            Create card
          </AsyncButton>
        </div>
      </ActionDrawer>

      <ActionDrawer
        open={drawer === "fund"}
        title="Fund SOMUSD card"
        description="Approve SOMUSD and top up the selected card. The button stays locked while the wallet request is pending."
        onClose={() => setDrawer(null)}
      >
        <div className="grid gap-4">
          <Field label="Card slug"><input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="ap-in" /></Field>
          <Field label="Top-up SOMUSD"><input value={form.topUp} onChange={(event) => setForm({ ...form, topUp: event.target.value })} className="ap-in" inputMode="decimal" /></Field>
          <AsyncButton onClick={topUpCard} onError={setStatus} className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground" loadingLabel="Funding card...">
            Approve and top up
          </AsyncButton>
        </div>
      </ActionDrawer>
    </div>
  );
}

function Field({ label, children }: { readonly label: string; readonly children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Summary({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="rounded-2xl bg-muted/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-2 break-all text-sm font-semibold">{value}</div>
    </div>
  );
}

function validateCardForm(form: { slug: string; agent: string; label: string; limit: string }) {
  if (!form.slug.trim()) return "Card slug is required.";
  if (!form.label.trim()) return "Card label is required.";
  if (form.agent.trim() && !/^0x[a-fA-F0-9]{40}$/.test(form.agent.trim())) return "Enter a valid agent wallet or leave it blank to use your connected signer.";
  return validateSlugAndAmount(form.slug, form.limit, "limit");
}

function validateSlugAndAmount(slug: string, amountText: string, label: string) {
  if (!slug.trim()) return "Card slug is required.";
  const amount = Number.parseFloat(amountText);
  if (!Number.isFinite(amount) || amount <= 0) return `Enter a valid positive ${label} amount.`;
  return "";
}
