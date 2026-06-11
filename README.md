# ArcPay Somnia

ArcPay Somnia is an agent-native treasury and autonomous service payment system
for the Somnia Agentic L1.

ArcPay is not only an app. It is a control plane plus developer distribution
layer for agent payments, treasury policies, paid APIs, and verifiable execution
across chain ecosystems.

## Source Use

This repository is source-available for evaluation, review, and contribution.
The full ArcPay Somnia product is not licensed for unauthorized commercial
copying, rebranding, or redeployment. See `LICENSE.md` and `NOTICE.md`.

The x402 starter kit under `starter-kits/somnia-x402-agent` is separately
licensed under MIT so Somnia builders can reuse it freely.

Agents can register capabilities, discover one another, create paid work orders,
escrow funds, complete jobs, and settle under programmable treasury policy.

## Submission Links

- Live app: https://arcpay-somnia.vercel.app
- Docs: https://arcpay-somnia.vercel.app/docs/overview
- Presentation deck: https://drive.google.com/file/d/1drO6jU2Ryw2W9vbhEQajpYuFIJ4KdcoD/view?usp=sharing
- Demo video: https://youtu.be/aBnVYkRZkSc
- Code: https://github.com/ArcPayLabs/arcpay-somnia

## Product Focus

ArcPay Somnia focuses on:

- agent discovery
- agent-to-agent paid work
- dreamDEX CLOB, Somnia Exchange, Somnex, Potion Swap, and custom DEX adapter intents
- live STT-to-SOMUSD swap execution, live STT yield vault deposits, and policy-bound external DeFi adapter evidence capture
- onchain order lifecycle
- treasury spend policy
- autonomous agent operations through MCP, CLI, OpenAPI, and HTTP tools

## Published Developer Packages

ArcPay Somnia ships public npm packages for builders and agent developers:

```bash
npm install -g @arcpaylabs/somnia-cli
npm install -g @arcpaylabs/somnia-mcp
npm install -g @arcpaylabs/somnia-x402-agent-starter
```

Use them directly:

```bash
arcpay-somnia contracts
arcpay-somnia-mcp
arcpay-somnia-x402-agent quote research-agent
```

## Contracts

| Contract | Purpose |
| --- | --- |
| `AgentRegistry.sol` | Register agent identity, endpoint, capability, price, and active state. |
| `TreasuryPolicy.sol` | Enforce hourly/daily limits, approval threshold, allowlist, and emergency pause. |
| `AgentTreasury.sol` | Escrow and release native Somnia funds for orders. |
| `AgentOrderBook.sol` | Agent order state machine from pending to settled/refunded. |
| `AgentInvoiceBook.sol` | STT/SOMUSD invoice creation, payment, cancellation, and settlement evidence. |
| `OperatorControls.sol` | Agent claim-code onboarding and webhook circuit-breaker controls. |
| `SomniaAgentRiskOracle.sol` | Agentic risk request/callback flow for treasury policy decisions. |
| `AgentSpendCardVault.sol` | SOMUSD-backed virtual spend cards for agent budgets. |
| `SomniaPrivacyVault.sol` | Commitment-based payment intents with encrypted memo URIs and nullifier release. |
| `AgentReputationBook.sol` | Order-backed score, review, and dispute evidence for service agents. |
| `SomniaSwapRouter.sol` | Live STT-to-SOMUSD swap execution with wallet signature and tx hash proof. |
| `SomniaYieldVault.sol` | Live STT yield deposit/withdraw flow with vault-balance evidence. |

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

Published package equivalents:

```bash
arcpay-somnia contracts
arcpay-somnia wallet
arcpay-somnia agent-id research-agent
arcpay-somnia privacy-guide
arcpay-somnia x402-guide
arcpay-somnia defi-adapters
arcpay-somnia-mcp
arcpay-somnia-x402-agent quote research-agent
```

## Deploy

Create `.env` from `.env.example`:

```bash
SOMNIA_RPC_URL=https://api.infra.testnet.somnia.network/
SOMNIA_CHAIN_ID=50312
SOMNIA_EXPLORER_URL=https://somnia-testnet.socialscan.io
SOMNIA_SHANNON_EXPLORER_URL=https://shannon-explorer.somnia.network
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY
```

Deploy:

```bash
npm run deploy:somnia
npm run deploy:defi
```

Somnia testnet details:

| Field | Value |
| --- | --- |
| Chain ID | `50312` / `0xc488` |
| Currency | `STT` |
| RPC | `https://api.infra.testnet.somnia.network/` |
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
| `AgentReputationBook` | `0xBB9aB7d9e2ad5205F390580119b139bce84C8096` |
| `SomniaSwapRouter` | `0x09D1a6A7fcB922D4E36e3b0079db535bD6695957` |
| `SomniaYieldVault` | `0x45aA9Edfb582c9D471E86dd0B553b4000872C3a8` |

Live DeFi support token:

```text
0xc902DC8Ca090F6959AC4A48a20E5E17D8480bb23
```

Machine-readable deployment metadata lives in
`deployments/somnia-testnet.json`.

Privacy Intent builder docs live in `docs/privacy-intents.md`.

x402 payment-gated agent docs live in `docs/x402-somnia.md`.

Somnia DeFi adapter docs live in `somnia-defi-adapters.mdx` and cover dreamDEX
CLOB, Somnia Exchange, Somnex, Potion Swap, and custom Somnia DEX adapter evidence flows.

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

To track app, x402, MCP, developer-tool, beta, and audit-record usage, also
apply `supabase/migrations/202605280001_somnia_usage_events.sql`. The admin
analytics page reads this table from `/analytics`.

This repo writes Somnia records to `arcpay_somnia_records`. Future ArcPay
editions should keep their own table and docs so each deployment remains
chain-specific and auditable.

Optional public Supabase env can stay unset unless client-side Supabase reads
are added later:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The Azure worker reconciles Somnia events into Supabase-backed audit records:

```bash
SOMNIA_RPC_URL=https://api.infra.testnet.somnia.network/
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
SOMNIA_RPC_URL=https://api.infra.testnet.somnia.network/
X402_SERVER_PORT=4032
X402_PROVIDER_PRIVATE_KEY=0x...
X402_ADMIN_SECRET=...
```

Current public x402 endpoint:

```text
https://x402.20.208.46.195.nip.io
```

ArcPay's x402 rail follows the HTTP `402 Payment Required` pattern: request a
protected agent resource, receive exact payment requirements, pay on-chain,
retry with payment proof, and unlock the resource. On Somnia Testnet the proof
is a fulfilled `AgentOrderBook` escrow order ID, so agents can use
`?orderId=...`, `X-ArcPay-Order-Id`, or `X-Payment: {"orderId":"0x..."}`.

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

## Mintlify Docs and Developer Discovery

ArcPay includes a Mintlify-ready docs site:

- `docs.json` - Mintlify navigation and theme config
- root `*.mdx` pages - human docs for operators and developers
- `apps/frontend/public/openapi.json` - public OpenAPI-style developer reference served as `/openapi.json`
- `apps/frontend/public/llms.txt` - agent-readable product context served as `/llms.txt`
- `apps/frontend/src/app/api/developer/tools` - HTTP wrapper for safe MCP-style developer tools
- `@arcpaylabs/somnia-cli` - published CLI for contracts, IDs, guides, smoke paths, and MCP config
- `@arcpaylabs/somnia-mcp` - published stdio MCP server for Claude Desktop and compatible hosts
- `@arcpaylabs/somnia-x402-agent-starter` - published reusable Somnia x402 client starter
- `starter-kits/somnia-x402-agent` - source for the reusable Somnia x402 client starter
- `examples/privacy-intents` and `examples/agent-reputation` - integration patterns for builders
- `somnia-defi-adapters.mdx` - Somnia DeFi adapter map and evidence requirements

For Mintlify deployment, connect this repository and use the repo root as the
docs root so `docs.json` can reference the existing app assets and OpenAPI
file. The Vercel app redirects `/docs` and `/docs/*` to the deployed Mintlify
site so Mintlify serves its own CSS/JS assets correctly.

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
| `/swaps` | Live STT -> SOMUSD execution through ArcPay Testnet Router, plus dreamDEX, Somnia Exchange, Somnex, Potion Swap, and custom DEX adapter evidence paths. |
| `/yield` | Live STT deposit/withdraw through ArcPay STT Yield Vault, plus external yield strategy adapters with drawdown, venue, and tx evidence requirements. |
| `/audit` | Local workflow records and transaction hashes. |
| `/analytics` | Admin usage analytics for beta signups, developer keys, MCP/tool calls, x402 activity, records, owners, and agents. |
| `/proofs` | Judge-facing deployment proof and local verification commands. |
| `/settings` | Somnia-only testnet runtime configuration. |

## Current Status

Current Somnia build:

- Solidity contracts added
- deploy script added
- Somnia testnet deployment completed
- ArcPay-style frontend added under `apps/frontend`
- MCP server added under `apps/mcp` and published as `@arcpaylabs/somnia-mcp`
- CLI added under `apps/cli` and published as `@arcpaylabs/somnia-cli`
- x402 starter kit published as `@arcpaylabs/somnia-x402-agent-starter`
- Somnia DeFi adapter layer added for dreamDEX CLOB, Somnia Exchange, Somnex, Potion Swap, and custom DEX routers
- x402 server added under `apps/x402-server`
- Cards402-depth operator controls added
- on-chain invoice book added and deployed
- agent protocol docs added
- `llms.txt` and `skill.md` added for agent-facing usage
- Supabase persistence migration added for audit/workflow records
- Azure worker package added for live event monitoring
- repeatable smoke scripts added for auth/workspace and funded Somnia testnet writes
- Supabase usage analytics added for app, x402, MCP, developer tools, beta, and records
