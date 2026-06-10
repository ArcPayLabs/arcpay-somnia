"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, CheckCircle2, Copy, ExternalLink, KeyRound, Network, RefreshCw, ShieldCheck, Wallet, WalletCards } from "lucide-react";
import { Contract } from "ethers";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/primitives/StatCard";
import { useWalletConnectAction } from "@/hooks/use-wallet-connect-action";
import {
  ERC20_ABI,
  SOMNIA_CHAIN_ID,
  SOMNIA_EXPLORER_URL,
  SOMNIA_RPC_URL,
  SOMUSD_TOKEN_ADDRESS,
  addressUrl,
  balances,
  connectedAddress,
  currentConnectedAddress,
  fromUnits,
  publicProvider,
  shortAddress,
  switchToSomnia,
} from "@somnia/lib/somnia";

export const Route = { options: { component: WalletRoute } };

function WalletRoute() {
  const wallet = useWalletConnectAction();
  const [address, setAddress] = useState("");
  const [sttBalance, setSttBalance] = useState("");
  const [somusdBalance, setSomusdBalance] = useState("");
  const [message, setMessage] = useState("Choose a wallet, add or switch to Somnia Testnet, then sign once to open the operator workspace.");
  const [loading, setLoading] = useState(false);

  const explorer = useMemo(() => address ? addressUrl(address) : SOMNIA_EXPLORER_URL, [address]);

  async function loadBalances(nextAddress: string) {
    setSttBalance(await balances(nextAddress));
    try {
      const token = new Contract(SOMUSD_TOKEN_ADDRESS, ERC20_ABI, publicProvider());
      const raw = await (token as unknown as { balanceOf: (owner: string) => Promise<bigint> }).balanceOf(nextAddress);
      setSomusdBalance(fromUnits(raw, 6));
    } catch {
      setSomusdBalance("0");
    }
  }

  async function connect(walletId?: string) {
    setLoading(true);
    try {
      setMessage("Opening wallet and switching to Somnia Testnet...");
      const result = await wallet.connectWallet(walletId);
      setAddress(result.address);
      await loadBalances(result.address);
      window.localStorage.setItem("arcpay-somnia-wallet-session", result.address);
      window.dispatchEvent(new StorageEvent("storage", { key: "arcpay-somnia-wallet-session" }));
      setMessage("Wallet linked. This signer can now approve agent orders, cards, invoices, privacy intents, policies, and audit actions.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Wallet connection failed.");
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setLoading(true);
    try {
      await switchToSomnia();
      const next = await connectedAddress();
      setAddress(next);
      await loadBalances(next);
      setMessage("Wallet, network, and balances refreshed from Somnia Testnet.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to refresh wallet state.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    currentConnectedAddress()
      .then(async (next) => {
        if (!next) return;
        setAddress(next);
        await loadBalances(next);
        setMessage("Existing Somnia wallet session detected.");
      })
      .catch(() => undefined);
  }, []);

  const actions = [
    { title: "Register an agent", href: "/agents", body: "Create or update an agent slug, endpoint, capabilities, and paid x402 resource." },
    { title: "Create an order", href: "/orders", body: "Escrow STT against an agent service and capture the order ID plus tx hash." },
    { title: "Issue a SOMUSD card", href: "/cards", body: "Create, top up, freeze, activate, and audit bounded agent spending." },
    { title: "Create privacy intent", href: "/privacy", body: "Commit funds or disclosure evidence before releasing a selective proof." },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wallet}
        eyebrow="Wallet console"
        title="Somnia signing control"
        description="Connect MetaMask, Rabby, or any injected EVM wallet, switch to Somnia Testnet, review live STT/SOMUSD balances, and jump directly into signed agent treasury actions."
        actions={
          <a href={explorer} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
            View on explorer <ExternalLink className="h-4 w-4" />
          </a>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard icon={Wallet} label="Signer" value={address ? shortAddress(address) : "--"} hint={wallet.selectedWalletName ?? "No wallet connected"} />
        <StatCard icon={Network} label="Network" value={`${SOMNIA_CHAIN_ID}`} hint="Somnia Testnet" />
        <StatCard icon={BadgeCheck} label="STT balance" value={address ? `${Number(sttBalance || 0).toFixed(4)} STT` : "--"} hint="Native gas and treasury token" />
        <StatCard icon={WalletCards} label="SOMUSD" value={address ? `${Number(somusdBalance || 0).toFixed(2)} SOMUSD` : "--"} hint="Agent spend card token" emphasis />
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current signer</div>
              <h2 className="mt-2 break-all text-2xl font-semibold tracking-tight md:text-3xl">{address || "No wallet connected"}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{message}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-3 py-1.5">RPC: {SOMNIA_RPC_URL.replace("https://", "")}</span>
                <span className="rounded-full border border-border px-3 py-1.5">Explorer: socialscan</span>
                <span className="rounded-full border border-border px-3 py-1.5">Chain ID: {SOMNIA_CHAIN_ID}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
              <button onClick={() => void refresh()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted disabled:opacity-60">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
              <button onClick={() => address && navigator.clipboard.writeText(address)} disabled={!address} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted disabled:opacity-40">
                <Copy className="h-4 w-4" /> Copy address
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-background p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-primary/10 p-3 text-primary"><KeyRound className="h-5 w-5" /></span>
            <div>
              <h3 className="font-semibold">Choose wallet</h3>
              <p className="text-sm text-muted-foreground">ArcPay prompts for Somnia Testnet before any signed action.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {wallet.availableWallets.map((option) => (
              <button
                key={option.id}
                onClick={() => void connect(option.id)}
                disabled={!option.installed || loading || wallet.connecting}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  <span className="block text-sm font-semibold">{option.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{option.description}</span>
                </span>
                {option.installed ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <span className="text-xs font-semibold text-muted-foreground">Not detected</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-primary/10 p-3 text-primary"><ShieldCheck className="h-5 w-5" /></span>
          <div>
            <h3 className="text-xl font-semibold">What this wallet can sign</h3>
            <p className="text-sm text-muted-foreground">Every money-moving flow still requires explicit wallet approval unless the workspace policy blocks it first.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {actions.map((item) => (
            <a key={item.href} href={item.href} className="group rounded-3xl border border-border bg-background p-5 transition hover:border-primary/50">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold">{item.title}</h4>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
