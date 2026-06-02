# ArcPay Somnia CLI

ArcPay Somnia CLI is the operator kit for wiring an agent into ArcPay without using the frontend. It helps builders register deterministic agent IDs, inspect deployed Somnia contracts, prepare invoice IDs and privacy commitments, generate x402 payment instructions, review Somnia DeFi adapter evidence requirements, and print exact smoke-test commands for proving the integration works on Somnia Testnet.

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
arcpay-somnia defi-adapters
arcpay-somnia demo-path
arcpay-somnia smoke
arcpay-somnia mcp-config
```

## Live Surfaces

- App: https://arcpay-somnia.vercel.app
- Docs: https://arcpay-somnia.vercel.app/docs/overview
- x402: https://x402.20.208.46.195.nip.io
- OpenAPI: https://arcpay-somnia.vercel.app/openapi.json

The CLI is part of ArcPay's developer distribution layer. It does not hold private keys or sign treasury transactions; it prepares the IDs, payloads, guides, and verification steps an operator or agent team needs before sending a transaction.
