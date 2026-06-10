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

If signed out, use wallet sign-in.

What to show:

- Click `Connect Somnia wallet`.
- Pick MetaMask, Rabby, or the detected EVM wallet from the picker.
- Approve Somnia Testnet add/switch if prompted.
- Sign the ArcPay login challenge.

Pause recording while waiting for wallet confirmation. Resume when the dashboard opens.

Evidence to keep:

- Connected wallet address.
- The workspace name in the top bar.
- If the wallet prompt shows the chain switch, keep one quick cut of it.

### 3. Dashboard

Show:

- workspace name in top bar
- wallet/balance card
- orders/cards/privacy/system health cards
- no visible loading/flicker

### 4. Agents

Open `/agents`.

Show the bring-your-own-agent section and the Somnia Agents section.

Fill or point to:

- Agent slug: `research-agent`
- Endpoint: `https://x402.20.208.46.195.nip.io/agent/research-agent/work`
- Capabilities: `research, data verification, paid x402 work`
- Price: use the default or a small STT testnet amount.

If you sign registration:

- Save the tx hash.
- Click the explorer link after confirmation.
- Show the agent appears in the list.

### 5. Operator

Open `/operator`.

Show claim-code onboarding and webhook breaker controls.

Use:

- Claim code: `claim-research-agent-001`
- Agent slug: `research-agent`
- Metadata URI: `ipfs://agent-onboarding-pack`
- Webhook origin: `https://agent.example/webhook`

If signing live:

- Create the claim code.
- Save the tx hash.
- Show the claim code row or status update.

If not signing:

- Show that this is the operator-controlled onboarding path for external agents.

### 6. x402

Open `/x402`.

Set:

- Server URL: `https://x402.20.208.46.195.nip.io`
- Agent slug: `research-agent`
- Result URI: `ipfs://arcpay-x402-result/research-agent`

Click:

1. `Get price` or `Quote`
2. `Check access`
3. Optional: `Pay` with wallet
4. Optional: `Verify`
5. Optional: `Unlock`

Capture:

- HTTP 402/payment requirement card.
- Order ID if created.
- Verification response.
- Unlock result only after verification.

If you pay, capture the order ID, tx hash, and explorer page.

### 7. Policies

Open `/policies`.

Show:

- Allowed network: Somnia Testnet.
- Spend limit fields.
- Approval thresholds.
- Risk floor.
- Contractor allowlist.

Important script point: policy settings are enforced before wallet signing. If a policy blocks a payment, the wallet should not be asked to sign.

### 8. Cards

Open `/cards`.

Open create card drawer and show:

- Card slug: `research-card-001`
- Label: `Research Agent SOMUSD Card`
- Limit: `5`

Open fund drawer and show top-up `5`.

If signing live:

- Approve SOMUSD if needed.
- Top up the card.
- Capture approve/top-up tx hashes.
- Freeze and reactivate the card to show spend controls.

If not signing:

- Show the card policy fields and state that completion requires a tx hash.

### 9. Privacy

Open `/privacy`.

Show:

- Commitment generation.
- Encrypted memo URI: `selective-disclosure://workspace-auditor`
- Release/nullifier area.

Only say "released" if a release tx or audit record is visible.

### 10. DeFi Intent Evidence

Open `/swaps`, then `/yield`.

Show the live ArcPay Testnet Router first.

For `/swaps`:

- Amount: `0.01`
- Route: `STT -> SOMUSD`
- Venue: `ArcPay Testnet Router`
- Click `Get live quote`
- Click `Review and sign`
- Approve the wallet prompt if recording a live tx.
- Capture the tx hash and explorer link.

For `/yield`:

- Strategy: `ArcPay STT yield vault`
- Amount: `0.01`
- Action: `deposit`
- Click `Review deposit`
- Approve the wallet prompt if recording a live tx.
- Capture the tx hash and refreshed vault balance.

Then show dreamDEX, Somnia Exchange, Somnex, Potion, and custom DEX adapter options.

Show the evidence rules:

- quote
- venue/router
- slippage
- tx hash
- before/after balance
- audit record

Do not call these executed trades without a tx hash.

### 11. Audit And Status

Open `/audit`, then `/status`.

Show:

- recent records
- tx evidence count
- RPC health
- contracts health
- x402 health
- docs/API health

Open one explorer link if a tx hash exists.

### 12. Developer Surfaces

Open:

- `/docs/overview`
- `/llms.txt`
- `/.well-known/mcp/server-card.json`
- npm package pages for CLI, MCP, and starter kit

Show:

- CLI install command.
- MCP server package.
- x402 starter kit.
- agent metadata / llms.txt.

Script point: a developer can onboard an agent, create IDs, prepare x402 paid resources, issue card flows, and collect evidence without relying only on the dashboard.

### 13. Wallet And Explorer Proof

Open `/wallet`.

Show:

- wallet picker if disconnected
- connected signer
- STT balance
- SOMUSD balance
- explorer link
- action shortcuts to agents, orders, cards, and privacy

If a tx was created earlier, open its explorer URL and show:

- tx status
- from address
- contract address
- block number

## Edit Notes

- Cut all wallet waiting time.
- Add captions for proof points.
- Keep every screen segment under 30 seconds.
- Use HyperFrames only for intro/outro polish.
- End under 5 minutes.
- If a transaction is pending too long, cut away and resume only after it confirms.
- Do not narrate a feature as executed unless the UI shows a tx hash, order ID, API response, or audit record.

## Submission Links

- App: `https://arcpay-somnia.vercel.app`
- Repo: `https://github.com/ArcPayLabs/arcpay-somnia`
- Docs: `https://arcpay-somnia.vercel.app/docs/overview`
- Status: `https://arcpay-somnia.vercel.app/status`
- x402 discovery: `https://arcpay-somnia.vercel.app/platform/v2/x402/discovery/resources`
- CLI: `https://www.npmjs.com/package/@arcpaylabs/somnia-cli`
- MCP: `https://www.npmjs.com/package/@arcpaylabs/somnia-mcp`
- Starter kit: `https://www.npmjs.com/package/@arcpaylabs/somnia-x402-agent-starter`
