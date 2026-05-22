# Cards402 Depth Map for ArcPay Somnia

This repo adapts the strongest Cards402 patterns without copying its
Stellar/card-specific implementation.

| Cards402 pattern | ArcPay Somnia implementation |
| --- | --- |
| MCP server | `apps/mcp/server.mjs` exposes deployment lookup, agent ID derivation, claim hash derivation, and demo path. |
| `skill.md` / `llms.txt` | Root files describe how agents and judges should operate the app. |
| Order state machine | `AgentOrderBook` supports pending, accepted, processing, fulfilled, settled, refunded, and failed. |
| Operator dashboard | Frontend includes dashboard, operator, policies, audit, proofs, agents, and orders pages. |
| Time-window policies | `TreasuryPolicy` enforces hourly, daily, weekly, UTC-hour windows, allowlists, emergency pause, and per-order approvals. |
| Circuit-breaker webhooks | `OperatorControls` tracks per-origin webhook failures and opens a breaker after repeated failures. |
| Agent claim code onboarding | `OperatorControls` creates and redeems expiring claim codes by hash. |
| CLI tool | `bin/arcpay-somnia.mjs` supports contracts, wallet, agent ID, claim hash, demo path, and MCP config commands. |
| Card-like spend product | `AgentSpendCardVault` creates SOMUSD-backed virtual cards for agent budgets. |

## Somnia-Native Layer

`SomniaAgentRiskOracle` is built around a `createRequest`-style agent platform
interface:

```solidity
function createRequest(
  uint256 agentId,
  bytes calldata input,
  address callback,
  bytes4 callbackSelector
) external payable returns (bytes32 requestId);
```

When a live Somnia Agent platform contract address is available, set:

```bash
SOMNIA_AGENT_PLATFORM=0x...
SOMNIA_RISK_AGENT_ID=...
```

Then redeploy with:

```bash
npm run deploy:somnia
```

If those envs are absent, the deploy script uses a mock platform so judges can
still run the same request/callback lifecycle locally or on testnet.

Current deployment uses Somnia's testnet agent requester:

```text
0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776
```
