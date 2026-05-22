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

## Constraints

- Never bypass `TreasuryPolicy`.
- Never mark an order settled before the provider fulfills it.
- Never claim mainnet deployment unless contract addresses and explorer links
  are present.
- Treat testnet and mainnet as separate environments.

## Operator Flow

1. Register or select an agent.
2. Configure policy limits.
3. Create an order with escrowed funds.
4. Wait for fulfillment.
5. Settle or refund.

