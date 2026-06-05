# Live Wallet And Agent QA Plan

Use this for the final recording session where Henry approves wallet prompts.

## Goals

1. Prove the dashboard flow works with a real wallet.
2. Prove ArcPay can onboard an external agent through CLI/MCP/starter-kit surfaces.
3. Prove policies, x402, cards, privacy, and audit evidence are connected.
4. Capture evidence without claiming execution before transaction/order proof exists.

## Wallet QA Flow

Use the funded Somnia wallet in the browser.

1. Open https://arcpay-somnia.vercel.app.
2. Click **Open App** or **Sign in**.
3. Connect wallet and approve:
   - network add/switch to Somnia Testnet
   - account connection
   - wallet auth signature
4. Confirm dashboard loads with the wallet address in the top bar.
5. Open `/wallet` and confirm wallet/session state.
6. Open `/agents`, load/register `treasury-router` or `research-agent`.
7. Open `/policies`, set conservative limits and allowlist the agent.
8. Open `/x402`, quote the protected resource, create an order only if budget is acceptable, and capture:
   - x402 quote JSON
   - order transaction hash
   - order ID
   - verification response
9. Open `/privacy`, create a privacy intent only if the amount is safe, and capture:
   - commitment
   - memo URI
   - transaction hash
10. Open `/cards`, delegate a SOMUSD test card only if token balance/approval is ready.
11. Open `/audit` and confirm wallet/action evidence appears.
12. Open `/status` and confirm the app reports live network/API status.

## External Agent Onboarding Flow

This is the proof that ArcPay is useful for agents, not only humans.

### Option A - CLI Agent

Install the operator kit:

```powershell
npm install -g @arcpaylabs/somnia-cli
arcpay-somnia wallet
arcpay-somnia somnia-agents
arcpay-somnia x402-guide
arcpay-somnia defi-adapters
```

Use the CLI output to configure the agent with:

- ArcPay app: `https://arcpay-somnia.vercel.app`
- x402 gateway: `https://x402.20.208.46.195.nip.io`
- Somnia Agents status: `https://arcpay-somnia.vercel.app/api/somnia/agents/status`
- Agent skills index: `https://arcpay-somnia.vercel.app/.well-known/agent-skills/index.json`

### Option B - MCP Agent

Install MCP:

```powershell
npm install -g @arcpaylabs/somnia-mcp
```

Claude Desktop/Codex-style MCP config:

```json
{
  "mcpServers": {
    "arcpay-somnia": {
      "command": "arcpay-somnia-mcp"
    }
  }
}
```

Ask the connected agent:

```text
Use ArcPay Somnia as my treasury policy and x402 evidence layer.
Call get_deployment, somnia_agents, x402_guide, and somnia_defi_adapters.
Prepare a safe plan for an agent called treasury-router.
Do not claim execution without a Somnia tx hash, x402 verification, or ArcPay audit record.
```

Expected proof:

- Agent reads ArcPay deployment/contracts.
- Agent identifies Somnia Agents IDs and receipt policy.
- Agent prepares a safe x402/order plan.
- Agent refuses to claim completion without evidence.

### Option C - Starter Kit Agent

Install the starter:

```powershell
npm install -g @arcpaylabs/somnia-x402-agent-starter
arcpay-somnia-x402-agent quote research-agent
```

Expected proof:

- Agent client reads x402 payment requirements.
- The returned quote includes payment amount, target orderbook, resource URL, and verification URL.
- Actual order creation still requires wallet signing or an approved agent signer.

## Tracking Users, Agents, And Usage

ArcPay currently tracks:

- beta signups through Supabase
- app/developer tool usage events
- MCP calls
- x402 quote/verify/unlock events
- local and server audit records
- active owners, agents, and records in `/analytics`
- npm package usage through npm registry download stats

Recommended launch metrics:

- Weekly npm downloads for:
  - `@arcpaylabs/somnia-cli`
  - `@arcpaylabs/somnia-mcp`
  - `@arcpaylabs/somnia-x402-agent-starter`
- Beta signups and approved users.
- Number of connected wallets.
- Number of registered agents.
- x402 quotes created.
- x402 orders paid/fulfilled/unlocked.
- Somnia Agent receipts attached to ArcPay records.
- Privacy intents created/released.
- DeFi intents created with venue evidence.

## Recording Rule

Do not say "executed" unless the recording shows at least one of:

- Somnia transaction hash
- x402 verification response
- ArcPay order ID with fulfilled/settled state
- Somnia Agent receipt evidence
- ArcPay audit record with source evidence
