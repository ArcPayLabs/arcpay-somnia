"use client";

import { Interface, type LogDescription } from "ethers";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AGENT_ORDER_BOOK_ABI, ORDER_STATUS, agentIdFromSlug, fromWei, orderBookContract, toWei, writeRecord } from "@/lib/somnia";

type OrderView = {
  orderId: string;
  agentId: string;
  requester: string;
  provider: string;
  amount: string;
  requestUri: string;
  resultUri: string;
  status: string;
};

const orderInterface = new Interface(AGENT_ORDER_BOOK_ABI);

export default function OrdersPage() {
  const [form, setForm] = useState({ agentSlug: "research-agent", requestUri: "ipfs://request-demo", amount: "0.01" });
  const [orderId, setOrderId] = useState("");
  const [resultUri, setResultUri] = useState("ipfs://result-demo");
  const [order, setOrder] = useState<OrderView | null>(null);
  const [status, setStatus] = useState("");

  async function createOrder() {
    setStatus("Creating escrowed order...");
    const contract = await orderBookContract();
    const tx = await contract.createOrder(agentIdFromSlug(form.agentSlug), form.requestUri, { value: toWei(form.amount) });
    const receipt = await tx.wait();
    const created = receipt?.logs
      .map((log: { topics: string[]; data: string }) => {
        try {
          return orderInterface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((event: LogDescription | null) => event?.name === "OrderCreated");
    const nextOrderId = created?.args?.orderId as string | undefined;
    if (nextOrderId) setOrderId(nextOrderId);
    writeRecord({ id: crypto.randomUUID(), type: "payment", title: `Agent order ${form.agentSlug}`, amount: `${form.amount} STT`, status: "escrowed", txHash: tx.hash });
    setStatus(`Order created${nextOrderId ? `: ${nextOrderId}` : ""}`);
  }

  async function loadOrder() {
    const contract = await orderBookContract();
    const next = await contract.orders(orderId);
    setOrder({
      orderId: next[0],
      agentId: next[1],
      requester: next[2],
      provider: next[3],
      amount: fromWei(next[4]),
      requestUri: next[5],
      resultUri: next[6],
      status: ORDER_STATUS[Number(next[7])] ?? "Unknown",
    });
    setStatus("Order loaded from Somnia.");
  }

  async function mutate(action: "acceptOrder" | "markProcessing" | "fulfillOrder" | "settleOrder" | "refundOrder") {
    setStatus(`${action}...`);
    const contract = await orderBookContract();
    const tx = action === "fulfillOrder" ? await contract[action](orderId, resultUri) : await contract[action](orderId);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: action, status: "confirmed", txHash: tx.hash });
    setStatus(`${action} confirmed: ${tx.hash}`);
    await loadOrder();
  }

  return (
    <>
      <PageHeader
        eyebrow="Autonomous service orders"
        title="Escrow, execute, settle"
        description="Operators or agents hire a registered provider, fund the order in STT, move the job through the state machine, then settle to the provider or refund."
        badges={["PENDING -> PROCESSING -> SETTLED", "Escrowed STT", "Policy-gated spend"]}
      />

      <section className="grid section">
        <div className="panel">
          <h2>Create order</h2>
          <label className="field">
            <span>Agent slug</span>
            <input value={form.agentSlug} onChange={(event) => setForm({ ...form, agentSlug: event.target.value })} />
          </label>
          <label className="field">
            <span>Request URI</span>
            <input value={form.requestUri} onChange={(event) => setForm({ ...form, requestUri: event.target.value })} />
          </label>
          <label className="field">
            <span>Amount STT</span>
            <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
          </label>
          <button onClick={createOrder}>Create escrow order</button>
        </div>

        <div className="panel">
          <h2>Control order</h2>
          <label className="field">
            <span>Order ID</span>
            <input value={orderId} onChange={(event) => setOrderId(event.target.value)} />
          </label>
          <label className="field">
            <span>Result URI</span>
            <input value={resultUri} onChange={(event) => setResultUri(event.target.value)} />
          </label>
          <div className="actions">
            <button className="secondary" onClick={loadOrder}>Load</button>
            <button onClick={() => mutate("acceptOrder")}>Accept</button>
            <button onClick={() => mutate("markProcessing")}>Processing</button>
            <button onClick={() => mutate("fulfillOrder")}>Fulfill</button>
            <button onClick={() => mutate("settleOrder")}>Settle</button>
            <button className="secondary" onClick={() => mutate("refundOrder")}>Refund</button>
          </div>
          {status ? <div className="notice">{status}</div> : null}
        </div>

        <div className="panel full">
          <h2>Order state</h2>
          {order ? (
            <div className="dense-grid">
              {Object.entries(order).map(([key, value]) => (
                <div className="kv" key={key}>
                  <span>{key}</span>
                  <code>{value}</code>
                </div>
              ))}
            </div>
          ) : (
            <div className="notice">Create or load an order to inspect its live contract state.</div>
          )}
        </div>
      </section>
    </>
  );
}
