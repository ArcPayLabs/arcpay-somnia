# ArcPay Somnia Demo Recording Runbook

Use this as the exact screen-recording checklist. Record the screen first, then generate the voiceover from `DEMO_VOICEOVER.txt` and align cuts in CapCut, HyperFrames, or another editor.

## Before Recording

1. Use a clean browser window.
2. Keep only ArcPay, docs, npm, and explorer tabs open.
3. Connect the funded Somnia wallet before starting if you want fewer interruptions.
4. Set browser zoom to 100% for dashboard pages and 125% for JSON/docs pages.
5. Keep this file and `DEMO_VIDEO_PLAN.md` open on another monitor.
6. Do not expose secrets, admin bearer tokens, recovery codes, or private keys.

## Exact Values

- Workspace: `Somnia agent treasury`
- Agent slug: `research-agent`
- Agent endpoint: `https://x402.20.208.46.195.nip.io/agent/research-agent/work`
- Claim code: `claim-research-agent-001`
- Metadata URI: `ipfs://agent-onboarding-pack`
- Webhook: `https://agent.example/webhook`
- x402 server: `https://x402.20.208.46.195.nip.io`
- x402 result URI: `ipfs://arcpay-x402-result/research-agent`
- Card slug: `research-card-001`
- Card label: `Research Agent SOMUSD Card`
- Card limit: `5`
- Card top-up: `5`
- Privacy memo URI: `selective-disclosure://workspace-auditor`

## Recording Path

### 1. Landing

Open `https://arcpay-somnia.vercel.app`.

Show the hero, the Somnia testnet badge, and navigation. Click `Open App`.

### 2. Sign In

If signed out, use wallet sign-in. Pause recording while waiting for wallet confirmation. Resume when the dashboard opens.

### 3. Dashboard

Show:

- workspace name in top bar
- wallet/balance card
- orders/cards/privacy/system health cards
- no visible loading/flicker

### 4. Agents

Open `/agents`.

Show the bring-your-own-agent section and the Somnia Agents section. Use `research-agent` and the x402 endpoint above if editing fields.

### 5. Operator

Open `/operator`.

Show claim-code onboarding and webhook breaker controls. If signing live, create the claim code and save the tx hash. If not signing, show the form and say the operator can sign it.

### 6. x402

Open `/x402`.

Set:

- Server URL: `https://x402.20.208.46.195.nip.io`
- Agent slug: `research-agent`
- Result URI: `ipfs://arcpay-x402-result/research-agent`

Click:

1. `Get price`
2. `Check access`
3. Optional: `Pay` with wallet
4. Optional: `Verify`
5. Optional: `Unlock`

Capture the quote JSON/card. If you pay, capture the order ID and tx hash.

### 7. Policies

Open `/policies`.

Show global spend controls and explain that agent-specific limits are represented through agent/card/order policy plans and evidence requirements.

### 8. Cards

Open `/cards`.

Open create card drawer and show:

- Card slug: `research-card-001`
- Label: `Research Agent SOMUSD Card`
- Limit: `5`

Open fund drawer and show top-up `5`. If signing live, capture approve/top-up tx hashes.

### 9. Privacy

Open `/privacy`.

Show commitment intent and selective disclosure flow. Only say "released" if a release tx or audit record is visible.

### 10. DeFi Intent Evidence

Open `/swaps`, then `/yield`.

Show dreamDEX/Somnia Exchange/Somnex/Potion/custom DEX adapter options and the evidence rules. Do not call these executed trades without a tx hash.

### 11. Audit And Status

Open `/audit`, then `/status`.

Show recent records, tx evidence count, RPC/contracts/x402/docs/API health.

### 12. Developer Surfaces

Open:

- `/docs/overview`
- `/llms.txt`
- `/.well-known/mcp/server-card.json`
- npm package pages for CLI, MCP, and starter kit

Show that the project is usable by dashboard users, developers, and AI agents.

## Edit Notes

- Cut all wallet waiting time.
- Add captions for proof points.
- Keep every screen segment under 30 seconds.
- Use HyperFrames only for intro/outro polish.
- End under 5 minutes.

## Submission Links

- App: `https://arcpay-somnia.vercel.app`
- Repo: `https://github.com/ArcPayLabs/arcpay-somnia`
- Docs: `https://arcpay-somnia.vercel.app/docs/overview`
- Status: `https://arcpay-somnia.vercel.app/status`
- x402 discovery: `https://arcpay-somnia.vercel.app/platform/v2/x402/discovery/resources`
- CLI: `https://www.npmjs.com/package/@arcpaylabs/somnia-cli`
- MCP: `https://www.npmjs.com/package/@arcpaylabs/somnia-mcp`
- Starter kit: `https://www.npmjs.com/package/@arcpaylabs/somnia-x402-agent-starter`
