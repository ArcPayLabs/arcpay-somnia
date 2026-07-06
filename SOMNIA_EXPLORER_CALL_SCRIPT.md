# ArcPay Somnia Explorer Call Script

Use this for the Somnia Explorer community session.

Session date: July 6, 2026  
Format: project presentation, live demo, community Q&A  
Speakers: Ama leads product/community story. Henry handles architecture and technical answers.

## Simple Reply To Lisa

```text
July 6 at 14:00 UTC works for us.

ArcPay 1-liner:
ArcPay is a Somnia-native agent launchpad and treasury OS that lets users create, fund, control, monetize, and audit AI agents on Somnia Testnet.
```

## Recommended Flow

Total ArcPay presentation target: 12-15 minutes.

1. Ama: 60-second intro.
2. Ama: problem and user story, 2 minutes.
3. Henry: architecture and Somnia integration, 3 minutes.
4. Henry: live demo, 5-7 minutes.
5. Ama: community beta launch and ask, 1-2 minutes.
6. Q&A: both, with Henry taking technical questions.

## Speaker Roles

Ama should sound like the product/community lead:

- What problem ArcPay solves.
- Who should use it.
- Why it matters to Somnia users.
- How community beta works.
- What feedback we want.

Henry should sound like the technical founder:

- How contracts, x402, Somnia Agents, policies, records, and proof fit together.
- What is live on Somnia Testnet.
- What is roadmap.
- What security and privacy boundaries are honest.
- How builders can integrate using CLI/MCP/starter kits.

## Background Story

Use this if Lisa asks how ArcPay started, or as a short human intro before the demo.

```text
The idea came from a simple problem we kept seeing while building agent products:

agents are becoming easier to create, but the operating layer around them is still missing.

If an agent can earn, spend, call paid tools, or work for a user, somebody needs to answer practical questions:
who controls the wallet, what is the budget, what can it pay for, how do we prove work was done, and how does a normal user understand what happened?

ArcPay started as that control layer. We wanted to make agent finance feel simple for users, but still rigorous enough for builders and teams.

Somnia is a strong fit because the ecosystem is focused on real-time agentic apps. ArcPay gives those agents a product layer: launch, budget, payment, proof, reputation, and community feedback.
```

Short version:

```text
We came up with ArcPay because agents need more than chat. They need wallets, budgets, payments, and proof. ArcPay is the product layer that lets normal users and teams launch and control agents on Somnia without thinking like smart contract engineers.
```

## Community Beta Access Flow

Use this when introducing the beta form.

```text
For the beta, we are not opening everything at once.

The public page is a waitlist. Users submit an email, Telegram handle, and, if they already have one, a Somnia wallet. We review the queue, add approved wallets to the access list, and send invite codes through Telegram in waves.

That lets us support early users properly, prevent spam, and learn from people who actually want to create agents, complete quests, and test payments on Somnia.
```

If asked why not fully open:

```text
Because this is still a hands-on community beta. We want early users to have support, and we want the leaderboard and quests to reflect real activity instead of empty signups or spam wallets.
```

If asked how users are approved:

```text
We review beta requests from the admin queue. For selected users, we mark them as invited or active, send an invite code through Telegram from @TheLuckyReborned, and add their wallet to the approved beta flow. That gives us a controlled way to scale from the first 50 users to the next waves.
```

## Opening Script

### Ama - 45-60 seconds

```text
Hi everyone, thanks for having us.

I’m Ama, co-founder of ArcPay, and I’m here with Henry, who leads the technical side.

ArcPay is a Somnia-native agent launchpad and treasury OS.

The simple idea is this: as more people launch AI agents, those agents need wallets, budgets, payments, proof, and rules. They should not just be chatbots. They should be able to earn, spend safely, and leave an audit trail.

ArcPay lets a user create an agent workspace, launch an agent from a template, set a budget, expose paid work through x402-style payments, issue an agent card, create privacy intents, and track proof through quests and leaderboards.

For the community beta, we want to make this simple enough for normal Somnia users, traders, and teams, not only developers.
```

### Henry - 60-90 seconds

```text
Technically, ArcPay is built as a control layer around Somnia Testnet.

We have smart contracts for agent registration, order settlement, treasury policy, spend cards, invoices, privacy intents, risk, reputation, and operator controls.

The app also has an x402 payment gateway, API routes, an MCP interface for AI agents, CLI tooling, starter kits, and audit records that mirror activity into the dashboard.

For Somnia specifically, we also connect to the Somnia Agents direction. The way we think about this is: Somnia agents can produce execution and data receipts, while ArcPay gives operators the payment, budget, and proof layer around those agents.

So today we’ll show the community beta path: create or enter a workspace, launch an agent, complete quests, and see how proof becomes points and leaderboard activity.
```

## Demo Script

Keep the demo short. Do not open every page. Stay in community mode.

### Demo Route 1: Landing / Beta

Open:

```text
https://arcpay-somnia.vercel.app/beta
```

Ama says:

```text
This is the public beta entry point.

We are opening access in waves so the product stays supported and we can learn from real users.

The form is intentionally simple: email, Telegram, wallet, and invite code if they already have one.

We review the queue, add approved wallets, and send invite codes through Telegram. Wave one is focused on users and teams who want to launch agents, test paid work, create proof, and give feedback.
```

Show:

- email field
- Somnia wallet field
- Telegram field
- optional invite code
- "Request beta access"

Do not spend more than 45 seconds here.

### Demo Route 2: Onboarding

Open:

```text
https://arcpay-somnia.vercel.app/onboard
```

Henry says:

```text
After access, users enter with a wallet or beta email.

Wallet login creates or resumes one ArcPay account per wallet. That matters because the agent workspace should be tied to the operator who signs transactions and controls spend.
```

Action:

- connect wallet if not already connected
- enter dashboard

Fallback if wallet takes time:

```text
If the wallet prompt takes a moment, the important point is that the app uses the connected Somnia wallet as the operator identity. Every live write still requires the wallet signature.
```

### Demo Route 3: Dashboard

Open:

```text
/dashboard
```

Ama says:

```text
This is the community beta dashboard.

Instead of overwhelming users with every treasury module first, we show the next actions: launch an agent, create paid work, issue a card, create private proof, and earn beta points.
```

Show:

- beta points card
- mission cards
- leaderboard preview
- latest activity

Do not open all treasury pages.

### Demo Route 4: Launch Agent

Open:

```text
/launch-agent
```

Ama says:

```text
This is the core user action. We want launching an agent to feel like creating a profile.

A user chooses a template, sets what the agent does, how it gets paid, and what budget or proof rules apply.
```

Action:

- click one template, recommended: Research Agent or Market Data Agent
- it should open `/agents?template=...`
- the registration drawer should prefill the template

Henry says:

```text
Under the hood this becomes an agent registry entry on Somnia.

The slug becomes an agent ID. The endpoint is the service that can be called. The price is the STT amount required before work unlocks. This ties into x402 and order evidence.
```

If you sign a tx:

```text
Now I’m signing the registration transaction. Once it confirms, ArcPay writes the agent record locally and mirrors it into the audit records endpoint.
```

If you do not sign:

```text
For the live session I’ll avoid waiting on multiple transactions. The flow is the same: wallet signs, contract records the agent, and the dashboard marks the quest as complete once the record exists.
```

### Demo Route 5: Quests

Open:

```text
/quests
```

Ama says:

```text
Quests turn the beta into a simple loop.

Users are not just clicking buttons. A quest is marked complete when ArcPay sees the relevant wallet session or proof record: agent registration, x402 order, card event, privacy intent, or swap/yield proof.
```

Henry says:

```text
The quest page reads the same record trail that powers the audit system.

So if a user registers an agent, creates an x402 order, issues a card, or creates a privacy intent, the quest can detect that from the stored ArcPay record. We’re not treating empty clicks as progress.
```

Show:

- total beta points
- done/not done states
- “Refresh proof”

### Demo Route 6: Leaderboard

Open:

```text
/leaderboard
```

Ama says:

```text
The leaderboard is how we create a community loop.

Early users and teams can see progress based on real actions: agents launched, paid work, proof records, and trading or privacy flows.
```

Henry says:

```text
Right now this reads workspace records and scores them directly. The next production step is to make the leaderboard global across beta users, with stronger anti-spam checks and public proof links.
```

### Optional Demo Route 7: x402

Open only if time:

```text
/x402
```

Henry says:

```text
x402 is the paid work rail.

An agent or user calls a protected endpoint. If payment is required, ArcPay returns a 402-style quote. The operator can create or verify an order, fulfill the task, and unlock the result with evidence.

This is how agents can sell work without requiring a SaaS account, subscription, or manual billing flow.
```

### Optional Demo Route 8: Cards / Privacy

Only show one.

Cards:

```text
Cards are controlled budgets for agents. The operator can issue a SOMUSD card, top it up, activate or freeze it, and keep spend inside policy.
```

Privacy:

```text
Privacy intents let an operator commit to sensitive payment or memo details without exposing everything immediately. It is not a full ZK shielded pool yet. It is a practical privacy-intent layer with selective disclosure and audit proof.
```

## Closing Script

### Ama

```text
For the community beta, we want to onboard users in waves.

Wave one is for the first group of Somnia users, traders, builders, and teams who want to create an agent workspace, launch an agent, complete proof actions, and give feedback.

The goal is simple: make agent creation on Somnia feel understandable and useful for normal users, while still giving builders the infrastructure they need.
```

### Henry

```text
From the technical side, we want feedback on three things:

First, the agent launch flow.
Second, the x402 and payment proof flow.
Third, deeper integration with official Somnia Agents receipts and future Somnia infrastructure.

If you are building an agent, paid API, trading bot, or automation workflow on Somnia, ArcPay can be the wallet, budget, payment, and proof layer around it.
```

## Technical Q&A

### How did you come up with the idea?

```text
We were building around AI agents and kept running into the same missing layer.

Agents can answer questions or run tasks, but if they become useful, they need payments, budgets, permissions, receipts, and reputation.

The idea for ArcPay was to make that operating layer feel like a normal product: launch an agent, give it a controlled budget, let it sell paid work, and keep proof of everything it does.

Somnia made sense because it is focused on agentic apps and fast execution, so we can build the user-facing layer around that ecosystem early.
```

### How does beta access work?

```text
Users join the waitlist with email, Telegram, and wallet.

We review the queue, approve wallets in waves, send invite codes through Telegram from @TheLuckyReborned, and then those users enter the app, create an agent workspace, complete quests, and appear on the leaderboard.

The reason for waves is support and quality. We want the first community users to get help and we want beta points to come from real activity.
```

### How is ArcPay using Somnia?

```text
ArcPay uses Somnia Testnet as the execution layer for the core agent finance primitives.

We deployed contracts for agent registry, order book, treasury policy, spend cards, invoices, privacy intents, risk, reputation, and operator controls.

The frontend uses those contracts through wallet-signed EVM transactions. The backend surfaces status, records, x402 payment checks, developer tools, and MCP endpoints.
```

### What exactly happens when an agent is launched?

```text
The user selects a template and fills an agent profile.

That creates a slug, endpoint, capability list, and price.

The slug is hashed into an agent ID. The wallet signs a transaction to register the agent on the AgentRegistry contract.

After confirmation, ArcPay saves an audit record. Quests and leaderboard scoring can detect that record.
```

### What is x402 in ArcPay?

```text
x402 is the HTTP payment pattern for paid agent work.

The client requests a protected resource. If payment is required, the server returns payment requirements. The operator creates or verifies an on-chain order. Once the payment or order proof is valid, the protected result can be unlocked.

In ArcPay, x402 is tied to agent IDs, order evidence, and audit records so agents can sell work while operators still control spend.
```

### Are quests real or just UI?

```text
They are tied to wallet/session state and ArcPay records.

For example, the wallet quest completes when the wallet session exists. The agent quest completes when an agent record exists. x402 completes when an x402 or order record exists. Cards, privacy, swap, and yield quests also look for their corresponding proof records.

So the current version is not just a static checklist. It reads the activity trail.
```

### Is the leaderboard fully global?

```text
The current beta leaderboard reads the active workspace records and scores verified actions.

The next step is a global leaderboard across beta users, backed by indexed records and stronger anti-spam logic. We intentionally started with workspace-level proof because it is safer for beta and easier to validate live.
```

### How does Somnia Agents fit into this?

```text
Somnia Agents can provide execution and data receipts.

ArcPay’s role is the finance and control layer around those receipts: who pays, how much an agent can spend, whether a task is approved, where the proof is stored, and how the result affects reputation or leaderboard progress.

The next deeper integration is attaching official Somnia Agent receipts directly to ArcPay orders before settlement.
```

### What official Somnia agent IDs are you aware of?

```text
The app currently maps the public Somnia Agents listed for testnet:

LLM Parse Website:
12875401142070969085

LLM Inference:
12847293847561029384

JSON API Request:
13174292974160097713

The testnet platform contract is:
0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776

The agent registry is:
0x08D1Fc808f1983d2Ea7B63a28ECD4d8C885Cd02A
```

### Is privacy fully private?

```text
No, and we should be precise about that.

The current product has a privacy-intent layer. It lets operators create commitments, encrypted memo pointers, and selective disclosure records.

It is useful for agent treasury workflows where not every detail should be public immediately, but it is not a full ZK shielded pool yet.
```

### What is live today vs roadmap?

```text
Live today:
wallet onboarding, workspace flow, agent templates, agent registry, x402 gateway flow, orders, policies, cards, invoices, privacy intents, audit records, quests, leaderboard scoring, CLI, MCP, starter kits, docs, and status checks.

Roadmap:
global leaderboard, official Somnia Agent receipt settlement, deeper real-time subscriptions, stronger anti-spam scoring, more consumer templates, and more native Somnia DeFi venue integrations as the ecosystem matures.
```

### Why does ArcPay matter for Somnia adoption?

```text
Somnia is positioning around fast agentic execution.

For adoption, users need more than primitives. They need clear actions: create an agent, give it a budget, sell work, prove completion, and share progress.

ArcPay turns those primitives into a product loop that community users and builders can understand.
```

### Who are the first users?

```text
First users are:

Somnia community users who want to try agent apps.
Traders who want budget-controlled assistants.
Builders launching paid APIs or automation agents.
Teams managing multiple agents or contractor workflows.
Hackathon teams that need payment, proof, and policy infrastructure.
```

### How do developers integrate without using the dashboard?

```text
Developers can use the CLI, MCP server, and starter kit.

The CLI helps generate IDs, inspect deployments, prepare x402 flows, create privacy commitments, and run smoke checks.

The MCP server lets AI agents ask ArcPay for deployment data, payment plans, privacy/invoice helpers, and evidence requirements.

The starter kit is a plug-and-play client for requesting a paid resource, reading the quote, verifying an order, and unlocking the result.
```

## Community Q&A Short Answers

### Can I use ArcPay if I am not a developer?

```text
That is exactly the direction. The beta is being simplified so users can start from templates, complete quests, and understand what to do next without reading smart contract docs.
```

### Can I earn from my agent?

```text
The product direction is yes: publish an agent service, set a price, and let users or other agents pay for work through the x402 flow.
```

### Why invite waves?

```text
Because we want feedback quality, support, and clean onboarding. Wave one starts small, then every wave unlocks more users and features.
```

### Will there be points?

```text
Yes. Beta points are tied to useful actions like launching agents, paid work, cards, privacy proof, and referrals. We want points to reward real activity, not empty clicks.
```

### What do you want from the Somnia community?

```text
Test the beta, launch an agent, tell us what feels confusing, and bring us use cases. If you already have a bot, API, data service, or agent idea, we want to help you turn it into a paid Somnia workflow.
```

## If Something Breaks During Demo

### Wallet prompt slow

```text
The wallet prompt can take a moment on testnet. The important piece is that ArcPay requires wallet signatures for live writes. I’ll continue with the already indexed proof while the wallet catches up.
```

### Transaction slow

```text
This is why the audit trail matters. We do not claim completion until there is a transaction hash or saved proof record. For the call, I’ll show the flow and the proof surfaces rather than waiting on every confirmation.
```

### x402 endpoint slow

```text
The x402 server is an external runtime, so if it is slow, the fallback is to show the quote and verification model. The important architecture is that protected resources unlock only when payment/order evidence is valid.
```

### Question is too deep

```text
Good question. I want to answer that precisely, so I’ll share the exact contract/API reference after the session rather than guessing live.
```
