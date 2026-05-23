"use client";

import { useState } from "react";
import { BadgeCheck, Bot, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RecordTable } from "@/components/RecordTable";
import { writeRecord } from "@/lib/somnia";

export default function ContractorsPage() {
  const [form, setForm] = useState({
    name: "Ada Research Agent",
    wallet: "",
    role: "Risk analyst",
    rate: "0.01 STT per job",
  });
  const [status, setStatus] = useState("");

  function addContractor() {
    writeRecord({
      id: crypto.randomUUID(),
      type: "contractor",
      title: `${form.name} - ${form.role}`,
      amount: form.rate,
      status: form.wallet ? "wallet-linked" : "pending-wallet",
    });
    setStatus("Contractor saved for this browser workspace.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Workforce controls"
        title="Manage contractors and agents"
        description="Map humans or autonomous services to wallets, rates, and roles before routing spend through direct payments or escrowed Somnia orders."
        badges={["Wallet mapping", "Role metadata", "Payment-ready"]}
      />
      <section className="grid section">
        <div className="panel third stat">
          <Users />
          <span className="eyebrow">People</span>
          <strong>Human</strong>
          <p className="muted">Map real contractors to wallet addresses and payment rates.</p>
        </div>
        <div className="panel third stat">
          <Bot />
          <span className="eyebrow">Agents</span>
          <strong>AI</strong>
          <p className="muted">Track autonomous services beside humans before order execution.</p>
        </div>
        <div className="panel third stat">
          <ShieldCheck />
          <span className="eyebrow">Controls</span>
          <strong>Policy</strong>
          <p className="muted">Move trusted workers into allowlists before enabling treasury spend.</p>
        </div>

        <div className="panel">
          <h2>Add contractor</h2>
          {Object.entries(form).map(([key, value]) => (
            <label className="field" key={key}>
              <span>{key}</span>
              <input value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </label>
          ))}
          <button onClick={addContractor}>Save contractor</button>
          {status ? <div className="notice">{status}</div> : null}
        </div>
        <div className="panel">
          <h2>Readiness checklist</h2>
          <div className="dense-grid">
            <div className="check"><BadgeCheck size={16} /> Wallet address linked before direct payouts.</div>
            <div className="check"><BadgeCheck size={16} /> Role and rate visible in audit records.</div>
            <div className="check"><BadgeCheck size={16} /> Risk route can score agent or contractor wallets.</div>
            <div className="notice">For autonomous services, also register the agent on the Agents page.</div>
          </div>
        </div>
        <div className="panel full">
          <h2>Contractor records</h2>
          <RecordTable type="contractor" />
        </div>
      </section>
    </>
  );
}
