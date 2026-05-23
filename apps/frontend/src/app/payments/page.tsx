"use client";

import { useState } from "react";
import { BadgeCheck, Send, ShieldCheck, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RecordTable } from "@/components/RecordTable";
import { signerProvider, toWei, writeRecord } from "@/lib/somnia";

export default function PaymentsPage() {
  const [form, setForm] = useState({
    recipient: "",
    amount: "0.01",
    memo: "Somnia contractor payment",
  });
  const [status, setStatus] = useState("");

  async function sendPayment() {
    setStatus("Opening wallet signer...");
    const signer = await signerProvider();
    const tx = await signer.sendTransaction({
      to: form.recipient,
      value: toWei(form.amount),
    });
    setStatus("Waiting for Somnia confirmation...");
    await tx.wait();
    writeRecord({
      id: crypto.randomUUID(),
      type: "payment",
      title: form.memo,
      amount: `${form.amount} STT`,
      status: "confirmed",
      txHash: tx.hash,
    });
    setStatus(`Payment confirmed: ${tx.hash}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Wallet-signed treasury payments"
        title="Pay on Somnia testnet"
        description="Direct STT payments use the connected EVM wallet, so every transaction is explicitly signed and visible on the Somnia explorer."
        badges={["Wallet popup required", "STT testnet", "Audit record created"]}
      />
      <section className="grid section">
        <div className="panel stat third">
          <Send />
          <span className="eyebrow">Direct payout</span>
          <strong>STT</strong>
          <p className="muted">Operator-signed transfer from the connected Somnia wallet.</p>
        </div>
        <div className="panel stat third">
          <ShieldCheck />
          <span className="eyebrow">Safer route</span>
          <strong>Orders</strong>
          <p className="muted">Use escrowed agent orders when policy enforcement must happen before spend.</p>
        </div>
        <div className="panel stat third">
          <WalletCards />
          <span className="eyebrow">Budget route</span>
          <strong>Cards</strong>
          <p className="muted">Use SOMUSD cards for recurring agent budgets and freeze controls.</p>
        </div>

        <div className="panel">
          <h2>New payment</h2>
          <label className="field">
            <span>Recipient address</span>
            <input value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} />
          </label>
          <label className="field">
            <span>Amount STT</span>
            <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
          </label>
          <label className="field">
            <span>Memo</span>
            <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} />
          </label>
          <button disabled={!form.recipient} onClick={sendPayment}>Sign and send payment</button>
          {status ? <div className="notice">{status}</div> : null}
        </div>
        <div className="panel">
          <h2>Signing guardrails</h2>
          <div className="dense-grid">
            <div className="check"><BadgeCheck size={16} /> Wallet popup required for every direct transfer.</div>
            <div className="check"><BadgeCheck size={16} /> Chain switch is handled by the Somnia signer helper.</div>
            <div className="check"><BadgeCheck size={16} /> Confirmed transfers create a local/Supabase audit record.</div>
            <div className="notice">For agent spend, use Orders so TreasuryPolicy can enforce limits before escrow.</div>
          </div>
        </div>
        <div className="panel full">
          <h2>Payment history</h2>
          <RecordTable type="payment" />
        </div>
      </section>
    </>
  );
}
