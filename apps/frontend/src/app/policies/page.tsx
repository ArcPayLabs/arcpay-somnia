"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { agentIdFromSlug, connectedAddress, fromWei, policyContract, toWei, writeRecord } from "@/lib/somnia";

export default function PoliciesPage() {
  const [form, setForm] = useState({
    hourly: "0.05",
    daily: "0.2",
    approval: "0.1",
    emergencyPaused: false,
    allowlistEnabled: true,
    agentSlug: "research-agent",
  });
  const [policy, setPolicyView] = useState("");
  const [status, setStatus] = useState("");

  async function savePolicy() {
    setStatus("Saving policy...");
    const contract = await policyContract();
    const tx = await contract.setPolicy(
      toWei(form.hourly),
      toWei(form.daily),
      toWei(form.approval),
      form.emergencyPaused,
      form.allowlistEnabled,
    );
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: "Treasury policy updated", status: "confirmed", txHash: tx.hash });
    setStatus(`Policy saved: ${tx.hash}`);
  }

  async function allowAgent(allowed: boolean) {
    const contract = await policyContract();
    const tx = await contract.setAgentAllowed(agentIdFromSlug(form.agentSlug), allowed);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `${allowed ? "Allowed" : "Blocked"} ${form.agentSlug}`, status: "confirmed", txHash: tx.hash });
    setStatus(`Agent ${allowed ? "allowed" : "blocked"}: ${tx.hash}`);
  }

  async function loadPolicy() {
    const contract = await policyContract();
    const account = await connectedAddress();
    const next = await contract.policies(account);
    setPolicyView(`Hourly ${fromWei(next[0])} STT | Daily ${fromWei(next[1])} STT | Approval ${fromWei(next[2])} STT | Paused ${next[3]} | Allowlist ${next[4]}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Real contract enforcement"
        title="Treasury policy"
        description="These settings are enforced by TreasuryPolicy before an order can be created. If pause, allowlist, hourly, daily, or threshold checks fail, the transaction reverts."
        badges={["Hourly limit", "Daily limit", "Approval threshold", "Emergency pause", "Agent allowlist"]}
      />
      <section className="grid section">
        <div className="panel">
          <h2>Spend limits</h2>
          <label className="field"><span>Hourly STT</span><input value={form.hourly} onChange={(event) => setForm({ ...form, hourly: event.target.value })} /></label>
          <label className="field"><span>Daily STT</span><input value={form.daily} onChange={(event) => setForm({ ...form, daily: event.target.value })} /></label>
          <label className="field"><span>Approval threshold STT</span><input value={form.approval} onChange={(event) => setForm({ ...form, approval: event.target.value })} /></label>
          <label className="check"><input type="checkbox" checked={form.emergencyPaused} onChange={(event) => setForm({ ...form, emergencyPaused: event.target.checked })} /> Emergency pause</label>
          <label className="check"><input type="checkbox" checked={form.allowlistEnabled} onChange={(event) => setForm({ ...form, allowlistEnabled: event.target.checked })} /> Require agent allowlist</label>
          <div className="actions">
            <button onClick={savePolicy}>Save policy</button>
            <button className="secondary" onClick={loadPolicy}>Load current</button>
          </div>
        </div>

        <div className="panel">
          <h2>Allowed agents</h2>
          <label className="field">
            <span>Agent slug</span>
            <input value={form.agentSlug} onChange={(event) => setForm({ ...form, agentSlug: event.target.value })} />
          </label>
          <div className="actions">
            <button onClick={() => allowAgent(true)}>Allow agent</button>
            <button className="secondary" onClick={() => allowAgent(false)}>Block agent</button>
          </div>
          {policy ? <div className="notice">{policy}</div> : null}
          {status ? <div className="notice">{status}</div> : null}
        </div>
      </section>
    </>
  );
}
