"use client";

import { useCallback, useEffect, useState } from "react";
import { getAddress } from "ethers";
import { SOMNIA_CHAIN_ID_HEX } from "@somnia/lib/somnia";
import { friendlyWalletError } from "@/components/primitives/AsyncButton";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  isRabby?: boolean;
  isCoinbaseWallet?: boolean;
  providers?: EthereumProvider[];
};

export type WalletSupabaseAuth = {
  email: string;
  tokenHash: string;
  type: "email";
};

export type WalletConnectResult = {
  address: string;
  supabaseAuth?: WalletSupabaseAuth;
};

export type WalletProviderOption = {
  id: string;
  name: string;
  description: string;
  installed: boolean;
  provider?: EthereumProvider;
};

type WalletConnectAction = {
  readonly connectWallet: (walletId?: string, options?: { forceVerify?: boolean }) => Promise<WalletConnectResult>;
  readonly availableWallets: WalletProviderOption[];
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
  const [availableWallets, setAvailableWallets] = useState<WalletProviderOption[]>(DEFAULT_WALLETS);
  const [selectedWalletName, setSelectedWalletName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(sessionKey);
    if (stored) setAddress(stored);
    setSelectedWalletName(window.localStorage.getItem("arcpay-somnia-wallet-name") ?? null);
    setAvailableWallets(detectWallets());
  }, []);

  const connectWallet = useCallback(async (walletId?: string, options?: { forceVerify?: boolean }): Promise<WalletConnectResult> => {
    try {
      if (connecting) throw new Error("A wallet request is already pending.");
      if (address && !options?.forceVerify) return { address };
      setConnecting(true);
      setErrorMessage(null);
      const provider = getProvider(walletId);
      if (!provider) {
        throw new Error("Install or unlock an EVM wallet to connect to Somnia.");
      }
      const walletName = findWalletName(walletId, provider);
      setSelectedWalletName(walletName);

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
      const verifiedBody = await verified.json() as { address?: string; error?: string; supabaseAuth?: WalletSupabaseAuth };
      if (!verified.ok || !verifiedBody.address) throw new Error(verifiedBody.error ?? "Wallet signature verification failed.");

      window.localStorage.setItem(sessionKey, nextAddress);
      window.localStorage.setItem("arcpay-somnia-wallet-name", walletName);
      setAddress(nextAddress);
      return { address: nextAddress, supabaseAuth: verifiedBody.supabaseAuth };
    } catch (error) {
      const message = friendlyWalletError(error);
      setErrorMessage(message);
      console.warn("Somnia wallet connection failed.", message);
      throw new Error(message);
    } finally {
      setConnecting(false);
    }
  }, [address, connecting]);

  return {
    connectWallet,
    availableWallets,
    connected: Boolean(address),
    connecting,
    errorMessage,
    label: address ? short(address) : connecting ? "Connecting..." : "Connect wallet",
    publicKeyBase58: address,
    selectedWalletName: selectedWalletName ?? "Somnia EVM",
  };
}

const DEFAULT_WALLETS: WalletProviderOption[] = [
  { id: "browser", name: "Browser wallet", description: "MetaMask, Rabby, or another injected EVM wallet.", installed: false },
  { id: "metamask", name: "MetaMask", description: "Use MetaMask and switch/add Somnia Testnet.", installed: false },
  { id: "rabby", name: "Rabby", description: "Use Rabby and switch/add Somnia Testnet.", installed: false },
];

function getInjectedProviders(): EthereumProvider[] {
  if (typeof window === "undefined") return [];
  const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum;
  if (!ethereum) return [];
  return Array.isArray(ethereum.providers) ? ethereum.providers : [ethereum];
}

function detectWallets(): WalletProviderOption[] {
  const providers = getInjectedProviders();
  const metamask = providers.find((provider) => provider.isMetaMask && !provider.isRabby);
  const rabby = providers.find((provider) => provider.isRabby);
  const coinbase = providers.find((provider) => provider.isCoinbaseWallet);
  const browser = providers[0];
  const wallets: WalletProviderOption[] = [
    { id: "browser", name: browser ? "Detected EVM wallet" : "Browser wallet", description: "Use the currently injected EVM wallet.", installed: Boolean(browser), provider: browser },
    { id: "metamask", name: "MetaMask", description: "Switch or add Somnia Testnet inside MetaMask.", installed: Boolean(metamask), provider: metamask },
    { id: "rabby", name: "Rabby", description: "Switch or add Somnia Testnet inside Rabby.", installed: Boolean(rabby), provider: rabby },
  ];
  if (coinbase) wallets.push({ id: "coinbase", name: "Coinbase Wallet", description: "Use Coinbase Wallet with Somnia Testnet.", installed: true, provider: coinbase });
  return wallets;
}

function getProvider(walletId?: string): EthereumProvider | null {
  const wallets = detectWallets();
  const selected = wallets.find((wallet) => wallet.id === walletId && wallet.provider)?.provider;
  return selected ?? wallets.find((wallet) => wallet.provider)?.provider ?? null;
}

function findWalletName(walletId: string | undefined, provider: EthereumProvider) {
  const wallet = detectWallets().find((item) => item.id === walletId && item.provider === provider);
  if (wallet) return wallet.name;
  if (provider.isRabby) return "Rabby";
  if (provider.isMetaMask) return "MetaMask";
  if (provider.isCoinbaseWallet) return "Coinbase Wallet";
  return "Detected EVM wallet";
}

function short(value: string) {
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
