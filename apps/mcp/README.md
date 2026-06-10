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
- `agent_onboarding_payload`
- `somusd_card_plan`
- `policy_plan`
- `evidence_template`
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

## Agent-Native Flows

`agent_onboarding_payload` lets Claude/Codex/custom agents request the same onboarding payload a dashboard user gets: agent id, x402 endpoint, contract map, policy requirements, and claim-code steps.

`somusd_card_plan` lets an agent or developer prepare card issuance without touching the dashboard. It returns the card id, vault/token contracts, call sequence, and proof requirements for create/top-up/spend.

`policy_plan` returns both global workspace controls and per-agent controls, so an agent can explain what it is allowed to do before attempting any paid or money-moving action.

`evidence_template` is the guardrail: it tells the agent exactly what hashes, API responses, receipts, and screenshots are required before it can claim completion.
