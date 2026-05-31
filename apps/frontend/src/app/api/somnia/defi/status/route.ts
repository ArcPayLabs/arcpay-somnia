import { NextResponse } from "next/server";

const adapters = [
  {
    name: "Somnia Exchange",
    category: "native-swap",
    state: "evidence-gated",
    execution: "wallet-signed route execution",
    url: "https://somnia.exchange",
    docs: "https://docs.somnia.network/developer/tutorials/build-a-dex-on-somnia",
    evidence: ["quote", "wallet simulation", "transaction hash", "before/after balance"],
  },
  {
    name: "Somnex",
    category: "aggregator-liquidity-perps",
    state: "evidence-gated",
    execution: "agent-prepared route or strategy intent",
    url: "https://somnex.xyz",
    evidence: ["venue quote", "position/risk summary", "transaction hash", "risk snapshot"],
  },
  {
    name: "Potion Swap",
    category: "testnet-dex",
    state: "evidence-gated",
    execution: "manual signer or agent handoff",
    url: "https://potion-swap.xyz",
    docs: "https://docs.uprisinglabs.io/games-and-products/potion-swap-dex",
    evidence: ["quote screenshot", "pool route", "transaction hash"],
  },
  {
    name: "Custom Somnia DEX adapter",
    category: "builder-router",
    state: "buildable",
    execution: "contract adapter based on Somnia DEX tutorial",
    docs: "https://docs.somnia.network/developer/tutorials/build-a-dex-on-somnia",
    evidence: ["adapter address", "quote response", "fill transaction hash"],
  },
];

export async function GET() {
  return NextResponse.json({
    ok: true,
    chain: "somnia-testnet",
    chainId: 50312,
    mode: "policy-bound-defi-adapters",
    boundary: "ArcPay records and enforces DeFi intents. Completion requires a real Somnia transaction hash or venue response.",
    adapters,
    developerTools: {
      http: "/api/developer/tools/somnia_defi_adapters",
      mcp: "somnia_defi_adapters",
      cli: "arcpay-somnia defi-adapters",
    },
    nextProofTarget: "Attach a live Somnia DEX quote and tx hash to an ArcPay audit record from /swaps or /yield.",
  });
}
