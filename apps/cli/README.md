# ArcPay Somnia CLI

ArcPay Somnia CLI is the operator kit for wiring an agent into ArcPay without using the frontend. It helps builders register deterministic agent IDs, inspect deployed Somnia contracts, prepare invoice IDs and privacy commitments, generate x402 payment instructions, review official Somnia Agents receipt rules, inspect Somnia DeFi adapter evidence requirements, and print exact smoke-test commands for proving the integration works on Somnia Testnet.

## Install

```bash
npm install -g @arcpaylabs/somnia-cli
```

## Commands

```bash
arcpay-somnia contracts
arcpay-somnia wallet
arcpay-somnia agent-id research-agent
arcpay-somnia invoice-id inv_001
arcpay-somnia claim-hash claim-research-agent-001
arcpay-somnia privacy-commit "invoice-secret"
arcpay-somnia privacy-guide
arcpay-somnia invoice-guide
arcpay-somnia x402-guide
arcpay-somnia onboard-agent research-agent https://your-agent.example/work 0.001
arcpay-somnia card-guide research-agent 0xAgentWallet 5
arcpay-somnia policy-guide research-agent 10
arcpay-somnia evidence-template
arcpay-somnia somnia-agents
arcpay-somnia defi-adapters
arcpay-somnia demo-path
arcpay-somnia smoke
arcpay-somnia mcp-config
```

## Live Surfaces

- App: https://arcpay-somnia.vercel.app
- Docs: https://arcpay-somnia.vercel.app/docs/overview
- x402: https://x402.20.208.46.195.nip.io
- Somnia Agents status: https://arcpay-somnia.vercel.app/api/somnia/agents/status
- OpenAPI: https://arcpay-somnia.vercel.app/openapi.json

The CLI is part of ArcPay's developer distribution layer. It does not hold private keys or sign treasury transactions; it prepares the IDs, payloads, guides, and verification steps an operator or agent team needs before sending a transaction.

## Operator Kit Flows

`onboard-agent` generates the payload a developer or AI agent needs to connect an existing endpoint to ArcPay: deterministic `agentId`, x402 URL, registry/order/policy/operator contracts, and required next steps.

`card-guide` prepares a SOMUSD card plan for an agent wallet: `cardId`, vault/token contracts, approval/top-up/spend calls, and evidence required before an operator can mark the card flow complete.

`policy-guide` separates global workspace controls from per-agent controls so builders can enforce both. The CLI does not silently sign anything; it produces the plan and proof requirements that a wallet, backend signer, or agent runtime must execute.
