# ArcPay Somnia

ArcPay Somnia is an agent-native treasury and autonomous service payment system
for the Somnia Agentic L1.

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
| `AgentInvoiceBook.sol` | STT/SOMUSD invoice creation, payment, cancellation, and settlement evidence. |

## Local Setup

```bash
npm install
npm run install:frontend
npm run install:mcp
npm run install:worker
npm run install:x402
npm run build
npm test
npm run build:frontend
npm run check:x402
npm run smoke:auth
npm run smoke:live
npm run smoke:x402
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
npm run arcpay -- privacy-guide
npm run arcpay -- x402-guide
npm run arcpay -- demo-path
npm run arcpay -- smoke
npm run arcpay -- mcp-config
npm run mcp
npm run worker
npm run worker:once
npm run x402
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
| `AgentRegistry` | `0x350F8f29a5A10eE4d85642CE3AB72497982ee09D` |
| `TreasuryPolicy` | `0x4c0f962e6555399f45C628DC7F77d4cC6171BB2A` |
| `AgentTreasury` | `0x9dB9477D068A58154A54d10D1E5711A9E1fD9EA0` |
| `AgentOrderBook` | `0x6A07886d465Bd64ED3264F4e824C1dF2884a7B45` |
| `OperatorControls` | `0xb7b26AD2cCBf6613A43f2Db4a550eDF1D7dB8b32` |
| `SomniaAgentRiskOracle` | `0xA5Ec905B95E5b166EF846849eaB8FDD1dB134D0C` |
| `AgentSpendCardVault` | `0x0480E467bA12E33DA163FeA45a20C30133F84B93` |
| `SomniaPrivacyVault` | `0x6948a15dED7F6708BD4DfD8c3Ee5314bC5B53D14` |
| `AgentInvoiceBook` | `0x643De19f32B1d0c396Cf8B5cD677549c442Fbbf7` |
 
Machine-readable deployment metadata lives in
`deployments/somnia-testnet.json`.

Privacy Intent builder docs live in `docs/privacy-intents.md`.

x402 payment-gated agent docs live in `docs/x402-somnia.md`.

## Persistence

Wallet sessions work without Supabase. To persist audit records in Vercel, run
`supabase/migrations/202605230001_somnia_records.sql` in your Supabase project
and set:

```bash
ARCPAY_SESSION_SECRET=...
ARCPAY_RECORDS_TABLE=arcpay_somnia_records
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

For Vercel, set the project root directory to `apps/frontend`. The frontend
build command is `npm run build`. Required production env:

```bash
ARCPAY_SESSION_SECRET=...
ARCPAY_RECORDS_TABLE=arcpay_somnia_records
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

The same Supabase project can back every ArcPay chain repo. Keep records
separated by table:

| Chain repo | Records table |
| --- | --- |
| `arcpay-somnia` | `arcpay_somnia_records` |
| `arcpay-sui` | `arcpay_sui_records` |
| `arcpay-mantle` | `arcpay_mantle_records` |
| `arcpay-arbitrum` | `arcpay_arbitrum_records` |

Optional public Supabase env can stay unset unless client-side Supabase reads
are added later:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The Azure worker reconciles Somnia events into Supabase-backed audit records:

```bash
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
ARCPAY_ROOT=/home/arcpay/arcpay-somnia
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ARCPAY_RECORDS_TABLE=arcpay_somnia_records
ARCPAY_WORKER_CHECKPOINT_PATH=/home/arcpay/.arcpay-somnia-worker-checkpoint.json
```

For a local one-shot reconciliation check:

```bash
npm run worker:once
```

The x402 server can run beside the worker on Azure or any Node host:

```bash
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
X402_SERVER_PORT=4032
X402_PROVIDER_PRIVATE_KEY=0x...
X402_ADMIN_SECRET=...
```

Current public x402 endpoint:

```text
https://x402.20.208.46.195.nip.io
```

## Depth Contract Redeploy

The repo now includes and deploys the Cards402-depth layer:

- `OperatorControls`
- `SomniaAgentRiskOracle`
- `AgentSpendCardVault`
- `SomniaPrivacyVault`
- HTTP 402 server for paid agent endpoints
- on-chain STT/SOMUSD invoices
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

## Operator Demo Path

1. Read `docs/somnia-buildathon.md`.
2. Read `docs/agent-protocol.md`.
3. Read `docs/demo-script.md`.
4. Install with `npm install` and `npm run install:frontend`.
5. Compile and test with `npm run build`, `npm test`, and `npm run build:frontend`.
6. Run `npm run smoke:auth` for Supabase/auth/workspace and read-only Somnia checks.
7. Run `npm run smoke:live` with a funded Somnia testnet `PRIVATE_KEY` for live contract writes.
8. Run `npm run smoke:x402` for an HTTP 402 quote, on-chain payment, provider fulfillment, unlock, and settlement proof.
9. Start the UI with `npm run dev:frontend`.
10. Register an agent, set a policy, allow the agent, create an order, fulfill it, settle it, request risk, create a card, and release a privacy intent.

## Frontend Routes

The Somnia build is fixed to Somnia Testnet so all wallet actions, proofs, and
demo paths resolve to Somnia infrastructure.

| Route | Purpose |
| --- | --- |
| `/dashboard` | Deployment overview, contract links, runtime status, recent records. |
| `/agents` | Register and load Somnia agent services from `AgentRegistry`. |
| `/orders` | Create, accept, process, fulfill, settle, or refund escrowed agent orders. |
| `/x402` | Quote HTTP 402 payment requirements, create an escrowed order, verify, fulfill, and unlock paid agent work. |
| `/cards` | Create SOMUSD-backed agent spend cards with limits and freeze controls. |
| `/policies` | Set hourly/daily/weekly limits, approval threshold, UTC-hour windows, emergency pause, and agent allowlist. |
| `/privacy` | Create and release commitment-based SOMUSD/STT payment intents with encrypted metadata and nullifiers. |
| `/operator` | Claim-code onboarding and webhook circuit-breaker controls. |
| `/oracle` | Somnia agent risk request/callback flow. |
| `/payments` | Wallet-signed direct STT payments for operator payouts. |
| `/invoices` | Create, pay, cancel, and sync STT/SOMUSD invoices through `AgentInvoiceBook`. |
| `/contractors` | Local contractor/agent workforce records. |
| `/audit` | Local workflow records and transaction hashes. |
| `/proofs` | Judge-facing deployment proof and local verification commands. |
| `/settings` | Somnia-only testnet runtime configuration. |

## Current Status

Current Somnia build:

- Solidity contracts added
- deploy script added
- Somnia testnet deployment completed
- ArcPay-style frontend added under `apps/frontend`
- MCP server added under `apps/mcp`
- CLI added under `bin/arcpay-somnia.mjs`
- x402 server added under `apps/x402-server`
- Cards402-depth operator controls added
- on-chain invoice book added and deployed
- agent protocol docs added
- `llms.txt` and `skill.md` added for agent-facing usage
- Supabase persistence migration added for audit/workflow records
- Azure worker package added for live event monitoring
- repeatable smoke scripts added for auth/workspace and funded Somnia testnet writes
