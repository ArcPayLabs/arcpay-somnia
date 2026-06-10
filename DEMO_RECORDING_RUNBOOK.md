# ArcPay Somnia Demo Recording Runbook

Use this as the exact recording checklist.

## Before Recording

1. Open a clean browser profile if possible.
2. Connect the funded Somnia wallet.
3. Keep only the demo tabs open.
4. Set browser zoom to 100% for app screens and 125% for JSON/status pages.
5. Keep `DEMO_VOICEOVER.txt` ready for ElevenLabs.
6. Record screen only first. Add voiceover after in CapCut or HyperFrames.

## Screen Recording Path

### 1. Landing And Problem

Open `https://arcpay-somnia.vercel.app`.

Show:

- hero
- Somnia testnet badge
- navigation
- Product/Solutions section if visible

Do not spend more than 20 seconds here.

### 2. Auth And Workspace

Click `Open App`.

Show:

- sign-in page
- wallet connect/signature if clean
- dashboard loaded
- workspace name in top bar
- workspace dropdown showing saved workspaces if available

If wallet prompt stalls, pause and resume after signature.

### 3. Agent Layer

Open `/agents`.

Show:

- bring-your-own-agent onboarding
- official Somnia Agents block
- IDs for LLM Parse Website, LLM Inference, JSON API Request
- Somnia platform contract and AgentRegistry

Optional click:

- copy payload or open status endpoint.

### 4. x402 Payment Rail

Open `/x402`.

Show:

- x402 gateway URL
- protected resource
- click Quote
- click Check 402
- payment requirements
- order/verify/unlock area

If you create a real order, capture:

- order ID
- tx hash
- verification response

### 5. Policy And Privacy

Open `/policies`.

Show:

- budget/spend policy
- pause/approval controls
- allowlist or evidence controls

Open `/privacy`.

Show:

- privacy commitment
- memo URI
- release/evidence concept

Only claim live execution if the recording shows the tx or saved audit record.

### 6. DeFi Intent Evidence

Open `/swaps`.

Show:

- dreamDEX / Somnia Exchange / Somnex / Potion / custom DEX adapter options
- intent and evidence wording

Open `/yield`.

Show:

- yield routing/evidence controls
- policy gate

Do not call these “executed trades” unless there is a transaction hash.

### 7. Audit, Status, And Developer Surfaces

Open `/audit`.

Show:

- evidence timeline
- record categories

Open `/status`.

Show:

- live health checks
- Somnia Agents status
- x402/API health

Open docs/dev tabs:

- `/docs/overview`
- `/llms.txt`
- `/.well-known/mcp/server-card.json`
- npm package pages

### 8. Close

Return to dashboard or landing.

End with:

- app link
- GitHub link
- docs link
- “Built for Somnia agent businesses”

## Voiceover Timing

Use `DEMO_VOICEOVER.txt`.

If the voiceover is longer than the screen recording:

- cut the “not only an app” developer paragraph shorter
- speed audio to 1.05x
- remove repeated examples

If the screen recording is longer:

- add captions instead of more voiceover
- avoid filler narration

## Submission Links

- App: `https://arcpay-somnia.vercel.app`
- Repo: `https://github.com/ArcPayLabs/arcpay-somnia`
- Docs: `https://arcpay-somnia.vercel.app/docs/overview`
- Status: `https://arcpay-somnia.vercel.app/status`
- x402 discovery: `https://arcpay-somnia.vercel.app/platform/v2/x402/discovery/resources`

