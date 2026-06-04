# ArcPay Somnia MCP

ArcPay Somnia MCP is ArcPay for AI agents. Claude Desktop, Codex-compatible hosts, and other MCP clients can ask ArcPay for Somnia deployment data, derive agent and invoice IDs, prepare x402 paid-resource flows, generate privacy/invoice instructions, inspect official Somnia Agents receipt rules, inspect Somnia DeFi adapter requirements, and return evidence checklists before claiming any work is complete.

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
- `somnia_agents`
- `demo_path`
- `smoke_commands`

## Hosted Surfaces

- App: https://arcpay-somnia.vercel.app
- Docs: https://arcpay-somnia.vercel.app/docs/overview
- OpenAPI: https://arcpay-somnia.vercel.app/openapi.json
- llms.txt: https://arcpay-somnia.vercel.app/llms.txt
- x402: https://x402.20.208.46.195.nip.io
- Somnia Agents status: https://arcpay-somnia.vercel.app/api/somnia/agents/status

The MCP server makes ArcPay usable by agents directly, not only by humans clicking a dashboard. It does not sign transactions or mutate treasury state; it returns deterministic IDs, integration guidance, handoff payloads, and public deployment metadata that an operator can verify before execution.
