# ArcPay Somnia Community Beta Product Spec

Branch: `community-beta-refinement`

Purpose: turn ArcPay Somnia from a strong technical MVP into a community-facing beta product that normal users, traders, teams, and builders can understand and use.

## Product Position

ArcPay Somnia is the easiest way to launch, fund, control, and monetize AI agents on Somnia.

It is not only for developers. It should work for:

- community users who want to create an agent
- traders who want budget-controlled strategy agents
- teams moving agent workflows from other chains to Somnia
- builders launching paid APIs or MCP tools
- operators who need treasury policy and proof

## Core User Promise

Create an agent workspace in minutes.

Give the agent a budget.

Let it get paid for work.

Track proof, points, and reputation.

## Main Beta Loop

1. Connect wallet.
2. Create workspace.
3. Pick an agent template.
4. Set the agent budget.
5. Publish a paid task or x402 endpoint.
6. Complete a testnet action.
7. Earn points.
8. Appear on leaderboard.
9. Share proof.
10. Invite another user or team.

## Recommended Access Model

Use invite waves, not fully open access on day one.

Why:

- it creates scarcity without being hostile
- it keeps support manageable
- it gives the community a reason to watch for the next wave
- it lets ArcPay fix onboarding issues before hundreds of users enter
- it gives Somnia clear progress updates: Wave 1, Wave 2, Wave 3

### Wave Structure

Wave 0: internal testers

- 5-10 trusted wallets
- goal: catch broken wallet/auth/transaction issues

Wave 1: Explorer community

- first 50 invite codes
- goal: public beta proof and first leaderboard

Wave 2: builders and teams

- next 100 invite codes
- goal: external agent endpoints, x402 tasks, starter-kit usage

Wave 3: traders and broader community

- next 250 invite codes
- goal: repeat usage, points, quests, social sharing

### Invite Code Rules

Each invite code should unlock:

- one workspace
- one wallet
- starter missions
- beta points
- optional referral code after the user completes at least one proof action

Do not give unlimited referrals immediately. Referrals should unlock after useful activity.

### Simple Access Copy

Public:

```text
ArcPay Somnia beta opens in waves.

Join with wallet or email. We send invite codes to the first testers in batches so we can support users properly and keep the leaderboard fair.
```

After signup:

```text
You are on the ArcPay Somnia beta list.

Wave 1 invite codes go to the first 50 testers. Complete your profile and watch Telegram/X for the next invite drop.
```

Invite email/message:

```text
Your ArcPay Somnia beta invite is ready.

Use code: ARCPAY-WAVE1-XXXX

Launch your first agent, complete one proof action, and claim your first beta points.
```

## User Segments

### Community User

Needs:

- simple agent templates
- clear missions
- points and rewards
- no heavy protocol wording
- proof they can share

Primary CTA:

Launch your first agent.

### Trader

Needs:

- strategy budget
- swap/yield proof
- risk controls
- leaderboards
- repeatable routes

Primary CTA:

Create a strategy agent.

### Builder

Needs:

- CLI
- MCP
- starter kit
- x402 endpoint docs
- receipts and audit evidence

Primary CTA:

Connect your agent endpoint.

### Team / Project

Needs:

- multi-agent treasury workspace
- policies
- invoices
- cards
- audit exports
- migration support

Primary CTA:

Bring your agent operations to Somnia.

## UI Language Rules

Use consumer language first.

| Avoid | Use |
| --- | --- |
| Register service metadata | Create your agent profile |
| Treasury policy enforcement | Set what your agent can spend |
| x402 protected resource | Get paid for agent work |
| Audit artifact | Proof |
| Commitment-based privacy intent | Private payment note |
| Agent spend vault | Agent card |
| DeFi adapter evidence | Trading proof |
| Operator controls | Team controls |

Keep technical names visible in docs, tooltips, and developer mode.

## Beta Missions

| Mission | User-facing label | Points |
| --- | --- | --- |
| Connect wallet | Enter Somnia beta | 50 |
| Create workspace | Start your agent treasury | 100 |
| Register agent | Launch your first agent | 250 |
| Set policy | Set an agent budget | 150 |
| Create x402 quote/order | Get paid for agent work | 300 |
| Create card | Issue an agent card | 200 |
| Create invoice | Bill for agent work | 150 |
| Privacy intent | Add private proof | 200 |
| Swap/yield proof | Complete a trading proof | 250 |
| Invite user | Bring a team to Somnia | 500 |

## Leaderboards

Leaderboards should make the beta social and competitive.

Initial boards:

- Top Operators
- Top Agents
- Top Builders
- Top Traders
- Top Teams
- Top x402 Services

Each leaderboard row should show:

- wallet or profile name
- points
- completed missions
- proof count
- last active time

## Agent Templates

### Research Agent

For paid research, market summaries, website parsing, and data verification.

Default capabilities:

```text
research, website-parse, data-verification, paid-x402-work
```

### Trading Assistant

For budget-controlled swap/yield/trading proof flows.

Default capabilities:

```text
market-watch, swap-proof, yield-proof, risk-check
```

### Market Data Agent

For JSON API reads, price data, and alerts.

Default capabilities:

```text
json-api, price-feed, alerting, oracle-proof
```

### Invoice Agent

For billing, payment requests, contractor payouts, and reminders.

Default capabilities:

```text
invoice, billing, payment-request, settlement-proof
```

### Community Agent

For support, FAQ, onboarding, and Discord/Telegram workflows.

Default capabilities:

```text
community-support, onboarding, faq, task-routing
```

## Explorer Day Beta Launch

What to announce:

ArcPay Somnia community beta is open for users and builders who want to launch agent workspaces, test paid x402 tasks, issue agent cards, and earn points for verified activity.

What to ask:

- Try the live app.
- Launch an agent.
- Complete one mission.
- Share feedback.
- Invite another builder.

What to measure:

- beta signups
- wallet connects
- agent launches
- x402 events
- cards
- invoices
- privacy intents
- swap/yield proofs
- CLI/MCP/starter kit installs
- points
- leaderboard participants

## Design Direction

The UI should feel:

- clean
- premium
- simple
- fast
- community-friendly
- less protocol-heavy

Avoid:

- giant text blocks
- too many technical acronyms on first screen
- orange/brown fallback visuals
- forms that feel like admin software
- empty states that do not tell the user what to do next

## Success Metrics

Short-term:

- 50 beta signups
- 20 connected wallets
- 10 launched agents
- 5 external builders using CLI/starter kit
- 3 teams testing x402 endpoint flows

Mid-term:

- 100+ beta users
- 50+ agent profiles
- 500+ recorded proof events
- weekly leaderboard activity
- Somnia DevRel support or ecosystem amplification

Long-term:

- ArcPay becomes the default agent treasury and x402 control layer for Somnia builders.
