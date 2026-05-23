"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RecordTable } from "@/components/RecordTable";
import { CONTRACTS, SOMNIA_EXPLORER_URL, SOMNIA_RPC_URL, addressUrl, readRecords } from "@/lib/somnia";

export default function DashboardPage() {
  const [counts, setCounts] = useState({ payments: 0, invoices: 0, contractors: 0, audit: 0 });

  useEffect(() => {
    const records = readRecords();
    setCounts({
      payments: records.filter((record) => record.type === "payment").length,
      invoices: records.filter((record) => record.type === "invoice").length,
      contractors: records.filter((record) => record.type === "contractor").length,
      audit: records.length,
    });
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Somnia testnet control layer"
        title="Private treasury OS for autonomous agents"
        description="ArcPay Somnia is a testnet-native EVM agent treasury: discover agents, escrow orders, enforce spend policy, run SOMUSD cards, record invoices, and export proof for judges."
        badges={["Deployed contracts", "Wallet-first", "Agent-to-agent orders", "Policy enforcement"]}
      />

      <section className="grid section">
        <div className="panel third stat">
          <span className="muted">Payments</span>
          <strong>{counts.payments}</strong>
          <span>Local testnet payment records.</span>
        </div>
        <div className="panel third stat">
          <span className="muted">Invoices</span>
          <strong>{counts.invoices}</strong>
          <span>Operator-created invoices.</span>
        </div>
        <div className="panel third stat">
          <span className="muted">Contractors</span>
          <strong>{counts.contractors}</strong>
          <span>Agent and contractor records.</span>
        </div>

        <div className="panel">
          <h2>Somnia deployment</h2>
          <p className="muted">These contracts are already live on Somnia Testnet.</p>
          {Object.entries(CONTRACTS).map(([name, address]) => (
            <div className="kv" key={name}>
              <span>{name}</span>
              <a href={addressUrl(address)} target="_blank" rel="noreferrer">
                {address}
              </a>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Runtime</h2>
          <div className="kv">
            <span>Network</span>
            <strong>Somnia Testnet</strong>
          </div>
          <div className="kv">
            <span>Chain ID</span>
            <strong>50312 / 0xc488</strong>
          </div>
          <div className="kv">
            <span>RPC</span>
            <code>{SOMNIA_RPC_URL}</code>
          </div>
          <div className="kv">
            <span>Explorer</span>
            <a href={SOMNIA_EXPLORER_URL} target="_blank" rel="noreferrer">
              {SOMNIA_EXPLORER_URL}
            </a>
          </div>
        </div>

        <div className="panel full">
          <h2>Recent activity</h2>
          <RecordTable />
        </div>
      </section>
    </>
  );
}
