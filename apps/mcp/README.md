# ArcPay Somnia MCP

Local MCP server for ArcPay Somnia. It exposes safe developer tools for Somnia Testnet deployments, x402 payment gates, invoice IDs, claim hashes, privacy commitments, and repeatable demo paths.

## Install

```bash
npm install -g @arcpaylabs/somnia-mcp
```

## Claude Desktop

Add this to your Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "arcpay-somnia": {
      "command": "arcpay-somnia-mcp"
    }
  }
}
```

Restart Claude Desktop after editing the config.

## Tools

- `get_deployment`
- `derive_agent_id`
- `derive_invoice_id`
- `derive_claim_hash`
- `derive_privacy_commitment`
- `privacy_intent_guide`
- `invoice_guide`
- `x402_guide`
- `somnia_defi_adapters`
- `demo_path`
- `smoke_commands`

## Hosted Surfaces

- App: https://arcpay-somnia.vercel.app
- Docs: https://arcpay-somnia.vercel.app/docs/overview
- OpenAPI: https://arcpay-somnia.vercel.app/openapi.json
- llms.txt: https://arcpay-somnia.vercel.app/llms.txt
- x402: https://x402.20.208.46.195.nip.io

The MCP server does not sign transactions or mutate treasury state. It only returns deterministic IDs, integration guidance, and public deployment metadata.
