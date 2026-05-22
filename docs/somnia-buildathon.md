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
3. Operator allowlists an agent if allowlist mode is enabled.
4. Requester creates an escrowed order in `AgentOrderBook`.
5. Provider accepts, processes, and fulfills the order.
6. Requester settles the order, releasing funds through `AgentTreasury`.
7. Dashboard, audit, and proof pages show the order lifecycle and contract events.

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

## Deployment

Somnia testnet deployment metadata:

```text
deployments/somnia-testnet.json
```

| Contract | Address |
| --- | --- |
| `AgentRegistry` | `0xB9B9DAbb10036F83197a3345FF597c3427CA4816` |
| `TreasuryPolicy` | `0x92Ae2aB255275ed2F1aA52539214A8Fe9968733a` |
| `AgentTreasury` | `0x85dE6EAd41D1aD3B3cC4Bb282C842EFa9047411a` |
| `AgentOrderBook` | `0xEE8d2c4848307C194386618A3FE5d8F7c0d975E8` |
| `OperatorControls` | `0xB55B9CDE3EF6D5F4d09cFE33fe33755282DAa67F` |
| `SomniaAgentRiskOracle` | `0xeBeB561321Ac832a1bAA758Ca643270Ef09DfFe3` |
| `AgentSpendCardVault` | `0xfF9125E01949932D697950F768e7eE4bD018682B` |

## Judging Alignment

- Functionality: deployable Solidity contracts and deterministic order lifecycle
- Agent-first design: registry plus autonomous order flow for agent services
- Innovation: treasury policy controls around agent-to-agent commerce
- Autonomous performance: order lifecycle can be driven by MCP/agent tools

## Product Surface

The UI is not a standalone toy page. It ports the ArcPay treasury operating
system into a Somnia-only testnet app:

- wallet-first onboarding through EVM wallet switching to chain `50312`
- agent discovery and service pricing through live Somnia contracts
- escrowed agent orders with explicit lifecycle actions
- real policy enforcement before order creation
- direct STT payouts for operator-controlled payments
- local invoices, contractors, audit logs, and proof pages for a complete demo
- claim-code onboarding and webhook circuit-breaker controls
- Somnia `createRequest`-compatible risk oracle for agentic policy decisions
- SOMUSD-backed agent spend cards with limits, balances, spend events, and freeze controls
