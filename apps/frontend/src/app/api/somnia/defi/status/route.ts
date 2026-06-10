import { NextResponse } from "next/server";
import deployment from "../../../../../../../../deployments/somnia-testnet.json";

const adapters = [
  {
    name: "ArcPay Testnet Router",
    category: "live-swap-router",
    state: "live",
    execution: "wallet-signed swapExactNativeForToken on Somnia Testnet",
    contract: (deployment as { contracts: Record<string, string> }).contracts.SomniaSwapRouter,
    token: (deployment as { defi?: { swapToken?: string } }).defi?.swapToken,
    evidence: ["router quote", "wallet signature", "Somnia tx hash", "before/after STT and SOMUSD balances"],
  },
  {
    name: "ArcPay STT Yield Vault",
    category: "live-yield-vault",
    state: "live",
    execution: "wallet-signed depositNative / withdrawNative on Somnia Testnet",
    contract: (deployment as { contracts: Record<string, string> }).contracts.SomniaYieldVault,
    evidence: ["policy check", "wallet signature", "Somnia tx hash", "vault balance refresh"],
  },
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
    mode: "live-router-plus-policy-bound-adapters",
    boundary: "ArcPay Testnet Router and ArcPay STT Yield Vault are live wallet-signed routes. External venue adapters require a real Somnia transaction hash or venue response before completion.",
    adapters,
    developerTools: {
      http: "/api/developer/tools/somnia_defi_adapters",
      mcp: "somnia_defi_adapters",
      cli: "arcpay-somnia defi-adapters",
    },
    nextProofTarget: "Use /swaps for a live STT->SOMUSD router tx or /yield for a live STT vault tx. External venues still require router/pool evidence before direct execution.",
  });
}
