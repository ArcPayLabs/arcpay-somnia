# ArcPay Somnia Demo Video Plan

Target: 4:30-4:55. Hard cap: 5:00.

This is a working MVP demo. Do not call anything "executed" unless the screen shows one of: Somnia tx hash, x402 verification, Somnia Agent receipt, order/card/invoice state, or ArcPay audit record.

## Exact Recording Timeline

| Time | Route | Screen Action | Values To Use | Proof To Show |
| --- | --- | --- | --- | --- |
| 0:00-0:12 | `/` | Show landing hero, Somnia testnet badge, nav, Open App. | None | Live URL in address bar |
| 0:12-0:25 | `/sign-in` | Click wallet sign-in or show signed-in state. Pause if wallet prompt waits. | Wallet: funded Somnia operator wallet | Wallet challenge/session |
| 0:25-0:45 | `/dashboard` | Show workspace name, balance card, orders/cards/privacy/status cards. | Workspace: `Somnia agent treasury` | Dashboard loaded without flicker |
| 0:45-1:10 | `/agents` | Show BYO service agent form and official Somnia Agents block. | Slug: `research-agent`; Endpoint: `https://x402.20.208.46.195.nip.io/agent/research-agent/work`; Capabilities: `research, risk, x402` | Agent ID and x402 URL |
| 1:10-1:35 | `/operator` | Show claim-code onboarding and webhook circuit breaker. | Claim code: `claim-research-agent-001`; Metadata URI: `ipfs://agent-onboarding-pack`; Webhook: `https://agent.example/webhook` | Claim/webhook controls |
| 1:35-2:20 | `/x402` | Click `Get price`, click `Check access`, show payment requirement. If doing live payment, pause while wallet signs `Pay`, then show order id and `Verify`. | Server: `https://x402.20.208.46.195.nip.io`; Agent slug: `research-agent`; Result URI: `ipfs://arcpay-x402-result/research-agent` | HTTP 402 quote, order id, verification |
| 2:20-2:45 | `/policies` | Show spend limits, allowed tokens, blocked actions, allowlist. | Per-tx/daily values can stay demo defaults. | Global policy controls |
| 2:45-3:10 | `/cards` | Open create/fund drawers, show SOMUSD card fields. | Card slug: `research-card-001`; Label: `Research Agent SOMUSD Card`; Limit: `5`; Top-up: `5` | Card ID/contract path if signing |
| 3:10-3:35 | `/privacy` | Show privacy intent form and commitment/release language. | Memo URI: `selective-disclosure://workspace-auditor` | Commitment/nullifier flow |
| 3:35-3:55 | `/swaps` and `/yield` | Show dreamDEX, Somnia Exchange, Somnex, Potion/custom DEX adapter evidence requirements. | None | Intent/evidence wording, not fake execution |
| 3:55-4:20 | `/audit` and `/status` | Show audit timeline and status checks. | None | x402/API/contract health and audit rows |
| 4:20-4:45 | `/docs/overview`, `/llms.txt`, npm pages | Show docs, llms.txt, CLI/MCP/starter packages. | Packages: `@arcpaylabs/somnia-cli`, `@arcpaylabs/somnia-mcp`, `@arcpaylabs/somnia-x402-agent-starter` | Developer distribution layer |
| 4:45-4:55 | `/dashboard` or `/` | End on clean product screen. | None | App URL visible |

## Exact Tabs To Prepare

1. `https://arcpay-somnia.vercel.app`
2. `https://arcpay-somnia.vercel.app/sign-in`
3. `https://arcpay-somnia.vercel.app/dashboard`
4. `https://arcpay-somnia.vercel.app/agents`
5. `https://arcpay-somnia.vercel.app/operator`
6. `https://arcpay-somnia.vercel.app/x402`
7. `https://arcpay-somnia.vercel.app/policies`
8. `https://arcpay-somnia.vercel.app/cards`
9. `https://arcpay-somnia.vercel.app/privacy`
10. `https://arcpay-somnia.vercel.app/swaps`
11. `https://arcpay-somnia.vercel.app/yield`
12. `https://arcpay-somnia.vercel.app/audit`
13. `https://arcpay-somnia.vercel.app/status`
14. `https://arcpay-somnia.vercel.app/docs/overview`
15. `https://arcpay-somnia.vercel.app/llms.txt`
16. `https://arcpay-somnia.vercel.app/.well-known/mcp/server-card.json`
17. `https://www.npmjs.com/package/@arcpaylabs/somnia-cli`
18. `https://www.npmjs.com/package/@arcpaylabs/somnia-mcp`
19. `https://www.npmjs.com/package/@arcpaylabs/somnia-x402-agent-starter`

## Wallet Recording Rules

- Start recording before clicking wallet sign-in, then pause while waiting for slow prompts.
- Resume after signature or transaction confirmation.
- If a transaction is used, show the tx hash in ArcPay or the explorer.
- If a live transaction is not used, say "prepared" or "policy-gated", not "executed".

## HyperFrames Use

Use HyperFrames only for a short intro/outro:

- Intro text: `ArcPay Somnia`
- Subtitle: `Agent treasury, x402 payments, policy, privacy, and audit on Somnia Testnet`
- Quick labels: `Somnia Agents`, `x402`, `SOMUSD cards`, `Privacy intents`, `MCP + CLI`
- Outro: app URL, GitHub URL, docs URL

The core video must remain real screen capture.

## Captions To Add

- `Live Somnia Testnet app`
- `Bring-your-own-agent onboarding`
- `HTTP 402 paid resource`
- `Policy-gated spend`
- `SOMUSD agent card`
- `Privacy intent evidence`
- `Audit-ready execution`
- `Public CLI, MCP, and starter kit`
