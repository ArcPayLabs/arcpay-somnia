"use client";

import { useCallback, useEffect, useState } from "react";
import { getAddress } from "ethers";
import { SOMNIA_CHAIN_ID_HEX } from "@somnia/lib/somnia";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type WalletConnectAction = {
  readonly connectWallet: () => Promise<void>;
  readonly connected: boolean;
  readonly connecting: boolean;
  readonly errorMessage: string | null;
  readonly label: string;
  readonly publicKeyBase58: string | null;
  readonly selectedWalletName: string | null;
};

const sessionKey = "arcpay-somnia-wallet-session";

export function useWalletConnectAction(): WalletConnectAction {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(sessionKey);
    if (stored) setAddress(stored);
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setConnecting(true);
      setErrorMessage(null);
      const provider = getProvider();
      if (!provider) {
        throw new Error("Install MetaMask, Rabby, or another EVM wallet to connect to Somnia.");
      }

      await provider.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: SOMNIA_CHAIN_ID_HEX,
          chainName: "Somnia Testnet",
          nativeCurrency: { name: "Somnia Test Token", symbol: "STT", decimals: 18 },
          rpcUrls: [process.env.NEXT_PUBLIC_SOMNIA_RPC_URL ?? "https://dream-rpc.somnia.network"],
          blockExplorerUrls: ["https://somnia-testnet.socialscan.io"],
        }],
      }).catch(async () => {
        await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SOMNIA_CHAIN_ID_HEX }] });
      });

      const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
      const nextAddress = getAddress(accounts[0] ?? "");
      const challenge = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address: nextAddress }),
      });
      const challengeBody = await challenge.json() as { message?: string; error?: string };
      if (!challenge.ok || !challengeBody.message) throw new Error(challengeBody.error ?? "Unable to create wallet challenge.");

      const signature = await provider.request({
        method: "personal_sign",
        params: [challengeBody.message, nextAddress],
      }) as string;
      const verified = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      const verifiedBody = await verified.json() as { address?: string; error?: string };
      if (!verified.ok || !verifiedBody.address) throw new Error(verifiedBody.error ?? "Wallet signature verification failed.");

      window.localStorage.setItem(sessionKey, nextAddress);
      setAddress(nextAddress);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Somnia wallet connection failed.";
      setErrorMessage(message);
      console.warn("Somnia wallet connection failed.", message);
    } finally {
      setConnecting(false);
    }
  }, []);

  return {
    connectWallet,
    connected: Boolean(address),
    connecting,
    errorMessage,
    label: address ? short(address) : connecting ? "Connecting..." : "Connect Somnia wallet",
    publicKeyBase58: address,
    selectedWalletName: "Somnia EVM",
  };
}

function getProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return (window as Window & { ethereum?: EthereumProvider }).ethereum ?? null;
}

function short(value: string) {
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
