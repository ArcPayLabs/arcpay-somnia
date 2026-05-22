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
| `AgentRegistry` | `0x5F5b8109c832BB6609178F0bb2e6A597387dA17E` |
| `TreasuryPolicy` | `0x3F8bc2b46E7b71632CdADd1f00d4FD6BB11d8283` |
| `AgentTreasury` | `0xe472A6367ab66C271aa47cA5882E919c0DEA0ff2` |
| `AgentOrderBook` | `0x3587fd962d40433165d5f2a3dFc60636ebD11e59` |

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
