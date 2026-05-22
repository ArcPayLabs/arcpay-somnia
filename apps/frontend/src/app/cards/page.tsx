"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  CONTRACTS,
  SOMUSD_TOKEN_ADDRESS,
  erc20Contract,
  fromUnits,
  hashText,
  spendCardVaultContract,
  toUnits,
  writeRecord,
} from "@/lib/somnia";

export default function CardsPage() {
  const [form, setForm] = useState({
    slug: "research-card-001",
    agent: "",
    recipient: "",
    label: "Research Agent SOMUSD Card",
    limit: "5",
    topup: "5",
    spend: "1",
    memo: "agent service spend",
  });
  const [card, setCard] = useState("");
  const [status, setStatus] = useState("");

  const cardId = hashText(form.slug);

  async function createCard() {
    const vault = await spendCardVaultContract();
    const tx = await vault.createCard(cardId, form.agent, SOMUSD_TOKEN_ADDRESS, toUnits(form.limit), form.label);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `Created SOMUSD spend card ${form.slug}`, status: "confirmed", txHash: tx.hash });
    setStatus(`Card created: ${tx.hash}`);
  }

  async function approveAndTopUp() {
    const token = await erc20Contract();
    const amount = toUnits(form.topup);
    const approveTx = await token.approve(CONTRACTS.AgentSpendCardVault, amount);
    await approveTx.wait();
    const vault = await spendCardVaultContract();
    const tx = await vault.topUpCard(cardId, amount);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `Funded SOMUSD card ${form.slug}`, amount: `${form.topup} SOMUSD`, status: "confirmed", txHash: tx.hash });
    setStatus(`Card funded: ${tx.hash}`);
    await loadCard();
  }

  async function spendCard() {
    const vault = await spendCardVaultContract();
    const tx = await vault.spendCard(cardId, form.recipient, toUnits(form.spend), form.memo);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "payment", title: `SOMUSD card spend ${form.slug}`, amount: `${form.spend} SOMUSD`, status: "confirmed", txHash: tx.hash });
    setStatus(`Card spend confirmed: ${tx.hash}`);
    await loadCard();
  }

  async function setActive(active: boolean) {
    const vault = await spendCardVaultContract();
    const tx = await vault.setCardStatus(cardId, active);
    await tx.wait();
    setStatus(`Card ${active ? "activated" : "frozen"}: ${tx.hash}`);
    await loadCard();
  }

  async function loadCard() {
    const vault = await spendCardVaultContract();
    const next = await vault.cards(cardId);
    setCard(`Operator ${next[0]} | Agent ${next[1]} | balance ${fromUnits(next[4])} SOMUSD | spent ${fromUnits(next[5])}/${fromUnits(next[3])} | active ${next[6]} | ${next[7]}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Agent spend cards"
        title="SOMUSD virtual cards"
        description="Create a card-like SOMUSD budget for an agent. Operators fund and freeze the card; the assigned agent can spend within the limit."
        badges={["SOMUSD testnet", "ERC20-backed", "Agent-limited", "Freeze controls"]}
      />
      <section className="grid section">
        <div className="panel">
          <h2>Create card</h2>
          <label className="field"><span>Card slug</span><input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
          <label className="field"><span>Agent wallet</span><input value={form.agent} onChange={(event) => setForm({ ...form, agent: event.target.value })} /></label>
          <label className="field"><span>Label</span><input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /></label>
          <label className="field"><span>Limit SOMUSD</span><input value={form.limit} onChange={(event) => setForm({ ...form, limit: event.target.value })} /></label>
          <button disabled={!form.agent} onClick={createCard}>Create SOMUSD card</button>
        </div>
        <div className="panel">
          <h2>Fund and control</h2>
          <label className="field"><span>Top-up SOMUSD</span><input value={form.topup} onChange={(event) => setForm({ ...form, topup: event.target.value })} /></label>
          <div className="actions">
            <button onClick={approveAndTopUp}>Approve + top up</button>
            <button className="secondary" onClick={() => setActive(false)}>Freeze</button>
            <button className="secondary" onClick={() => setActive(true)}>Activate</button>
            <button className="secondary" onClick={loadCard}>Load card</button>
          </div>
          <div className="notice">SOMUSD token: <code>{SOMUSD_TOKEN_ADDRESS}</code></div>
        </div>
        <div className="panel">
          <h2>Agent spend</h2>
          <label className="field"><span>Recipient</span><input value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} /></label>
          <label className="field"><span>Amount SOMUSD</span><input value={form.spend} onChange={(event) => setForm({ ...form, spend: event.target.value })} /></label>
          <label className="field"><span>Memo</span><input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} /></label>
          <button disabled={!form.recipient} onClick={spendCard}>Spend as assigned agent</button>
        </div>
        <div className="panel full">
          <h2>Card state</h2>
          {status ? <div className="notice">{status}</div> : null}
          {card ? <div className="notice">{card}</div> : <div className="notice">Create or load a card to inspect state.</div>}
        </div>
      </section>
    </>
  );
}
