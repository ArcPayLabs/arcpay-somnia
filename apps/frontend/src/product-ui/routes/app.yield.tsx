"use client";

import { useEffect, useMemo, useState } from "react";
import { Contract, parseEther } from "ethers";
import { Bot, CheckCircle2, Coins, ExternalLink, Loader2, ShieldCheck, TrendingUp, WalletCards, Workflow } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { ReviewModal } from "@/components/primitives/ReviewModal";
import { StatCard } from "@/components/primitives/StatCard";
import { checkActionPolicies } from "@/lib/policy";
import {
  SOMNIA_YIELD_APY_BPS,
  SOMNIA_YIELD_VAULT_ABI,
  SOMNIA_YIELD_VAULT_ADDRESS,
  addressUrl,
  connectedAddress,
  currentConnectedAddress,
  fromWei,
  publicProvider,
  shortAddress,
  txUrl,
  writeRecord,
  yieldVaultContract,
} from "@somnia/lib/somnia";

export const Route = { options: { component: YieldRoute } };

const STRATEGIES = [
  { id: "arcpay-vault", name: "ArcPay STT yield vault", asset: "STT", live: true, risk: "Live testnet vault deposit/withdraw with tx hash proof." },
  { id: "dreamdex-maker", name: "dreamDEX maker yield", asset: "SOMUSD", live: false, risk: "CLOB maker inventory, price drift, cancellation discipline." },
  { id: "somnia-exchange-lp", name: "Somnia Exchange LP", asset: "STT/SOMUSD", live: false, risk: "Pool depth, impermanent loss, router evidence." },
  { id: "somnex", name: "Somnex liquidity strategy", asset: "STT", live: false, risk: "Venue liquidity and position risk evidence." },
  { id: "potion", name: "Potion Swap LP", asset: "testnet pair", live: false, risk: "Experimental pool/router addresses required." },
] as const;

function YieldRoute() {
  const [strategy, setStrategy] = useState<(typeof STRATEGIES)[number]["id"]>("arcpay-vault");
  const [amount, setAmount] = useState("0.01");
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [message, setMessage] = useState("ArcPay STT yield vault is live. Deposits and withdrawals open the wallet and produce Somnia tx proof.");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [vaultBalance, setVaultBalance] = useState<bigint>(0n);
  const [totalDeposits, setTotalDeposits] = useState<bigint>(0n);
  const [apyBps, setApyBps] = useState(BigInt(SOMNIA_YIELD_APY_BPS));

  const active = STRATEGIES.find((item) => item.id === strategy) ?? STRATEGIES[0];
  const num = Number.parseFloat(amount) || 0;
  const projectedDay = num * (Number(apyBps) / 10000) / 365;

  async function refreshVault() {
    try {
      const address = await currentConnectedAddress().catch(() => "");
      const vault = new Contract(SOMNIA_YIELD_VAULT_ADDRESS, SOMNIA_YIELD_VAULT_ABI, publicProvider());
      const [total, apy, balance] = await Promise.all([
        (vault as unknown as { totalDeposits: () => Promise<bigint> }).totalDeposits(),
        (vault as unknown as { apyBps: () => Promise<bigint> }).apyBps(),
        address ? (vault as unknown as { balances: (account: string) => Promise<bigint> }).balances(address) : Promise.resolve(0n),
      ]);
      setTotalDeposits(total);
      setApyBps(apy);
      setVaultBalance(balance);
    } catch {
      // Keep previous state; status page covers RPC health.
    }
  }

  useEffect(() => {
    void refreshVault();
  }, []);

  async function signYieldAction() {
    if (!active.live) {
      const text = `${active.name} needs public router/pool details before direct live signing. Use ArcPay STT yield vault for executable proof now.`;
      setMessage(text);
      throw new Error(text);
    }
    if (num <= 0) {
      setMessage("Enter an amount greater than zero.");
      throw new Error("Enter an amount greater than zero.");
    }

    const signer = await connectedAddress();
    const blockReason = checkActionPolicies({
      action: mode === "deposit" ? "Yield deposit" : "Yield withdraw",
      network: "somnia",
      token: "STT",
      amount: num,
      walletConnected: Boolean(signer),
    });
    if (blockReason) {
      setMessage(blockReason);
      throw new Error(blockReason);
    }

    setLoading(true);
    try {
      const vault = await yieldVaultContract();
      const value = parseEther(amount);
      const tx = mode === "deposit"
        ? await (vault as unknown as { depositNative: (strategy: string, options: { value: bigint }) => Promise<{ hash: string; wait: () => Promise<unknown> }> }).depositNative(active.name, { value })
        : await (vault as unknown as { withdrawNative: (amount: bigint) => Promise<{ hash: string; wait: () => Promise<unknown> }> }).withdrawNative(value);
      setTxHash(tx.hash);
      setMessage(`${mode === "deposit" ? "Deposit" : "Withdrawal"} submitted: ${shortAddress(tx.hash)}`);
      await tx.wait();
      writeRecord({
        id: tx.hash,
        type: "tx",
        title: `${mode === "deposit" ? "Yield deposit" : "Yield withdrawal"} ${amount} STT`,
        amount: `${amount} STT`,
        status: mode === "deposit" ? "yield_deposit_confirmed" : "yield_withdraw_confirmed",
        txHash: tx.hash,
      });
      await refreshVault();
      setMessage(`${mode === "deposit" ? "Deposit" : "Withdrawal"} confirmed on Somnia: ${shortAddress(tx.hash)}`);
    } finally {
      setLoading(false);
    }
  }

  const rows = useMemo(() => [
    { label: "Action", value: mode === "deposit" ? "Deposit" : "Withdraw" },
    { label: "Strategy", value: active.name },
    { label: "Amount", value: `${amount} STT`, mono: true },
    { label: "Vault APY", value: `${(Number(apyBps) / 100).toFixed(2)}%` },
    { label: "Vault", value: shortAddress(SOMNIA_YIELD_VAULT_ADDRESS), mono: true },
    { label: "Projected/day", value: `${projectedDay.toFixed(6)} STT`, mono: true },
  ], [active.name, amount, apyBps, mode, projectedDay]);

  return (
    <div>
      <PageHeader
        icon={TrendingUp}
        eyebrow="Treasury execution"
        title="Yield"
        description="Deposit or withdraw STT through a live ArcPay Somnia yield vault, while keeping external venue strategies as evidence-gated adapters."
        actions={
          <a href={addressUrl(SOMNIA_YIELD_VAULT_ADDRESS)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
            Vault <ExternalLink className="h-4 w-4" />
          </a>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard icon={Coins} label="Your vault balance" value={`${Number(fromWei(vaultBalance)).toFixed(4)} STT`} hint="Live contract read" />
        <StatCard icon={TrendingUp} label="Total deposits" value={`${Number(fromWei(totalDeposits)).toFixed(4)} STT`} hint="Live vault TVL" />
        <StatCard icon={ShieldCheck} label="APY" value={`${(Number(apyBps) / 100).toFixed(2)}%`} hint="Vault parameter" />
        <StatCard icon={WalletCards} label="Tx proof" value={txHash ? shortAddress(txHash) : "--"} hint="Explorer-verifiable" emphasis />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <section className="rounded-3xl border border-border bg-card p-6 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Provider status</div>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">Live STT vault</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                This is a real Somnia Testnet vault. Deposits and withdrawals require wallet approval and produce a tx hash.
              </p>
            </div>
            <button onClick={() => void refreshVault()} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Refresh</button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Strategy</span>
              <select value={strategy} onChange={(event) => setStrategy(event.target.value as typeof strategy)} className="mt-1.5 h-12 w-full rounded-xl border border-border bg-background px-3">
                {STRATEGIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Amount</span>
              <input value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1.5 h-12 w-full rounded-xl border border-border bg-background px-3 text-2xl font-semibold" />
            </label>
          </div>

          <div className="mt-4 inline-flex rounded-full bg-muted p-1">
            {(["deposit", "withdraw"] as const).map((item) => (
              <button key={item} onClick={() => setMode(item)} className={`rounded-full px-5 py-2 text-sm font-semibold capitalize ${mode === item ? "bg-foreground text-background" : "text-muted-foreground"}`}>
                {item}
              </button>
            ))}
          </div>

          <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${message.toLowerCase().includes("needs public") ? "border-warning/30 bg-warning/10 text-warning-foreground" : "border-border bg-muted/40 text-muted-foreground"}`}>
            <span className="inline-flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {message}
            </span>
            {txHash && (
              <a href={txUrl(txHash)} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 font-mono text-xs text-primary">
                Verify tx: {txHash} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <button onClick={() => setReviewOpen(true)} className="mt-5 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:brightness-110">
            Review {mode}
          </button>
        </section>

        <aside className="space-y-3 lg:col-span-2">
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Workflow className="h-4 w-4" /> Strategy adapters
            </div>
            <div className="mt-4 space-y-2">
              {STRATEGIES.map((item) => (
                <article key={item.id} className={`rounded-2xl border p-4 ${item.id === strategy ? "border-primary bg-primary/5" : "border-border bg-muted/20"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.live ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.risk}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-surface-dark p-5 text-surface-dark-foreground">
            <div className="text-xs uppercase tracking-wider text-white/50">Completion bar</div>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              <div>1. Strategy selected</div>
              <div>2. Policy checked</div>
              <div>3. Wallet signed</div>
              <div>4. Tx hash recorded</div>
              <div>5. Vault balance refreshed</div>
            </div>
          </div>
        </aside>
      </div>

      <ReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        title={`Review ${mode}`}
        description={active.name}
        rows={rows}
        warnings={[
          active.live ? "Your wallet will sign a real Somnia Testnet vault transaction." : "This external strategy is adapter-ready but not directly executable until router/pool details are provided.",
          "ArcPay only marks yield complete when a tx hash and refreshed vault state exist.",
        ]}
        confirmLabel={active.live ? `Sign ${mode}` : "Adapter only"}
        onConfirm={signYieldAction}
      />
    </div>
  );
}
