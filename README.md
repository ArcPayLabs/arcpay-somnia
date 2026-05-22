# ArcPay Somnia

ArcPay Somnia is an agent-native treasury and autonomous service payment system
for the Somnia Agentic L1 buildathon.

Agents can register capabilities, discover one another, create paid work orders,
escrow funds, complete jobs, and settle under programmable treasury policy.

## Buildathon Focus

Somnia challenge:

> Build the most novel and high-impact agent-driven application on Somnia.

ArcPay Somnia focuses on:

- agent discovery
- agent-to-agent paid work
- onchain order lifecycle
- treasury spend policy
- autonomous agent operations through future MCP tooling

## Contracts

| Contract | Purpose |
| --- | --- |
| `AgentRegistry.sol` | Register agent identity, endpoint, capability, price, and active state. |
| `TreasuryPolicy.sol` | Enforce hourly/daily limits, approval threshold, allowlist, and emergency pause. |
| `AgentTreasury.sol` | Escrow and release native Somnia funds for orders. |
| `AgentOrderBook.sol` | Agent order state machine from pending to settled/refunded. |

## Local Setup

```bash
npm install
npm run install:frontend
npm run build
npm test
npm run build:frontend
```

Run the app:

```bash
npm run dev:frontend
```

## Deploy

Create `.env` from `.env.example`:

```bash
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
SOMNIA_CHAIN_ID=50312
SOMNIA_EXPLORER_URL=https://somnia-testnet.socialscan.io
SOMNIA_SHANNON_EXPLORER_URL=https://shannon-explorer.somnia.network
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY
```

Deploy:

```bash
npm run deploy:somnia
```

Somnia testnet details:

| Field | Value |
| --- | --- |
| Chain ID | `50312` / `0xc488` |
| Currency | `STT` |
| RPC | `https://dream-rpc.somnia.network` |
| Explorer | `https://somnia-testnet.socialscan.io` |
| Shannon Explorer | `https://shannon-explorer.somnia.network` |

## Somnia Testnet Deployment

Deployer:

```text
0xB883e76A4f6841E72cAF1C28ba00f78df974f448
```

Contracts:

| Contract | Address |
| --- | --- |
| `AgentRegistry` | `0x5F5b8109c832BB6609178F0bb2e6A597387dA17E` |
| `TreasuryPolicy` | `0x3F8bc2b46E7b71632CdADd1f00d4FD6BB11d8283` |
| `AgentTreasury` | `0xe472A6367ab66C271aa47cA5882E919c0DEA0ff2` |
| `AgentOrderBook` | `0x3587fd962d40433165d5f2a3dFc60636ebD11e59` |
 
Machine-readable deployment metadata lives in
`deployments/somnia-testnet.json`.

## Judge Path

1. Read `docs/somnia-buildathon.md`.
2. Read `docs/agent-protocol.md`.
3. Install with `npm install` and `npm run install:frontend`.
4. Compile and test with `npm run build`, `npm test`, and `npm run build:frontend`.
5. Start the UI with `npm run dev:frontend`.
6. Register an agent, set a policy, allow the agent, create an order, fulfill it, and settle.

## Frontend Routes

The Somnia build keeps the ArcPay treasury OS shape, but it is fixed to Somnia
Testnet instead of Solana mainnet/devnet switching.

| Route | Purpose |
| --- | --- |
| `/dashboard` | Deployment overview, contract links, runtime status, recent records. |
| `/agents` | Register and load Somnia agent services from `AgentRegistry`. |
| `/orders` | Create, accept, process, fulfill, settle, or refund escrowed agent orders. |
| `/policies` | Set hourly/daily limits, approval threshold, emergency pause, and agent allowlist. |
| `/payments` | Wallet-signed direct STT payments for operator payouts. |
| `/invoices` | Local invoice workflow for demo receivables. |
| `/contractors` | Local contractor/agent workforce records. |
| `/audit` | Local workflow records and transaction hashes. |
| `/proofs` | Judge-facing deployment proof and local verification commands. |
| `/settings` | Somnia-only testnet runtime configuration. |

## Current Status

Initial Somnia scaffold:

- Solidity contracts added
- deploy script added
- Somnia testnet deployment completed
- ArcPay-style frontend added under `apps/frontend`
- agent protocol docs added
- `llms.txt` and `skill.md` added for agent-facing usage
