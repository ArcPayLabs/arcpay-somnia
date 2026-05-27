# ArcPay Somnia CLI

Developer CLI for ArcPay Somnia. It prints deployed contract addresses, derives IDs used by the contracts, returns integration guides, and generates MCP config.

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
arcpay-somnia demo-path
arcpay-somnia smoke
arcpay-somnia mcp-config
```

## Live Surfaces

- App: https://arcpay-somnia.vercel.app
- Docs: https://arcpay-somnia.vercel.app/docs/overview
- x402: https://x402.20.208.46.195.nip.io
- OpenAPI: https://arcpay-somnia.vercel.app/openapi.json

The CLI is a developer helper. It does not hold private keys or sign treasury transactions.
