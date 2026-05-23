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
npm run install:mcp
npm run install:worker
npm run build
npm test
npm run build:frontend
```

Run the app:

```bash
npm run dev:frontend
```

Agent and operator tooling:

```bash
npm run arcpay -- contracts
npm run arcpay -- wallet
npm run arcpay -- agent-id research-agent
npm run arcpay -- claim-hash claim-research-agent-001
npm run arcpay -- mcp-config
npm run mcp
npm run worker
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
| `AgentRegistry` | `0x74d3f2Fe7A36Bd7859EF94477414b70A3B02191C` |
| `TreasuryPolicy` | `0x257792367b2A5405aFC96242be5e702FdeB7B153` |
| `AgentTreasury` | `0x929B5B3A831c5188902b0A617d732acC20b9cd87` |
| `AgentOrderBook` | `0x3738033D7437f72057ee92C8d736C030Fd8Ab55c` |
| `OperatorControls` | `0x246F3d4540a6edd7f385800764EC08Ffc8a724E7` |
| `SomniaAgentRiskOracle` | `0xC9e4a3f86FD0771f657eA5dFE01d9E0e726e30D1` |
| `AgentSpendCardVault` | `0x19Dcb620913a87C2199EcBA53915D861fAe0516e` |
 
Machine-readable deployment metadata lives in
`deployments/somnia-testnet.json`.

## Depth Contract Redeploy

The repo now includes and deploys the Cards402-depth layer:

- `OperatorControls`
- `SomniaAgentRiskOracle`
- `AgentSpendCardVault`
- upgraded `TreasuryPolicy`
- upgraded `AgentOrderBook`

To redeploy after future changes:

```bash
npm run deploy:somnia
```

The command rewrites `deployments/somnia-testnet.json`; the frontend imports
that file automatically. Current Somnia agent platform:
`0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776`.

Current SOMUSD testnet token:
`0x02b8316775057e2096471473663d51ceafbe3e3b`.

## Judge Path

1. Read `docs/somnia-buildathon.md`.
2. Read `docs/agent-protocol.md`.
3. Install with `npm install` and `npm run install:frontend`.
4. Compile and test with `npm run build`, `npm test`, and `npm run build:frontend`.
5. Start the UI with `npm run dev:frontend`.
6. Register an agent, set a policy, allow the agent, create an order, fulfill it, and settle.

## Frontend Routes

The Somnia build is fixed to Somnia Testnet so all wallet actions, proofs, and
demo paths resolve to Somnia infrastructure.

| Route | Purpose |
| --- | --- |
| `/dashboard` | Deployment overview, contract links, runtime status, recent records. |
| `/agents` | Register and load Somnia agent services from `AgentRegistry`. |
| `/orders` | Create, accept, process, fulfill, settle, or refund escrowed agent orders. |
| `/cards` | Create SOMUSD-backed agent spend cards with limits and freeze controls. |
| `/policies` | Set hourly/daily/weekly limits, approval threshold, UTC-hour windows, emergency pause, and agent allowlist. |
| `/operator` | Claim-code onboarding and webhook circuit-breaker controls. |
| `/oracle` | Somnia agent risk request/callback flow. |
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
- MCP server added under `apps/mcp`
- CLI added under `bin/arcpay-somnia.mjs`
- Cards402-depth operator controls added
- agent protocol docs added
- `llms.txt` and `skill.md` added for agent-facing usage
