import { NextResponse } from "next/server";

const adapters = [
  {
    name: "dreamDEX CLOB",
    category: "onchain-clob",
    state: "docs-live",
    execution: "REST/CLI market discovery plus wallet-signed Somnia transaction",
    url: "https://docs.dreamdex.io/ld25g222WKDrLlJMcR41",
    apiDocs: "https://docs.dreamdex.io/ld25g222WKDrLlJMcR41/developers/http-api.md",
    contractDocs: "https://docs.dreamdex.io/ld25g222WKDrLlJMcR41/developers/contracts.md",
    tradingDocs: "https://docs.dreamdex.io/ld25g222WKDrLlJMcR41/trading/trading.md",
    testnetPools: {
      "SOMI/USDso": "0x259fD6559214dd5aD3752322426eA9F9fABEFff4",
      "WBTC/USDso": "0x3605f28aA7C50e7441211e77Cb0762d49539326C",
      "WETH/USDso": "0xD180195da5459C7a0DEA188ed61216ec43682b50",
    },
    evidence: ["market quote", "pool address", "signed order transaction hash", "order/fill status", "before/after balance"],
  },
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
    boundary: "ArcPay records and enforces DeFi intents. Completion requires a real Somnia transaction hash or venue response. dreamDEX HTTP API responses are quote/build evidence, not completion evidence without a signed tx.",
    adapters,
    developerTools: {
      http: "/api/developer/tools/somnia_defi_adapters",
      mcp: "somnia_defi_adapters",
      cli: "arcpay-somnia defi-adapters",
    },
    nextProofTarget: "Attach a dreamDEX market quote, pool address, signed order tx hash, and fill/order status to an ArcPay audit record from /swaps or /yield.",
  });
}
