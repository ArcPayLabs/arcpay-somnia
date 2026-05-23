"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, KeyRound, Network, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { balances, connectedAddress, shortAddress, switchToSomnia } from "@/lib/somnia";

export default function WalletPage() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [status, setStatus] = useState("Waiting for wallet connection.");

  async function connect() {
    setStatus("Switching wallet to Somnia Testnet...");
    await switchToSomnia();
    const next = await connectedAddress();
    setAddress(next);
    setBalance(await balances(next));
    setStatus("Wallet connected and ready for Somnia contract writes.");
  }

  useEffect(() => {
    connectedAddress().then(async (next) => {
      setAddress(next);
      setBalance(await balances(next));
      setStatus("Existing Somnia wallet session detected.");
    }).catch(() => undefined);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Wallet interface"
        title="Somnia wallet control"
        description="The wallet is the primary signing layer for ArcPay Somnia: account login, contract writes, direct STT payments, card approvals, and privacy intent releases."
        badges={["EVM wallet", "Somnia Testnet", "Message auth"]}
      />
      <section className="wallet-console section">
        <div className="wallet-hero-card">
          <div>
            <span>Current signer</span>
            <h2>{address ? shortAddress(address) : "No wallet connected"}</h2>
            <p>{address ? `${Number(balance || 0).toFixed(6)} STT available for testnet actions.` : "Connect MetaMask, Rabby, or another EVM wallet to use ArcPay Somnia."}</p>
          </div>
          <button onClick={connect}>{address ? "Refresh wallet" : "Connect wallet"}</button>
        </div>
        <div className="wallet-check-grid">
          <article><Network /><strong>Network lock</strong><p>Every connect action requests chain `50312`, preventing accidental writes on another EVM network.</p></article>
          <article><KeyRound /><strong>Signature auth</strong><p>The auth flow uses a wallet-signed challenge before storing the operator session cookie.</p></article>
          <article><WalletCards /><strong>Contract signer</strong><p>The same signer executes registry, order, policy, card, oracle, and privacy transactions.</p></article>
          <article><BadgeCheck /><strong>Status</strong><p>{status}</p></article>
        </div>
      </section>
    </>
  );
}
