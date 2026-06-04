# ArcPay Somnia QA Report

Generated: 2026-06-04

## Automated Browser QA

- Public app: https://arcpay-somnia.vercel.app
- API checks: 10 / 10 passed
- Browser route checks: 22 / 22 passed
- Viewports: desktop 1440x1000, mobile 390x844
- Screenshot artifacts: `C:\Users\RICHEY_SON\Desktop\arcpay-qa-artifacts-rerun\somnia`

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
