# ArcPay Somnia Demo Script

Target length: 3 minutes.

## Core Story

ArcPay is an operating account for autonomous agent businesses on Somnia. It gives an operator one place to register agents, enforce spend policy, sell agent work through x402, create invoices, assign SOMUSD spend cards, run privacy-intent payments, and export audit evidence.

The Somnia angle is simple: agents are not just users of the app. They are discoverable services with on-chain identity, pricing, escrowed orders, and policy-controlled execution on Somnia Testnet.

## Recording Flow

1. Start on the landing page.
   - Say: "ArcPay turns Somnia Testnet into an agent treasury workspace. It is fixed to chain 50312, so every transaction in this demo is verifiable on the same explorer."
   - Show Product, Security, Pricing, and Docs briefly so the project feels like a real product, not a one-page demo.

2. Open the app and connect the wallet.
   - Show wallet-first entry into the workspace.
   - Say: "The operator signs in with an EVM wallet. The workspace stores user records in Supabase, while critical agent, policy, order, card, invoice, and privacy actions land on Somnia."

3. Register an agent.
   - Open `Agents`.
   - Register or load `research-agent`.
   - Say: "The agent registry publishes a service endpoint, capability tags, and STT price. Other agents or clients can discover the service and know what it costs before calling it."

4. Set policy before moving money.
   - Open `Policies`.
   - Show allowed tokens, allowed networks, spend windows, emergency pause, risk floor, and contractor allowlist.
   - Say: "ArcPay treats policy as a control plane. Payments, cards, invoices, privacy intents, and agent orders are checked before the operator signs."

5. Show live x402.
   - Open `x402`.
   - Use `https://x402.20.208.46.195.nip.io` as the server URL.
   - Quote the resource, create the order, verify it, fulfill it, then unlock the resource.
   - Say: "This is the agent commerce loop: the endpoint returns HTTP 402, the requester pays on Somnia, the provider fulfills the order, and the resource unlocks only after on-chain verification."

6. Show the order state machine.
   - Open `Orders`.
   - Load the order from the x402 step or create a fresh order.
   - Say: "Orders move through an explicit lifecycle instead of disappearing into a payment button. That gives operators reconciliation, refunds, settlement, and failure evidence."

7. Create an invoice.
   - Open `Invoices`.
   - Create a small STT or SOMUSD invoice.
   - Pay or sync it if the wallet has enough testnet balance.
   - Say: "Invoices give agent businesses a normal client-facing workflow while still keeping settlement and status evidence on Somnia."

8. Show live Somnia DeFi execution.
   - Open `Swaps`, then `Yield`.
   - Select Somnia Exchange, Somnex, Potion Swap, or a custom DEX adapter.
   - Say: "ArcPay does not fake a router fill. The ArcPay Testnet Router can execute a live STT-to-SOMUSD swap with wallet signature and tx hash proof. External venues still require quote evidence, transaction hash, and balance snapshots before audit completion."
   - Open `/yield` and show the ArcPay STT Yield Vault deposit/withdraw flow.
   - Say: "Yield is also live through the ArcPay STT vault. Deposits and withdrawals require wallet approval and refresh the vault balance after confirmation."

9. Show privacy intents.
   - Open `Privacy`.
   - Create a small STT or SOMUSD shield intent, then show release/cancel/disclosure controls.
   - Say: "Somnia does not have a native privacy layer yet, so ArcPay adds a practical privacy-intent primitive: commitment, encrypted memo URI, delayed recipient release, cancellation, and nullifier evidence."

10. Show cards and contractors.
   - Open `Cards`.
   - Create or load a SOMUSD card and show freeze/activate/top-up controls.
   - Open `Contractors`.
   - Show allowlist, risk score, and payout batch intent.
   - Say: "Operators can give agents and contributors bounded budgets without exposing the whole treasury."

11. Close with audit and docs.
   - Open `Audit`, `Proofs`, then public `Docs`.
   - Say: "The system is not just frontend state. There are deployed contracts, a live Azure x402 server, a Supabase-backed worker, published MCP, CLI, and x402 starter packages, smoke tests, and explorer links for verification."

## Short Closing Line

"ArcPay makes Somnia useful for real agent businesses: discover agents, hire them, enforce policy, manage spend, preserve private context, and prove every financial action."

## Operator Verification

Run these locally before recording:

```bash
npm run build:frontend
npm test
npm run check:worker
npm run check:x402
npm run smoke:auth
npm run smoke:live
npm run smoke:x402
```

Check the live x402 backend:

```bash
curl https://x402.20.208.46.195.nip.io/health
curl https://x402.20.208.46.195.nip.io/x402/demo
```

`npm run smoke:live` spends small Somnia testnet amounts and verifies registry writes, policy, escrowed order lifecycle, operator controls, SOMUSD cards, privacy release, and risk oracle fulfillment.

`npm run smoke:x402` verifies the HTTP 402 quote, on-chain escrow payment, provider fulfillment, resource unlock, and settlement flow.
