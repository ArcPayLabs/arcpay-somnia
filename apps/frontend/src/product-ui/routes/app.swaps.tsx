"use client";

import { useEffect, useMemo, useState } from "react";
import { Contract, parseEther } from "ethers";
import { ArrowLeftRight, ChevronDown, CheckCircle2, ExternalLink, Info, Loader2, Route as RouteIcon, ShieldCheck, Zap } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { ReviewModal } from "@/components/primitives/ReviewModal";
import { StatCard } from "@/components/primitives/StatCard";
import { checkActionPolicies } from "@/lib/policy";
import {
  SOMNIA_SWAP_ROUTER_ABI,
  SOMNIA_SWAP_ROUTER_ADDRESS,
  SOMNIA_SWAP_TOKEN_ADDRESS,
  addressUrl,
  connectedAddress,
  currentConnectedAddress,
  fromUnits,
  fromWei,
  publicProvider,
  shortAddress,
  swapRouterContract,
  txUrl,
  writeRecord,
} from "@somnia/lib/somnia";

export const Route = { options: { component: SwapsRoute } };

const TOKENS = ["STT", "SOMUSD"] as const;
const VENUES = [
  { id: "arcpay", label: "ArcPay Testnet Router", note: "Live Somnia contract. Signs and returns a real tx hash." },
  { id: "dreamdex", label: "dreamDEX", note: "Adapter-ready CLOB route. Requires public router/SDK endpoint before direct signing." },
  { id: "somnia-exchange", label: "Somnia Exchange", note: "Native venue proof path. Attach route tx when venue exposes router data." },
  { id: "somnex", label: "Somnex", note: "Aggregator/perps evidence route for treasury agents." },
  { id: "potion", label: "Potion Swap", note: "Uniswap-style pool route when pool/router addresses are provided." },
] as const;

type Token = typeof TOKENS[number];

type QuoteState = {
  tokenOut: bigint;
  minOut: bigint;
  recipient: string;
  venue: string;
};

function SwapsRoute() {
  const [from, setFrom] = useState<Token>("STT");
  const [to, setTo] = useState<Token>("SOMUSD");
  const [amount, setAmount] = useState("0.01");
  const [slippage, setSlippage] = useState("0.5");
  const [venue, setVenue] = useState<(typeof VENUES)[number]["id"]>("arcpay");
  const [quote, setQuote] = useState<QuoteState | null>(null);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [message, setMessage] = useState("Get a live Somnia quote before signing. ArcPay testnet router is fully executable.");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [txHash, setTxHash] = useState("");

  const num = Number.parseFloat(amount) || 0;
  const slippageBps = Math.max(0, Math.round((Number.parseFloat(slippage) || 0) * 100));
  const activeVenue = VENUES.find((item) => item.id === venue) ?? VENUES[0];
  const executable = venue === "arcpay" && from === "STT" && to === "SOMUSD";

  useEffect(() => {
    setQuote(null);
    setQuoteStatus("idle");
    setTxHash("");
    setMessage(executable ? "Get a live Somnia quote before signing." : "This venue is adapter-ready. Use ArcPay Testnet Router for a live signed swap today.");
  }, [amount, executable, from, slippage, to, venue]);

  async function requestQuote() {
    if (!executable) {
      setQuoteStatus("error");
      setMessage("Direct signing is available through ArcPay Testnet Router. This external venue needs router/SDK details before live execution.");
      return;
    }
    if (num <= 0) {
      setQuoteStatus("error");
      setMessage("Enter an amount greater than zero.");
      return;
    }

    const blockReason = checkActionPolicies({
      action: "Swap",
      network: "somnia",
      token: from,
      amount: num,
      walletConnected: true,
      requireWallet: false,
    });
    if (blockReason) {
      setQuoteStatus("error");
      setMessage(blockReason);
      return;
    }

    setQuoteStatus("loading");
    setMessage("Reading live router quote from Somnia Testnet...");
    try {
      const router = new Contract(SOMNIA_SWAP_ROUTER_ADDRESS, SOMNIA_SWAP_ROUTER_ABI, publicProvider());
      const nativeIn = parseEther(amount);
      const tokenOut = await (router as unknown as { quoteNativeToToken: (nativeIn: bigint) => Promise<bigint> }).quoteNativeToToken(nativeIn);
      const minOut = tokenOut - ((tokenOut * BigInt(slippageBps)) / 10000n);
      const recipient = await currentConnectedAddress().catch(() => "");
      setQuote({ tokenOut, minOut, recipient, venue: activeVenue.label });
      setQuoteStatus("ready");
      setMessage("Live quote loaded. Review will open the wallet and sign a real Somnia transaction.");
    } catch (error) {
      setQuoteStatus("error");
      setMessage(error instanceof Error ? error.message : "Quote failed.");
    }
  }

  async function signSwap() {
    if (!quote) throw new Error("Quote first.");
    const signer = await connectedAddress();
    const blockReason = checkActionPolicies({
      action: "Swap",
      network: "somnia",
      token: from,
      amount: num,
      walletConnected: Boolean(signer),
    });
    if (blockReason) {
      setMessage(blockReason);
      throw new Error(blockReason);
    }

    const router = await swapRouterContract();
    const tx = await (router as unknown as {
      swapExactNativeForToken: (minOut: bigint, recipient: string, venue: string, options: { value: bigint }) => Promise<{ hash: string; wait: () => Promise<unknown> }>;
    }).swapExactNativeForToken(quote.minOut, signer, quote.venue, { value: parseEther(amount) });
    setTxHash(tx.hash);
    setMessage(`Swap submitted. Waiting for Somnia confirmation: ${shortAddress(tx.hash)}`);
    await tx.wait();
    writeRecord({
      id: tx.hash,
      type: "tx",
      title: `Swap ${amount} STT to ${fromUnits(quote.tokenOut, 6)} SOMUSD`,
      amount: `${amount} STT`,
      status: "swap_confirmed",
      txHash: tx.hash,
    });
    setMessage(`Swap confirmed on Somnia Testnet: ${shortAddress(tx.hash)}`);
  }

  const rows = useMemo(() => quote ? [
    { label: "You pay", value: `${amount} STT`, mono: true },
    { label: "Expected out", value: `${fromUnits(quote.tokenOut, 6)} SOMUSD`, mono: true },
    { label: "Minimum out", value: `${fromUnits(quote.minOut, 6)} SOMUSD`, mono: true },
    { label: "Venue", value: quote.venue },
    { label: "Router", value: shortAddress(SOMNIA_SWAP_ROUTER_ADDRESS), mono: true },
    { label: "Recipient", value: quote.recipient ? shortAddress(quote.recipient) : "Connected signer", mono: true },
  ] : [], [amount, quote]);

  return (
    <div>
      <PageHeader
        icon={ArrowLeftRight}
        eyebrow="Treasury execution"
        title="Swaps"
        description="Get a live Somnia router quote, review policy, sign in wallet, and capture a tx hash before ArcPay marks the swap complete."
        actions={
          <a href={addressUrl(SOMNIA_SWAP_ROUTER_ADDRESS)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
            Router <ExternalLink className="h-4 w-4" />
          </a>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard icon={RouteIcon} label="Executable route" value="STT -> SOMUSD" hint="ArcPay router" />
        <StatCard icon={ShieldCheck} label="Policy" value="Before signing" hint="Limits and pause checked" />
        <StatCard icon={Zap} label="Quote" value={quote ? `${fromUnits(quote.tokenOut, 6)} SOMUSD` : "--"} hint="On-chain router read" />
        <StatCard icon={CheckCircle2} label="Tx proof" value={txHash ? shortAddress(txHash) : "--"} hint="Explorer-verifiable" emphasis />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <section className="rounded-3xl border border-border bg-card p-6 lg:col-span-3">
          <div className="space-y-3">
            <SwapBox label="You pay" amount={amount} onAmount={setAmount} token={from} onToken={setFrom} subcopy="Wallet signs native STT input" />
            <div className="relative z-10 -my-3 flex justify-center">
              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                <ArrowLeftRight className="h-4 w-4 rotate-90" />
              </button>
            </div>
            <SwapBox label="You receive" amount={quote ? fromUnits(quote.tokenOut, 6) : "--"} token={to} onToken={setTo} subcopy="SOMUSD from funded router liquidity" readOnly />
            <div className="grid gap-3 pt-2 md:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Venue</span>
                <select value={venue} onChange={(event) => setVenue(event.target.value as typeof venue)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3">
                  {VENUES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Max slippage</span>
                <input value={slippage} onChange={(event) => setSlippage(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3" />
              </label>
            </div>
          </div>

          <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${quoteStatus === "error" ? "border-destructive/25 bg-destructive/10 text-destructive" : "border-border bg-muted/40 text-muted-foreground"}`}>
            <span className="inline-flex items-center gap-2">
              {quoteStatus === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              {message}
            </span>
            {txHash && (
              <a href={txUrl(txHash)} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 font-mono text-xs text-primary">
                Verify tx: {txHash} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button onClick={() => void requestQuote()} className="rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:brightness-110">
              {quoteStatus === "loading" ? "Quoting..." : "Get live quote"}
            </button>
            <button disabled={!quote} onClick={() => setReviewOpen(true)} className="rounded-full bg-foreground py-3 font-semibold text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
              Review and sign
            </button>
          </div>
        </section>

        <aside className="space-y-3 lg:col-span-2">
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Routes</div>
            <div className="space-y-2">
              {VENUES.map((item) => (
                <div key={item.id} className={`rounded-2xl border p-3 ${item.id === venue ? "border-primary bg-primary/5" : "border-border bg-muted/20"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold">{item.label}</div>
                    {item.id === "arcpay" ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Info className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-surface-dark p-5 text-surface-dark-foreground">
            <div className="text-xs uppercase tracking-wider text-white/50">Proof required</div>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              <div>1. Router quote</div>
              <div>2. Wallet signature</div>
              <div>3. Somnia tx hash</div>
              <div>4. Final SOMUSD balance</div>
            </div>
          </div>
        </aside>
      </div>

      <ReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        title="Review Somnia swap"
        description="ArcPay Testnet Router"
        rows={rows}
        warnings={[
          "Your wallet will sign a real Somnia Testnet transaction.",
          "ArcPay records completion only after the transaction confirms and a tx hash exists.",
        ]}
        confirmLabel="Sign swap"
        onConfirm={signSwap}
      />
    </div>
  );
}

function SwapBox({ label, amount, onAmount, token, onToken, subcopy, readOnly }: {
  label: string;
  amount: string;
  onAmount?: (value: string) => void;
  token: Token;
  onToken: (value: Token) => void;
  subcopy: string;
  readOnly?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-muted/60 p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{subcopy}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {readOnly ? (
          <div className="min-w-0 flex-1 text-3xl font-semibold tracking-tight">{amount}</div>
        ) : (
          <input value={amount} onChange={(event) => onAmount?.(event.target.value)} className="min-w-0 flex-1 bg-transparent text-3xl font-semibold tracking-tight outline-none" />
        )}
        <div className="relative">
          <select value={token} onChange={(event) => onToken(event.target.value as Token)} className="cursor-pointer appearance-none rounded-full bg-foreground py-2 pl-4 pr-9 text-sm font-semibold text-background outline-none">
            {TOKENS.map((item) => <option key={item}>{item}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-background" />
        </div>
      </div>
    </div>
  );
}
