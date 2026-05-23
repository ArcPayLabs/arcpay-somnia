"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DEPTH_CONTRACTS_READY, agentIdFromSlug, connectedAddress, fromWei, policyContract, toWei, writeRecord } from "@/lib/somnia";

export default function PoliciesPage() {
  const [form, setForm] = useState({
    hourly: "0.05",
    daily: "0.2",
    weekly: "1",
    approval: "0.1",
    startHour: "0",
    endHour: "0",
    emergencyPaused: false,
    allowlistEnabled: true,
    agentSlug: "research-agent",
    approvalOrderId: "",
  });
  const [policy, setPolicyView] = useState("");
  const [status, setStatus] = useState("");

  async function savePolicy() {
    setStatus("Saving policy...");
    const contract = await policyContract();
    const tx = DEPTH_CONTRACTS_READY
      ? await contract.setPolicy(
        toWei(form.hourly),
        toWei(form.daily),
        toWei(form.weekly),
        toWei(form.approval),
        Number(form.startHour),
        Number(form.endHour),
        form.emergencyPaused,
        form.allowlistEnabled,
      )
      : await contract.setPolicy(
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

  async function approveOrder(approved: boolean) {
    if (!DEPTH_CONTRACTS_READY) {
      setStatus("Per-order approvals require the depth contract redeploy.");
      return;
    }
    const contract = await policyContract();
    const tx = await contract.approveSpend(form.approvalOrderId, approved);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `${approved ? "Approved" : "Revoked"} high-value order`, status: "confirmed", txHash: tx.hash });
    setStatus(`Order approval ${approved ? "saved" : "revoked"}: ${tx.hash}`);
  }

  async function loadPolicy() {
    const contract = await policyContract();
    const account = await connectedAddress();
    const next = await contract.policies(account);
    setPolicyView(DEPTH_CONTRACTS_READY
      ? `Hourly ${fromWei(next[0])} STT | Daily ${fromWei(next[1])} STT | Weekly ${fromWei(next[2])} STT | Approval ${fromWei(next[3])} STT | Hours ${next[4]}-${next[5]} UTC | Paused ${next[6]} | Allowlist ${next[7]}`
      : `Hourly ${fromWei(next[0])} STT | Daily ${fromWei(next[1])} STT | Approval ${fromWei(next[2])} STT | Paused ${next[3]} | Allowlist ${next[4]}`);
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
        {!DEPTH_CONTRACTS_READY ? (
          <div className="panel full notice">
            Depth contracts are not present in the current deployment file. Redeploy before testing weekly limits, time windows, or per-order approvals.
          </div>
        ) : null}
        <div className="panel">
          <h2>Spend limits</h2>
          <label className="field"><span>Hourly STT</span><input value={form.hourly} onChange={(event) => setForm({ ...form, hourly: event.target.value })} /></label>
          <label className="field"><span>Daily STT</span><input value={form.daily} onChange={(event) => setForm({ ...form, daily: event.target.value })} /></label>
          <label className="field"><span>Weekly STT</span><input value={form.weekly} onChange={(event) => setForm({ ...form, weekly: event.target.value })} /></label>
          <label className="field"><span>Approval threshold STT</span><input value={form.approval} onChange={(event) => setForm({ ...form, approval: event.target.value })} /></label>
          <label className="field"><span>Allowed start hour UTC</span><input value={form.startHour} onChange={(event) => setForm({ ...form, startHour: event.target.value })} /></label>
          <label className="field"><span>Allowed end hour UTC</span><input value={form.endHour} onChange={(event) => setForm({ ...form, endHour: event.target.value })} /></label>
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
          <label className="field">
            <span>Pre-approve order ID above threshold</span>
            <input value={form.approvalOrderId} onChange={(event) => setForm({ ...form, approvalOrderId: event.target.value })} />
          </label>
          <div className="actions">
            <button disabled={!form.approvalOrderId} onClick={() => approveOrder(true)}>Approve order</button>
            <button disabled={!form.approvalOrderId} className="secondary" onClick={() => approveOrder(false)}>Revoke approval</button>
          </div>
          {policy ? <div className="notice">{policy}</div> : null}
          {status ? <div className="notice">{status}</div> : null}
        </div>
      </section>
    </>
  );
}
