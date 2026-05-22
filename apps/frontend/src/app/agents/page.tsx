"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { agentIdFromSlug, fromWei, registryContract, shortAddress, toWei, writeRecord } from "@/lib/somnia";

type AgentView = {
  id: string;
  owner: string;
  name: string;
  endpoint: string;
  capabilities: string;
  price: string;
  active: boolean;
};

export default function AgentsPage() {
  const [form, setForm] = useState({
    slug: "research-agent",
    name: "Treasury Research Agent",
    endpoint: "https://example.com/x402/research",
    capabilities: "risk-scoring, invoice-review, payment-routing",
    price: "0.01",
  });
  const [agent, setAgent] = useState<AgentView | null>(null);
  const [status, setStatus] = useState("");

  async function registerAgent() {
    setStatus("Registering agent on Somnia...");
    const contract = await registryContract();
    const agentId = agentIdFromSlug(form.slug);
    const tx = await contract.registerAgent(agentId, form.name, form.endpoint, form.capabilities, toWei(form.price));
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: `Registered ${form.name}`, status: "confirmed", txHash: tx.hash });
    setStatus(`Agent registered: ${tx.hash}`);
  }

  async function loadAgent() {
    const contract = await registryContract();
    const agentId = agentIdFromSlug(form.slug);
    const next = await contract.agents(agentId);
    setAgent({
      id: agentId,
      owner: next[0],
      name: next[1],
      endpoint: next[2],
      capabilities: next[3],
      price: fromWei(next[4]),
      active: next[5],
    });
    setStatus("Agent loaded from Somnia.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Agent discovery registry"
        title="Register autonomous services"
        description="Somnia-native agents publish capability metadata, x402-compatible endpoints, and STT pricing so other agents or operators can discover and hire them."
        badges={["On-chain registry", "Capability discovery", "Agent-first UX"]}
      />

      <section className="grid section">
        <div className="panel">
          <h2>Register agent</h2>
          {Object.entries(form).map(([key, value]) => (
            <label className="field" key={key}>
              <span>{key}</span>
              <input value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </label>
          ))}
          <div className="actions">
            <button onClick={registerAgent}>Register on Somnia</button>
            <button className="secondary" onClick={loadAgent}>
              Load by slug
            </button>
          </div>
          {status ? <div className="notice">{status}</div> : null}
        </div>

        <div className="panel">
          <h2>Loaded agent</h2>
          {agent ? (
            <>
              <div className="kv">
                <span>Agent ID</span>
                <code>{agent.id}</code>
              </div>
              <div className="kv">
                <span>Owner</span>
                <strong>{shortAddress(agent.owner)}</strong>
              </div>
              <div className="kv">
                <span>Name</span>
                <strong>{agent.name}</strong>
              </div>
              <div className="kv">
                <span>Endpoint</span>
                <code>{agent.endpoint}</code>
              </div>
              <div className="kv">
                <span>Capabilities</span>
                <span>{agent.capabilities}</span>
              </div>
              <div className="kv">
                <span>Price</span>
                <strong>{agent.price} STT</strong>
              </div>
              <span className="badge">{agent.active ? "Active" : "Inactive"}</span>
            </>
          ) : (
            <div className="notice">Load or register an agent to see registry state.</div>
          )}
        </div>
      </section>
    </>
  );
}
