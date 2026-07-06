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
];

const removedExternalVenues = ["dreamDEX", "Somnia Exchange", "Somnex", "Potion Swap"].map((name) => ({
  name,
  state: "not-exposed-in-product",
  reason: "No direct ArcPay wallet-signed testnet execution path is exposed until route contracts/SDK details can produce tx proof.",
}));

export async function GET() {
  return NextResponse.json({
    ok: true,
    chain: "somnia-testnet",
    chainId: 50312,
    mode: "live-router-and-vault-only",
    boundary: "ArcPay exposes only routes that can quote, sign, confirm, and save Somnia Testnet tx proof today.",
    adapters,
    removedExternalVenues,
    developerTools: {
      http: "/api/developer/tools/somnia_defi_adapters",
      mcp: "somnia_defi_adapters",
      cli: "arcpay-somnia defi-adapters",
    },
    nextProofTarget: "Use /swaps for a live STT->SOMUSD router tx or /yield for a live STT vault tx.",
  });
}
