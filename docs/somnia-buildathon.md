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
| `AgentRegistry` | `0x350F8f29a5A10eE4d85642CE3AB72497982ee09D` |
| `TreasuryPolicy` | `0x4c0f962e6555399f45C628DC7F77d4cC6171BB2A` |
| `AgentTreasury` | `0x9dB9477D068A58154A54d10D1E5711A9E1fD9EA0` |
| `AgentOrderBook` | `0x6A07886d465Bd64ED3264F4e824C1dF2884a7B45` |
| `OperatorControls` | `0xb7b26AD2cCBf6613A43f2Db4a550eDF1D7dB8b32` |
| `SomniaAgentRiskOracle` | `0xA5Ec905B95E5b166EF846849eaB8FDD1dB134D0C` |
| `AgentSpendCardVault` | `0x0480E467bA12E33DA163FeA45a20C30133F84B93` |
| `SomniaPrivacyVault` | `0x6948a15dED7F6708BD4DfD8c3Ee5314bC5B53D14` |

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
- commitment-based private payment intents with encrypted metadata and nullifier release
