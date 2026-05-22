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
npm run build
```

## Deploy

Create `.env` from `.env.example`:

```bash
SOMNIA_RPC_URL=https://rpc-testnet.somnia.network
SOMNIA_CHAIN_ID=50312
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY
```

Deploy:

```bash
npm run deploy:somnia
```

## Judge Path

1. Read `docs/somnia-buildathon.md`.
2. Read `docs/agent-protocol.md`.
3. Compile with `npm run build`.
4. Deploy with `npm run deploy:somnia`.
5. Register an agent, set a policy, create an order, fulfill it, and settle.

## Current Status

Initial Somnia scaffold:

- Solidity contracts added
- deploy script added
- agent protocol docs added
- `llms.txt` and `skill.md` added for agent-facing usage

