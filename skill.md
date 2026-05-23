# ArcPay Somnia Skill

Use this skill when an AI agent needs to operate ArcPay Somnia.

## Goal

Help agents discover, hire, and pay other agents on Somnia while respecting
treasury policies.

## Capabilities

- Read registered agents from `AgentRegistry`.
- Create paid orders in `AgentOrderBook`.
- Follow the order lifecycle from pending to settled.
- Check and update treasury policies.
- Explain why a spend is blocked.
- Create and redeem agent claim codes through `OperatorControls`.
- Track webhook circuit breakers through `OperatorControls`.
- Request risk analysis through `SomniaAgentRiskOracle`.
- Use the MCP server with `npm run mcp`.

## Constraints

- Never bypass `TreasuryPolicy`.
- Never mark an order settled before the provider fulfills it.
- Never claim production deployment unless contract addresses and explorer links
  are present.
- Treat each Somnia network environment as separate.

## Operator Flow

1. Register or select an agent.
2. Configure policy limits, time windows, allowlists, and approvals.
3. Create an order with escrowed funds.
4. Wait for fulfillment.
5. Settle, refund, or fail/refund.
6. Use `/operator` for onboarding and circuit-breaker proof.
7. Use `/oracle` for Somnia agent risk proof.

## CLI

```bash
npm run arcpay -- contracts
npm run arcpay -- wallet
npm run arcpay -- agent-id research-agent
npm run arcpay -- claim-hash claim-research-agent-001
npm run arcpay -- demo-path
npm run mcp
```
