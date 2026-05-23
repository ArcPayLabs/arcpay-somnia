"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Network, WalletCards } from "lucide-react";
import { AppPage } from "@/components/AppPage";
import { balances, connectedAddress, shortAddress, switchToSomnia } from "@/lib/somnia";

export default function WalletPage() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [status, setStatus] = useState("");

  async function connect() {
    setStatus("Connecting to Somnia...");
    await switchToSomnia();
    const next = await connectedAddress();
    setAddress(next);
    setBalance(await balances(next));
    setStatus("Wallet connected on Somnia Testnet.");
  }

  useEffect(() => {
    connectedAddress().then(async (next) => {
      setAddress(next);
      setBalance(await balances(next));
    }).catch(() => undefined);
  }, []);

  return (
    <AppPage
      eyebrow="Wallet interface"
      title="Somnia wallet control"
      description="The wallet is the primary signing layer for ArcPay Somnia: account login, contract writes, direct STT payments, card approvals, and privacy intent releases."
      badges={["EVM wallet", "Somnia Testnet", "Message auth"]}
      cards={[
        { title: "Connected wallet", body: address ? `${shortAddress(address)} - ${Number(balance || 0).toFixed(4)} STT` : "Connect MetaMask, Rabby, or another EVM wallet to start.", icon: WalletCards, action: <button onClick={connect}>{address ? "Refresh wallet" : "Connect wallet"}</button> },
        { title: "Network safety", body: "ArcPay forces chain 50312 before signing, so demo transactions point to Somnia testnet and do not cross into another EVM network.", icon: Network },
        { title: "Session state", body: status || "Wallet signature auth is available from the top bar and auth pages.", icon: BadgeCheck },
      ]}
    />
  );
}
