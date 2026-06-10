# ArcPay Somnia Demo Video Plan

Target: 4:30-4:55. Hard cap: 5:00.

## Recording Principle

This is a product demo, not a feature tour. Show the minimum number of screens needed to prove:

1. ArcPay solves a real agent treasury problem.
2. It is live on Somnia Testnet.
3. x402, Somnia Agents, policy, privacy, audit, and developer tooling work together.
4. Claims are backed by visible evidence: endpoint responses, status pages, tx/order/receipt fields, npm packages, docs, or QA report.

Do not show loading time, wallet waiting time, or long scrolling. Cut between confirmed states.

## Core Wow Path

| Time | Screen | What To Do | Voiceover Focus |
| --- | --- | --- | --- |
| 0:00-0:15 | Landing | Open `https://arcpay-somnia.vercel.app`; show hero, nav, Somnia testnet badge. | ArcPay is the control plane for agent payments and treasury policy. |
| 0:15-0:35 | Problem proof | Scroll to product sections or show dashboard preview. | Agents can pay for tools, but operators need budgets, receipts, privacy, and audit. |
| 0:35-0:55 | Sign-in | Click Open App / Sign in; approve wallet signature if recording live. | Wallet-first onboarding; workspace is account-backed and cross-device after sign-in. |
| 0:55-1:20 | Dashboard | Show cards for agents, orders, x402, privacy, audit/status. | One operating console for agent businesses. |
| 1:20-1:55 | Agents | Show bring-your-own-agent and official Somnia Agents. Copy/open Somnia Agents payload if useful. | Somnia LLM Parse Website, LLM Inference, and JSON API Request receipts can become ArcPay evidence. |
| 1:55-2:35 | x402 | Click Quote, Check 402, show payment requirement, order/verification/unlock fields. If tx is live, show tx/order evidence. | HTTP 402 paid resources for APIs, MCP tools, and agent-to-agent work. |
| 2:35-3:05 | Policies + Privacy | Show policy controls, then privacy intent page. | Operators set spending rules and privacy boundaries before agents move funds. |
| 3:05-3:35 | Swaps/Yield | Show dreamDEX/Somnia Exchange/Somnex/Potion/custom DEX adapters and evidence requirements. | DeFi routes are intent and evidence flows, not fake “quote equals done” screens. |
| 3:35-4:10 | Audit + Status | Show audit, analytics, status, `/api/somnia/agents/status` or `/api/status`. | Every flow leaves an inspectable trail. |
| 4:10-4:40 | Developer layer | Show docs, npm packages, `llms.txt`, MCP card, OpenAPI/API catalog. | ArcPay is also a developer distribution layer for other Somnia builders. |
| 4:40-4:55 | Close | Return to dashboard or landing. | ArcPay turns agent payments into a usable treasury OS. |

## Exact Browser Tabs To Prepare

1. `https://arcpay-somnia.vercel.app`
2. `https://arcpay-somnia.vercel.app/sign-in`
3. `https://arcpay-somnia.vercel.app/dashboard`
4. `https://arcpay-somnia.vercel.app/agents`
5. `https://arcpay-somnia.vercel.app/x402`
6. `https://arcpay-somnia.vercel.app/policies`
7. `https://arcpay-somnia.vercel.app/privacy`
8. `https://arcpay-somnia.vercel.app/swaps`
9. `https://arcpay-somnia.vercel.app/yield`
10. `https://arcpay-somnia.vercel.app/audit`
11. `https://arcpay-somnia.vercel.app/status`
12. `https://arcpay-somnia.vercel.app/docs/overview`
13. `https://arcpay-somnia.vercel.app/llms.txt`
14. `https://arcpay-somnia.vercel.app/.well-known/mcp/server-card.json`
15. `https://www.npmjs.com/package/@arcpaylabs/somnia-cli`
16. `https://www.npmjs.com/package/@arcpaylabs/somnia-mcp`
17. `https://www.npmjs.com/package/@arcpaylabs/somnia-x402-agent-starter`

## Live Wallet Inserts

Use wallet prompts only when they support the story. If a prompt or transaction takes too long, pause the recording and resume on the confirmed evidence state.

Capture if available:

- wallet connection / signature
- agent registration tx hash
- x402 order tx hash or order ID
- x402 verification response
- privacy intent tx hash or commitment
- audit record showing the created evidence

Do not say “executed” unless the video shows a tx hash, x402 verification, Somnia Agent receipt, or ArcPay audit record.

## HyperFrames Use

Use HyperFrames for a 5-8 second intro/outro, not the whole hackathon proof video.

Recommended intro:

- dark/warm ArcPay brand background
- text: “ArcPay Somnia”
- subtitle: “Agent treasury, x402 payments, policy, privacy, and audit on Somnia Testnet”
- quick animated labels: “Somnia Agents”, “x402”, “Privacy intents”, “MCP + CLI”

Recommended outro:

- app URL
- GitHub URL
- docs URL
- “Built for Somnia agent businesses”

The core submission video should still be real screen capture because judges need to see the product working.

## Editing Checklist

- 1080p or higher.
- Hide unrelated browser tabs/bookmarks if possible.
- Zoom to 110-125% when showing JSON/status pages.
- Add small captions for hard proof moments:
  - “Live Somnia Testnet app”
  - “HTTP 402 quote”
  - “Policy-gated order”
  - “Somnia Agent receipt support”
  - “Audit evidence”
  - “Public CLI/MCP/starter kits”
- Keep each screen under 30 seconds unless wallet signing is visible.
- Cut all dead time.
- End under 5 minutes.
