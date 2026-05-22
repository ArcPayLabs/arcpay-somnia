"use client";

import { Interface, type LogDescription } from "ethers";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DEPTH_CONTRACTS_READY, RISK_ORACLE_ABI, hashText, riskOracleContract, toWei, writeRecord } from "@/lib/somnia";

const oracleInterface = new Interface(RISK_ORACLE_ABI);

export default function OraclePage() {
  const [form, setForm] = useState({
    orderId: hashText("demo-order"),
    prompt: "Score this autonomous treasury order for fraud, webhook risk, and policy anomalies.",
    requestId: "",
    deposit: "0.24",
    score: "84",
    verdict: "APPROVE",
    evidenceUri: "ipfs://risk-evidence-demo",
  });
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");

  async function requestRisk() {
    if (!DEPTH_CONTRACTS_READY) {
      setStatus("Risk oracle requires the depth contract redeploy.");
      return;
    }
    const contract = await riskOracleContract();
    const tx = await contract.requestRisk(form.orderId, form.prompt, { value: toWei(form.deposit) });
    const receipt = await tx.wait();
    const event = receipt?.logs
      .map((log: { topics: string[]; data: string }) => {
        try {
          return oracleInterface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed: LogDescription | null) => parsed?.name === "RiskRequested");
    const requestId = event?.args?.requestId?.toString() as string | undefined;
    if (requestId) setForm((next) => ({ ...next, requestId }));
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: "Somnia agent risk request", status: "requested", txHash: tx.hash });
    setStatus(`Risk requested${requestId ? `: ${requestId}` : ""}`);
  }

  async function fulfillDemo() {
    if (!DEPTH_CONTRACTS_READY) {
      setStatus("Risk oracle requires the depth contract redeploy.");
      return;
    }
    const contract = await riskOracleContract();
    const tx = await contract.ownerFulfillForDemo(BigInt(form.requestId), BigInt(form.score), form.verdict, form.evidenceUri);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `Risk oracle ${form.verdict}`, status: "fulfilled", txHash: tx.hash });
    setStatus(`Risk fulfilled: ${tx.hash}`);
    await loadResult();
  }

  async function loadResult() {
    if (!DEPTH_CONTRACTS_READY) {
      setStatus("Risk oracle requires the depth contract redeploy.");
      return;
    }
    const contract = await riskOracleContract();
    const next = await contract.results(BigInt(form.requestId));
    setResult(`Request ${next[0]} | Order ${next[1]} | requester ${next[2]} | score ${next[3]} | verdict ${next[4]} | evidence ${next[5]} | fulfilled ${next[6]}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Somnia-native agent reaction hook"
        title="Risk oracle"
        description="This page drives the SomniaAgentRiskOracle contract. In production it points at Somnia's agent platform createRequest/callback flow; the testnet fallback lets judges run the same state transition."
        badges={["createRequest-compatible", "On-chain callback result", "Policy intelligence"]}
      />
      <section className="grid section">
        {!DEPTH_CONTRACTS_READY ? (
          <div className="panel full notice">SomniaAgentRiskOracle is compiled and tested but not deployed in the current address file. Top up the deployer and run `npm run deploy:somnia`.</div>
        ) : null}
        <div className="panel">
          <h2>Request agent scoring</h2>
          <label className="field"><span>Order ID</span><input value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })} /></label>
          <label className="field"><span>Prompt</span><textarea value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} /></label>
          <label className="field"><span>Somnia agent deposit STT</span><input value={form.deposit} onChange={(event) => setForm({ ...form, deposit: event.target.value })} /></label>
          <button onClick={requestRisk}>Request risk score</button>
        </div>
        <div className="panel">
          <h2>Callback / result</h2>
          <label className="field"><span>Request ID</span><input value={form.requestId} onChange={(event) => setForm({ ...form, requestId: event.target.value })} /></label>
          <label className="field"><span>Score</span><input value={form.score} onChange={(event) => setForm({ ...form, score: event.target.value })} /></label>
          <label className="field"><span>Verdict</span><input value={form.verdict} onChange={(event) => setForm({ ...form, verdict: event.target.value })} /></label>
          <label className="field"><span>Evidence URI</span><input value={form.evidenceUri} onChange={(event) => setForm({ ...form, evidenceUri: event.target.value })} /></label>
          <div className="actions">
            <button disabled={!form.requestId} onClick={fulfillDemo}>Fulfill demo callback</button>
            <button disabled={!form.requestId} className="secondary" onClick={loadResult}>Load result</button>
          </div>
          {status ? <div className="notice">{status}</div> : null}
          {result ? <div className="notice">{result}</div> : null}
        </div>
      </section>
    </>
  );
}
