"use client";

import { useEffect, useState } from "react";
import { balances, connectedAddress, shortAddress, switchToSomnia } from "@/lib/somnia";

export function WalletButton() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  async function connect() {
    setError("");
    try {
      await switchToSomnia();
      const nextAddress = await connectedAddress();
      setAddress(nextAddress);
      setBalance(await balances(nextAddress));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed.");
    }
  }

  useEffect(() => {
    if (!address) return;
    const timer = window.setInterval(() => {
      balances(address).then(setBalance).catch(() => undefined);
    }, 15000);
    return () => window.clearInterval(timer);
  }, [address]);

  return (
    <div className="wallet-box">
      {address ? (
        <>
          <span className="badge">{shortAddress(address)}</span>
          <span className="badge">{Number(balance).toFixed(4)} STT</span>
        </>
      ) : null}
      <button onClick={connect}>{address ? "Refresh wallet" : "Connect Somnia wallet"}</button>
      {error ? <small className="danger">{error}</small> : null}
    </div>
  );
}
