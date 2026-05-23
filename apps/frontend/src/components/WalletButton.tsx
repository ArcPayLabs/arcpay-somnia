"use client";

import { useEffect, useState } from "react";
import { balances, connectedAddress, shortAddress, signerProvider, switchToSomnia } from "@/lib/somnia";

export function WalletButton() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);

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

  async function signIn() {
    setError("");
    try {
      const signer = await signerProvider();
      const nextAddress = await signer.getAddress();
      const challenge = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: nextAddress }),
      }).then((response) => response.json());
      const signature = await signer.signMessage(challenge.message);
      const verified = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      if (!verified.ok) throw new Error("Wallet signature verification failed.");
      setAuthed(true);
      setAddress(nextAddress);
      setBalance(await balances(nextAddress));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet sign-in failed.");
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
      <button className="secondary" onClick={signIn}>{authed ? "Signed in" : "Sign in"}</button>
      {error ? <small className="danger">{error}</small> : null}
    </div>
  );
}
