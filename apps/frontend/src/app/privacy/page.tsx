"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  CONTRACTS,
  NATIVE_TOKEN,
  SOMUSD_TOKEN_ADDRESS,
  erc20Contract,
  fromWei,
  fromUnits,
  hashText,
  privacyVaultContract,
  toUnits,
  toWei,
  writeRecord,
} from "@/lib/somnia";

export default function PrivacyPage() {
  const [form, setForm] = useState({
    secret: "invoice-42-recipient-secret",
    nullifierSecret: "release-secret-42",
    memoUri: "encrypted://somnia/private-invoice-42",
    asset: "SOMUSD",
    amount: "1",
    recipient: "",
  });
  const [intent, setIntent] = useState("");
  const [status, setStatus] = useState("");

  const commitment = hashText(form.secret);
  const nullifier = hashText(form.nullifierSecret);

  async function createIntent() {
    const vault = await privacyVaultContract();
    if (form.asset === "STT") {
      const tx = await vault.createNativeIntent(commitment, form.memoUri, { value: toWei(form.amount) });
      await tx.wait();
      writeRecord({ id: crypto.randomUUID(), type: "audit", title: "Created private STT intent", amount: `${form.amount} STT`, status: "committed", txHash: tx.hash });
      setStatus(`Private STT intent created: ${tx.hash}`);
      return;
    }

    const token = await erc20Contract();
    const amount = toUnits(form.amount);
    const approveTx = await token.approve(CONTRACTS.SomniaPrivacyVault, amount);
    await approveTx.wait();
    const tx = await vault.createTokenIntent(commitment, SOMUSD_TOKEN_ADDRESS, amount, form.memoUri);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: "Created private SOMUSD intent", amount: `${form.amount} SOMUSD`, status: "committed", txHash: tx.hash });
    setStatus(`Private SOMUSD intent created: ${tx.hash}`);
  }

  async function releaseIntent() {
    const vault = await privacyVaultContract();
    const tx = await vault.releaseIntent(commitment, nullifier, form.recipient);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "payment", title: "Released private intent", amount: `${form.amount} ${form.asset}`, status: "released", txHash: tx.hash });
    setStatus(`Private intent released: ${tx.hash}`);
    await loadIntent();
  }

  async function cancelIntent() {
    const vault = await privacyVaultContract();
    const tx = await vault.cancelIntent(commitment);
    await tx.wait();
    writeRecord({ id: crypto.randomUUID(), type: "audit", title: "Cancelled private intent", amount: `${form.amount} ${form.asset}`, status: "cancelled", txHash: tx.hash });
    setStatus(`Private intent cancelled: ${tx.hash}`);
    await loadIntent();
  }

  async function loadIntent() {
    const vault = await privacyVaultContract();
    const next = await vault.intents(commitment);
    const asset = next[1] === NATIVE_TOKEN ? "STT" : "SOMUSD";
    const amount = asset === "STT" ? fromWei(next[2]) : fromUnits(next[2]);
    setIntent(`Operator ${next[0]} | asset ${asset} | amount ${amount} | memo ${next[3]} | released ${next[4]} | cancelled ${next[5]}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Treasury privacy"
        title="Private payment intents"
        description="Create commitment-based STT or SOMUSD escrows with encrypted metadata. Recipient and memo are not public until the operator releases or cancels the intent."
        badges={["Encrypted metadata", "Commitment IDs", "Nullifier release", "SOMUSD/STT"]}
      />
      <section className="grid section">
        <div className="panel">
          <h2>Create private intent</h2>
          <label className="field"><span>Commitment secret</span><input value={form.secret} onChange={(event) => setForm({ ...form, secret: event.target.value })} /></label>
          <label className="field"><span>Encrypted memo URI</span><input value={form.memoUri} onChange={(event) => setForm({ ...form, memoUri: event.target.value })} /></label>
          <label className="field"><span>Asset</span><select value={form.asset} onChange={(event) => setForm({ ...form, asset: event.target.value })}><option>SOMUSD</option><option>STT</option></select></label>
          <label className="field"><span>Amount</span><input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label>
          <button onClick={createIntent}>Create private intent</button>
          <div className="notice">Commitment: <code>{commitment}</code></div>
        </div>
        <div className="panel">
          <h2>Release or cancel</h2>
          <label className="field"><span>Nullifier secret</span><input value={form.nullifierSecret} onChange={(event) => setForm({ ...form, nullifierSecret: event.target.value })} /></label>
          <label className="field"><span>Recipient</span><input value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} /></label>
          <div className="actions">
            <button disabled={!form.recipient} onClick={releaseIntent}>Release</button>
            <button className="secondary" onClick={cancelIntent}>Cancel</button>
            <button className="secondary" onClick={loadIntent}>Load intent</button>
          </div>
          <div className="notice">Nullifier: <code>{nullifier}</code></div>
        </div>
        <div className="panel full">
          <h2>Privacy boundary</h2>
          <p>
            This is an application-level privacy layer, not a shielded mixer. It hides recipient and business metadata until release,
            stores only encrypted memo URIs, prevents replay with nullifiers, and keeps funds operator-controlled for compliance.
          </p>
          {status ? <div className="notice">{status}</div> : null}
          {intent ? <div className="notice">{intent}</div> : null}
        </div>
      </section>
    </>
  );
}
