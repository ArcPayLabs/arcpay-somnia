# ArcPay Somnia Judge Demo Script

Target length: 2-3 minutes.

## One-Line Pitch

ArcPay is a private treasury OS for autonomous agents on Somnia: agents register services, get hired through escrowed orders, stay inside operator policy, receive SOMUSD card budgets, request risk decisions through Somnia's agent requester flow, and create privacy-intent payments with audit evidence.

## Demo Flow

1. Open the landing page.
   - Say: "This is fixed to Somnia Testnet, chain 50312, so every demo action is verifiable on the same network."

2. Connect wallet and enter the app.
   - Show wallet challenge signing.
   - Say: "Wallet login creates or resumes a Supabase-backed workspace. Email login is optional."

3. Open `/agents`.
   - Register a research or risk agent.
   - Say: "Agents are first-class services with endpoints, capabilities, and STT pricing."

4. Open `/policies`.
   - Set hourly, daily, weekly limits.
   - Enable allowlist and add the agent.
   - Say: "The order book cannot bypass this contract. Policy is enforced before escrow."

5. Open `/orders`.
   - Create an order, load it, then move it through the lifecycle if the wallet owns the provider.
   - Say: "This is the Cards402-style state machine: pending, accepted, processing, fulfilled, settled, refunded, failed."

6. Show the x402 server path.
   - Run or mention `npm run smoke:x402`.
   - Say: "The agent endpoint returns HTTP 402 with exact Somnia payment requirements. A requester pays through the order book, the provider fulfills, and the same endpoint unlocks only after on-chain verification."

7. Open `/oracle`.
   - Show the live platform quote.
   - Request risk and run demo fulfillment.
   - Say: "This calls the Somnia agent requester interface: platform deposit plus configured agent budget, then callback evidence."

8. Open `/cards`.
   - Create a SOMUSD card and top it up.
   - Say: "Operators can give agents spend budgets without giving them unrestricted treasury access."

9. Open `/privacy`.
   - Create a native privacy intent.
   - Release it with a nullifier.
   - Say: "Somnia does not ship a native privacy layer yet, so ArcPay adds a builder-usable privacy-intent primitive: commitment, encrypted memo URI, delayed recipient release, and nullifier protection."

10. Open `/operator`, `/audit`, and `/proofs`.
   - Show claim-code onboarding, webhook circuit breaker, local records, contract addresses, and smoke commands.
   - Say: "This is not just a UI. It has contracts, MCP, CLI, Azure worker, tests, live smoke scripts, and judge-facing proofs."

## Close

"ArcPay turns Somnia's agentic L1 into an operating account for AI businesses: discover agents, hire them, enforce policy, manage spend, preserve private context, and prove every step."

## Verification Commands

```bash
npm run build:frontend
npm test
npm run check:worker
npm run check:x402
npm run smoke:auth
npm run smoke:live
npm run smoke:x402
```

`npm run smoke:live` spends small Somnia testnet amounts and verifies registry writes, policy, escrowed order lifecycle, operator controls, SOMUSD cards, privacy release, and risk oracle fulfillment.

`npm run smoke:x402` starts the x402 server and verifies a full HTTP 402 quote, on-chain escrow payment, provider fulfillment, resource unlock, and settlement.
