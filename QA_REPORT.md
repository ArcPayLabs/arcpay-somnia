# ArcPay Somnia QA Report

Generated: 2026-06-09

## Automated Browser QA

- Public app: https://arcpay-somnia.vercel.app
- API checks: 10 / 10 passed on the latest local smoke sweep
- Browser route checks: 41 / 41 passed on the latest full route crawl
- Viewports: desktop 1440x1000, mobile 390x844
- Latest screenshot artifacts: `C:\Users\RICHEY_SON\Desktop\arcpay-somnia\qa-full-ui`
- Earlier walkthrough artifacts: `C:\Users\RICHEY_SON\Desktop\arcpay-qa-artifacts-rerun\somnia`

## Latest Cross-Chain Polish Sweep

- Production build passed with Next.js/Turbopack.
- Public API and agent-readiness endpoints returned `200` or expected `207` partial-status.
- Landing hero was adjusted to avoid cropped/oversized card rendering on desktop and mobile.
- Desktop and mobile route screenshots were generated for every discovered page route.
- Focused landing/topbar checks passed after the final hero and navigation polish.

## Operator Walkthrough QA

- Walkthrough screenshots: `C:\Users\RICHEY_SON\Desktop\arcpay-qa-artifacts-rerun\somnia-operator-walkthrough`
- Browser-local wallet session used: `0xd953da085934f77cea8a2fb7a32fd48e4b1c1458`
- Seeded local audit records were used to verify dashboard, audit, and analytics UI states without pretending to have new transaction proof.
- Non-signing interactions clicked:
  - `/agents`: copied official Somnia Agents payload.
  - `/x402`: quoted the live x402 endpoint and checked the protected HTTP 402 resource.
  - `/swaps`: saved a route intent.
  - `/yield`: saved a yield intent.

Walkthrough screenshots captured:

- `01-dashboard.png`
- `02-agents-click-copy-payload.png`
- `03-x402-after-quote.png`
- `04-x402-after-check-402.png`
- `05-privacy.png`
- `06-swaps-after-intent-click.png`
- `07-yield-after-intent-click.png`
- `08-cards.png`
- `09-invoices.png`
- `10-policies.png`
- `11-audit.png`
- `12-analytics.png`
- `13-status.png`

## Routes Checked

- `/`
- `/sign-in`
- `/beta`
- `/status`
- `/agents`
- `/x402`
- `/privacy`
- `/swaps`
- `/yield`
- `/analytics`
- `/dashboard`

Each route loaded on desktop and mobile without detected horizontal overflow.

## API Surfaces Checked

- `/.well-known/agent-skills/index.json`
- `/.well-known/mcp/server-card.json`
- `/.well-known/api-catalog`
- `/api/status`
- `/api/somnia/agents/status`
- `/api/somnia/defi/status`
- `/platform/v2/x402/discovery/resources`
- `/openapi.json`
- `/llms.txt`
- `/auth.md`

## Live Product Notes

- Official Somnia Agents are integrated into `/agents`, `/api/somnia/agents/status`, the developer-tools API, CLI, MCP, agent-skills discovery, and API catalog.
- x402 is live as ArcPay's Somnia HTTP 402 payment rail backed by the ArcPay order book.
- dreamDEX, Somnia Exchange, Somnex, Potion Swap, and custom DEX adapter flows are represented as policy-gated intent/evidence flows; completion requires venue evidence or a Somnia transaction hash.

## Manual Wallet QA Still Required

The automated pass does not click wallet extension prompts. Manual wallet QA should cover:

1. Connect funded Somnia wallet.
2. Create or load workspace.
3. Register an agent.
4. Create an x402 quote/order.
5. Create privacy intent evidence.
6. Create swap/yield intent evidence.
7. Confirm records appear in audit/status views.
