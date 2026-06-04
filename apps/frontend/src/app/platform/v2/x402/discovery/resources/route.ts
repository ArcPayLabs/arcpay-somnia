import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    x402Version: "1",
    protocol: "x402",
    network: "somnia-testnet",
    chainId: 50312,
    resources: [
      {
        name: "ArcPay Somnia treasury-router work",
        description: "Paid Somnia agent work protected by ArcPay x402, STT escrow, policy, and audit evidence.",
        resourceUrl: "https://x402.20.208.46.195.nip.io/agent/treasury-router/work",
        paymentRequirementsUrl: "https://x402.20.208.46.195.nip.io/x402/payment-requirements/treasury-router",
        verificationUrl: "https://x402.20.208.46.195.nip.io/x402/verify",
        method: "GET",
        asset: "STT",
        amount: "0.01",
        payTo: "0x6A07886d465Bd64ED3264F4e824C1dF2884a7B45",
        settlement: "AgentOrderBook.createOrder(agentId, requestUri)",
        evidence: ["HTTP 402 response", "AgentOrderBook order id", "Somnia tx hash", "x402 verification response"],
      },
    ],
  });
}
