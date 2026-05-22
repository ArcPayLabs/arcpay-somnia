"use client";

import { useState } from "react";
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
        <div className="panel full">
          <h2>Contractor records</h2>
          <RecordTable type="contractor" />
        </div>
      </section>
    </>
  );
}
