"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RecordTable } from "@/components/RecordTable";
import { writeRecord } from "@/lib/somnia";

export default function InvoicesPage() {
  const [form, setForm] = useState({ client: "Frontier DAO", amount: "100", token: "STT", due: "2026-06-01" });
  const [status, setStatus] = useState("");

  function createInvoice() {
    writeRecord({
      id: crypto.randomUUID(),
      type: "invoice",
      title: `${form.client} invoice due ${form.due}`,
      amount: `${form.amount} ${form.token}`,
      status: "issued",
    });
    setStatus("Invoice issued in local judge workspace.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Revenue operations"
        title="Create invoices"
        description="Keep the operator workflow complete for demo users: issue receivables, attach them to agent work, and keep them visible beside Somnia payment actions."
        badges={["No backend needed", "Judge-local records", "Treasury workflow"]}
      />
      <section className="grid section">
        <div className="panel">
          <h2>New invoice</h2>
          {Object.entries(form).map(([key, value]) => (
            <label className="field" key={key}>
              <span>{key}</span>
              <input value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </label>
          ))}
          <button onClick={createInvoice}>Issue invoice</button>
          {status ? <div className="notice">{status}</div> : null}
        </div>
        <div className="panel full">
          <h2>Invoice records</h2>
          <RecordTable type="invoice" />
        </div>
      </section>
    </>
  );
}
