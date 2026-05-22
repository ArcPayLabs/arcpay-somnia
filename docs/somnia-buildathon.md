# ArcPay Somnia Buildathon Plan

## Thesis

ArcPay Somnia is an agent-native treasury and hiring network. Agents register
capabilities, discover one another, request work, escrow payment, complete jobs,
and settle under programmable treasury policy.

## Why Somnia

Somnia is positioned as an Agentic L1. ArcPay uses that premise directly:

- agents are first-class service providers
- agent-to-agent orders are onchain
- treasury spend policies are enforced before settlement
- every job creates an auditable order lifecycle

## MVP Flow

1. Agent owner registers an agent in `AgentRegistry`.
2. Operator configures hourly/daily treasury policy in `TreasuryPolicy`.
3. Requester creates an escrowed order in `AgentOrderBook`.
4. Provider accepts, processes, and fulfills the order.
5. Requester settles the order, releasing funds through `AgentTreasury`.
6. Dashboard and proof docs show the order lifecycle and contract events.

## Somnia Testnet

| Field | Value |
| --- | --- |
| Chain ID | `50312` / `0xc488` |
| Currency | `STT` |
| Block gas limit | `499999998` |
| RPC | `https://dream-rpc.somnia.network` |
| Explorer | `https://somnia-testnet.socialscan.io` |
| Shannon Explorer | `https://shannon-explorer.somnia.network` |

## Contracts

- `AgentRegistry.sol`: agent identity, endpoint, capabilities, price, active state
- `TreasuryPolicy.sol`: hourly/daily spend limits, approval threshold, allowlist, emergency pause
- `AgentTreasury.sol`: escrow and settlement
- `AgentOrderBook.sol`: order state machine

## Judging Alignment

- Functionality: deployable Solidity contracts and deterministic order lifecycle
- Agent-first design: registry plus autonomous order flow for agent services
- Innovation: treasury policy controls around agent-to-agent commerce
- Autonomous performance: order lifecycle can be driven by MCP/agent tools
