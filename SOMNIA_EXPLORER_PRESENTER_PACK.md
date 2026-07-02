# ArcPay Somnia Explorer Presenter Pack

Use this for the Somnia Ecosystem Explorer session on Discord.

Target session format:

- Project presentation: 8-12 minutes
- Live demo: 12-18 minutes
- Community Q&A: remaining time

Core rule while presenting:

- Keep it simple for the community.
- Be precise for DevRel.
- Do not claim execution without visible proof: tx hash, order ID, API response, audit record, receipt, or explorer link.

## One-Line Positioning

ArcPay is a treasury control plane for AI-agent businesses on Somnia: it lets teams onboard agents, enforce spend policy, route paid work through x402, issue SOMUSD cards, create privacy intents, and keep auditable proof of every action.

## 30-Second Intro

Hi everyone, I’m Henry Sam Marfo, founder of ArcPay.

ArcPay is a Somnia-native treasury operating system for AI-agent businesses. The idea is simple: if agents are going to discover services, request work, pay APIs, and coordinate with other agents, teams need a safe financial control layer around them.

ArcPay gives operators one workspace to register agents, set spend policies, escrow paid work, use x402-style HTTP payments, issue SOMUSD agent cards, create privacy intents, and export audit evidence from Somnia Testnet.

## 90-Second Intro

Hi everyone, I’m Henry Sam Marfo, founder of ArcPay.

ArcPay is a Somnia-native treasury control plane for AI-agent businesses.

The problem we’re solving is that agents are becoming more capable, but their financial operations are still messy. An agent might need to pay for research, call a paid API, hire another agent, route a swap, or produce a receipt. But without a treasury layer, operators do not have strong control over limits, approvals, risk, privacy, or proof.

ArcPay puts those workflows into one operating system on Somnia Testnet. Agents can be registered with metadata and capabilities. Work can be paid through x402-style HTTP 402 flows and escrowed orders. Operators can enforce policy before funds move. Teams can issue SOMUSD-backed spend cards, create invoices, store privacy intents, and keep audit records for each action.

The goal is not just a dashboard. ArcPay is also a developer distribution layer. We ship a CLI, MCP server, starter kit, OpenAPI, `llms.txt`, and agent-ready metadata so Somnia builders can plug their own agents into ArcPay instead of rebuilding payment, policy, and evidence infrastructure from scratch.

Today I’ll show the product, the architecture, and how it can help builders create safer agent-commerce flows on Somnia.

## Main Presentation Script

### Slide 1: What ArcPay Is

ArcPay is a treasury operating system for AI-agent businesses on Somnia.

When I say “agent business,” I mean any product where AI agents perform paid work, request services, call paid APIs, or coordinate with other agents.

ArcPay gives those agents a financial control layer: identity, policy, payments, escrow, cards, privacy intents, invoices, and audit evidence.

The simplest way to understand it is:

ArcPay is the business account for agents.

### Slide 2: The Problem

AI agents can already reason and call tools, but money movement is still unsafe.

If an agent pays for a service, the operator needs to know:

- Is this agent allowed to spend?
- What is the spending limit?
- What service is being paid for?
- Was the work actually delivered?
- Is there a transaction hash or receipt?
- Can the result be audited later?
- Can sensitive memo details stay private until release?

Without that layer, teams either keep everything manual, or they give agents too much financial freedom too early.

ArcPay is built to solve that gap.

### Slide 3: Why Somnia

Somnia is a strong fit because it is built for high-throughput, real-time, agentic applications.

ArcPay uses Somnia Testnet as the execution layer for agent registration, order escrow, policy enforcement, privacy intents, SOMUSD cards, invoices, risk checks, and reputation records.

The product also aligns with Somnia’s agent direction. Official Somnia Agents like LLM Parse Website, LLM Inference, and JSON API Request can produce receipts and outputs that ArcPay can attach to paid work and audit records.

So Somnia gives us the fast execution environment, and ArcPay adds the operating layer for agent treasury and agent commerce.

### Slide 4: Product Modules

ArcPay has several connected modules.

The agent registry lets builders onboard agents with an endpoint, capabilities, metadata, and price.

The x402 module exposes paid agent work over HTTP 402, so another client or agent can request a resource, see payment requirements, pay through order escrow, and unlock the result.

Policies define what agents can spend, which wallets are allowed, what approval thresholds apply, and when actions should be blocked.

SOMUSD cards let an operator issue card-like budgets to agents, top them up, freeze them, and reactivate them.

Privacy intents let teams create commitment-based payment intents with encrypted memo URIs and delayed release.

Invoices and contractor payments support normal business workflows.

Audit records tie the whole system together: every important action should produce evidence.

### Slide 5: Developer Layer

ArcPay is also built for developers.

We publish:

- CLI package
- MCP server
- x402 starter kit
- OpenAPI docs
- `llms.txt`
- agent skills metadata
- API catalog
- live docs

That means a builder does not need to only use the dashboard. They can onboard an agent from the CLI, let an AI agent query ArcPay through MCP, or use the starter kit to build paid x402 services on Somnia.

This is important because ecosystem adoption depends on developers being able to integrate quickly.

### Slide 6: What Makes It Different

Most payment demos stop at “agent pays endpoint.”

ArcPay asks the next questions:

- Was the endpoint trusted?
- Was the spend allowed?
- Was the work fulfilled?
- Was there proof?
- Can the operator audit it later?
- Can another developer reuse this flow?

That is why ArcPay combines x402 payments, treasury policy, escrow, cards, privacy intents, reputation, and developer tooling into one system.

## Live Demo Runbook

Use this order. Do not rush.

### Demo Segment 1: Landing And Product Story

Open:

```text
https://arcpay-somnia.vercel.app
```

Show:

- Somnia Testnet positioning
- Open App button
- Product navigation
- Clean startup-level landing page

Say:

This is the live ArcPay Somnia app. The public side explains the product, and the app side is where an operator manages agent treasury operations.

### Demo Segment 2: Wallet Sign-In And Workspace

Open app.

Show:

- Wallet sign-in
- Workspace screen or dashboard
- Connected wallet address
- Somnia Testnet context

Say:

ArcPay is wallet-first. A wallet signs into the workspace, and the operator can manage agents, orders, policies, cards, invoices, privacy, and audit records from one place.

If wallet prompt appears:

Say:

This is a normal wallet signature, not a transaction. It creates or resumes the ArcPay workspace for this wallet.

### Demo Segment 3: Dashboard

Show:

- Treasury overview
- Agent/order/card/privacy/status cards
- Any health indicators

Say:

The dashboard gives the operator a quick view of agent treasury activity: which agents are active, what orders exist, what policies are in place, and whether the system is healthy.

### Demo Segment 4: Agents

Open `/agents`.

Use:

```text
Agent slug: research-agent
Endpoint: https://x402.20.208.46.195.nip.io/agent/research-agent/work
Capabilities: research, data verification, paid x402 work
Price: small STT amount
```

Show:

- Register/load agent
- Capability metadata
- Official Somnia Agents section if present
- Platform contract / registry / official agent IDs if present

Say:

This is where a builder brings their own agent into ArcPay. The agent gets a service slug, endpoint, capabilities, price, and metadata. Once registered, it can be discovered and hired through the treasury layer.

ArcPay can also work with official Somnia Agent outputs. For example, if a Somnia Agent produces a receipt from LLM Parse Website or JSON API Request, ArcPay can attach that receipt as evidence before settling paid work.

### Demo Segment 5: x402 Paid Agent Work

Open `/x402`.

Use:

```text
Server URL: https://x402.20.208.46.195.nip.io
Agent slug: research-agent
Result URI: ipfs://arcpay-x402-result/research-agent
```

Click:

1. Quote/check payment requirement
2. Create/pay order if you are doing live tx
3. Verify
4. Provider fulfill
5. Unlock

Say:

This is the x402 flow. A client or another agent requests paid work. The server responds with HTTP 402 payment requirements. ArcPay creates or verifies an on-chain order. The result only unlocks when the payment and fulfillment evidence are valid.

This matters because x402 makes payment easy, but ArcPay adds the missing business controls: policy, escrow, verification, and audit.

If live order succeeds:

Say:

Here is the order ID and transaction proof. This is the difference between a mock demo and an auditable workflow.

If not executing live:

Say:

For this community walkthrough I’m showing the flow safely. In the final operator path, completion requires an order ID, API response, or transaction hash before ArcPay marks work as done.

### Demo Segment 6: Policies

Open `/policies`.

Show:

- Daily/hourly limit
- Approval threshold
- Risk floor
- Allowlist
- Emergency pause

Say:

Policies are the control layer before money moves. An agent should not be able to spend just because it can call a tool. ArcPay checks the treasury policy first, then lets the operator or agent proceed only inside the allowed rules.

This is important for real businesses because finance teams need predictable controls, not just autonomous execution.

### Demo Segment 7: SOMUSD Cards

Open `/cards`.

Use:

```text
Card slug: research-card-001
Label: Research Agent SOMUSD Card
Limit: 5
Top-up: 5
```

Show:

- Create card form
- Top-up/freeze/activate controls
- SOMUSD token

Say:

Cards are agent budgets. Instead of giving an agent broad wallet access, the operator can issue a SOMUSD-backed spend card with a limit, fund it, freeze it, and reactivate it.

This makes agent spending easier to reason about. Each agent can have a defined budget and a clear audit trail.

### Demo Segment 8: Privacy Intents

Open `/privacy`.

Use:

```text
Memo URI: selective-disclosure://workspace-auditor
Amount: small STT or SOMUSD amount
```

Show:

- Commitment
- Encrypted memo URI
- Nullifier/release area

Say:

Somnia does not need every treasury memo to be public at intent time. ArcPay uses privacy intents so the operator can commit to a payment or memo, keep sensitive details encrypted, and release proof later when needed.

This is not claiming full ZK privacy yet. It is a practical privacy-intent layer for agent treasury operations, with a roadmap toward deeper privacy as the ecosystem matures.

### Demo Segment 9: Swaps And Yield

Open `/swaps`, then `/yield`.

Show:

- Live STT -> SOMUSD route
- Live STT yield vault
- Adapter evidence list: dreamDEX, Somnia Exchange, Somnex, Potion Swap, custom DEX

Say:

For DeFi, ArcPay focuses on policy-gated execution and evidence. The built-in route supports live testnet swap and yield proof. For ecosystem venues like dreamDEX, Somnia Exchange, Somnex, Potion Swap, and custom DEX adapters, ArcPay prepares the route intent and requires venue evidence or a transaction hash before marking the action complete.

That rule is important: a quote is not enough. ArcPay needs proof.

### Demo Segment 10: Audit And Status

Open `/audit`, then `/status`.

Show:

- Records
- Health checks
- Contract status
- x402 status
- API/docs status

Say:

This is the proof layer. ArcPay is designed so each important action has evidence: transaction hash, order ID, API response, audit record, or external receipt.

The status page lets operators and reviewers see that the frontend, contracts, x402 server, docs, and APIs are live.

### Demo Segment 11: Developer Surfaces

Open:

```text
https://arcpay-somnia.vercel.app/docs/overview
https://arcpay-somnia.vercel.app/llms.txt
https://arcpay-somnia.vercel.app/.well-known/mcp/server-card.json
https://www.npmjs.com/package/@arcpaylabs/somnia-cli
https://www.npmjs.com/package/@arcpaylabs/somnia-mcp
https://www.npmjs.com/package/@arcpaylabs/somnia-x402-agent-starter
```

Say:

ArcPay is not only for people clicking a dashboard. Developers can install the CLI, run the MCP server, use the x402 starter kit, read the OpenAPI docs, and let agents discover the product through `llms.txt` and `.well-known` metadata.

This is how ArcPay becomes useful to the Somnia builder ecosystem, not just our own app.

## Architecture Explanation

Use this for DevRel and technical questions.

### Simple Version

ArcPay has five layers.

First, the frontend gives operators a workspace to manage agents, payments, cards, policies, privacy, and audit.

Second, the smart contracts handle the on-chain state: agent registry, treasury policy, escrow orders, invoices, spend cards, privacy intents, risk oracle, reputation, swap router, and yield vault.

Third, the x402 server exposes paid agent work over HTTP 402.

Fourth, the worker and Supabase records mirror events and activity into an operator-friendly audit layer.

Fifth, the developer layer gives builders CLI, MCP, starter kit, OpenAPI, `llms.txt`, and agent metadata.

### Technical Version

ArcPay Somnia uses Solidity contracts on Somnia Testnet.

The main contracts are:

- `AgentRegistry` for agent identity and capability metadata
- `TreasuryPolicy` for spend limits, thresholds, allowlists, and pause controls
- `AgentTreasury` for escrowed native funds
- `AgentOrderBook` for paid work lifecycle
- `AgentInvoiceBook` for STT/SOMUSD invoices
- `OperatorControls` for claim-code onboarding and webhook circuit breakers
- `SomniaAgentRiskOracle` for risk request/callback flows
- `AgentSpendCardVault` for SOMUSD-backed card budgets
- `SomniaPrivacyVault` for commitment-based privacy intents
- `AgentReputationBook` for order-backed reputation evidence
- `SomniaSwapRouter` for STT-to-SOMUSD testnet swap proof
- `SomniaYieldVault` for STT deposit/withdraw yield proof

The frontend is deployed on Vercel. The x402 gateway runs as a Node service. Records are written into Supabase-backed audit tables. The worker can reconcile contract events into records.

For agent integrations, ArcPay exposes:

- HTTP API routes
- x402 protected resources
- MCP server
- CLI
- starter kit
- OpenAPI
- `llms.txt`
- `.well-known` metadata

## Q&A Bank

### What problem are you solving?

Agents are getting better at taking action, but teams still need treasury controls. ArcPay solves the gap between autonomous agents and business-grade financial operations: policy, payment, escrow, privacy, evidence, and audit.

### Why does Somnia need ArcPay?

Somnia is built for fast, real-time agentic applications. ArcPay adds the operating layer those agents need when money is involved. It gives Somnia builders reusable infrastructure for paid agent work, budget controls, x402 resources, cards, privacy intents, and evidence.

### Is this an AI agent itself?

ArcPay is not a single agent. It is infrastructure for agent businesses. It lets agents register, get hired, pay for work, receive payments, follow policy, and produce evidence.

### How does this use Somnia specifically?

ArcPay deploys contracts on Somnia Testnet and uses Somnia as the execution layer for registry, policy, escrow orders, invoices, cards, privacy intents, risk, reputation, swap, and yield proof. It also aligns with Somnia Agents by attaching receipts and outputs as settlement evidence.

### How does x402 fit?

x402 is the paid-resource flow. A client requests a protected endpoint, receives HTTP 402 payment requirements, pays through ArcPay order escrow, verifies payment, and unlocks the result.

ArcPay adds the control layer around x402: policy, escrow, verification, audit records, and reputation.

### Is this real x402 or just a naming pattern?

ArcPay implements the HTTP 402 payment pattern for paid agent resources. The settlement proof on Somnia Testnet is a fulfilled ArcPay order. The current implementation is designed for Somnia agent payments and can evolve toward broader x402 interoperability as ecosystem standards mature.

### What is SOMUSD used for?

SOMUSD is used as the testnet stable-style unit for agent spend cards and business payment flows. Operators can issue card-like budgets to agents, top them up, freeze them, and track activity.

### What is the privacy layer?

The current privacy layer is a privacy-intent vault. It lets operators create commitment-based intents with encrypted memo URIs and delayed release/nullifier evidence.

It is not presented as full cryptographic privacy yet. It is a practical treasury privacy primitive that can evolve into deeper ZK or confidential execution later.

### How do official Somnia Agents fit?

Official Somnia Agents can produce outputs and receipts. ArcPay can treat those receipts as evidence for paid work. For example, if LLM Parse Website or JSON API Request produces an execution receipt, ArcPay can attach it to an order before settlement.

### What happens if an agent tries to spend too much?

The treasury policy should block the action before signing or settlement. Operators can set spend limits, allowed wallets, approval thresholds, risk floors, and emergency pause controls.

### Why not just use a wallet?

A wallet can hold funds, but it does not provide agent identity, service pricing, x402 paid work, order lifecycle, card budgets, privacy intents, reputation, or audit records. ArcPay is the business layer around the wallet.

### Who are the users?

Initial users are:

- Somnia builders launching agents
- AI-agent teams that need paid endpoints
- operators managing multiple autonomous services
- developers building x402 APIs or MCP tools
- hackathon teams that need agent payment infrastructure

### How do developers integrate?

They can use:

- dashboard onboarding
- CLI package
- MCP server
- x402 starter kit
- OpenAPI docs
- direct contract calls
- `.well-known` agent metadata

### What can another builder do with ArcPay?

A builder can onboard their agent, define a paid endpoint, quote payment requirements, accept an escrowed order, fulfill the result, and export evidence. They can also issue a card, create invoices, and attach receipts from external agent execution.

### Is this open source?

The repository is source-available for review, evaluation, and contribution. The x402 starter kit is MIT licensed so Somnia builders can reuse it freely. The full product is not licensed for unauthorized commercial cloning or rebranding.

### What is live today?

The live app, docs, contracts, x402 gateway, CLI, MCP package, starter kit, OpenAPI, `llms.txt`, and status surfaces are available. Testnet wallet actions can be demonstrated with a funded Somnia wallet.

### What is still roadmap?

The next phases are more external builder onboarding, richer hosted MCP tools, deeper Somnia Agents receipt integration, Somnia Reactivity subscriptions, Data Streams schemas, and more mature venue-specific DeFi adapters as testnet infrastructure stabilizes.

### How do you prevent fake completion?

ArcPay’s product rule is evidence-first. A task should not be marked complete from a statement alone. It needs a transaction hash, order ID, API response, receipt, audit record, or external venue proof.

### How does reputation work?

Reputation is order-backed. The reputation book can attach scores, reviews, and dispute evidence to completed work instead of relying only on off-chain claims.

### How does this become a business?

ArcPay can monetize through SaaS workspaces, agent payment processing, developer tooling, premium policy/audit features, hosted MCP/API usage, and enterprise agent treasury controls.

### What support do you want from Somnia?

We want DevRel feedback, ecosystem introductions, help validating official Somnia Agents receipt integration, amplification for beta testing, and guidance around Reactivity/Data Streams integration.

### What do you need from community builders?

We need builders who are creating agents, paid APIs, data services, or automation workflows to test ArcPay as their payment and evidence layer.

## Hard Technical Questions

### Why use Solidity instead of a custom agent framework?

ArcPay needs enforceable financial state: orders, policy, cards, escrow, and audit events. Solidity contracts give us transparent, verifiable state on Somnia. Agent frameworks can call ArcPay; they do not replace the treasury layer.

### What is the trust boundary?

Contracts enforce core state transitions. The x402 server quotes and gates HTTP resources. The frontend improves operator UX. The worker mirrors events into records. External adapters are not trusted as complete unless they produce evidence.

### Can the x402 server lie?

The server can return a resource only if the order evidence is valid. The product goal is to keep settlement evidence tied to on-chain order state. The roadmap is to harden this further with signed receipts and richer verification.

### What if an external agent returns bad work?

ArcPay can store fulfillment evidence, reviews, disputes, and reputation. Today this gives an audit trail. Over time, this can become a stronger trust/reputation layer for agent services.

### Are privacy intents actually private?

They protect memo disclosure at the product layer through commitments and encrypted memo URIs. They are not full ZK-private transfers yet. We explain that clearly because overclaiming privacy would be wrong.

### How does the worker avoid being a central point of truth?

The worker is not the source of truth for contract state. It mirrors on-chain events and API activity into a user-friendly audit layer. The contract and transaction evidence remain verifiable independently.

### What happens if Supabase is down?

Wallet and contract interactions can still exist at the chain level. Supabase-backed records improve UX and analytics, but transaction hashes and contract state remain the strongest evidence.

### What happens if the x402 gateway is down?

The paid HTTP resource will be unavailable, but contracts and dashboard modules remain available. A production version should run redundant gateways and expose uptime monitoring.

### How does MCP help?

MCP lets AI agents ask ArcPay for deployment data, payment plans, evidence requirements, x402 instructions, and onboarding payloads directly. That makes ArcPay usable by agents, not only by human operators.

### How do you avoid agents overspending through MCP?

MCP should produce plans and evidence requirements. Actual spending still goes through policy and wallet/order settlement. We do not treat MCP text output as execution proof.

### How do you handle replay or duplicate orders?

The orderbook state machine and IDs prevent treating the same work as newly completed without proper state. x402 and audit records should also check order status before unlock.

### What is your security posture?

Current posture:

- small testnet amounts
- policy checks
- explicit wallet signing
- evidence-first completion
- contract tests and build checks
- no private key exposure in frontend
- source-available review

Roadmap:

- deeper contract audit
- signed x402 receipts
- stricter hosted API auth
- monitoring and rate limits
- more formal threat model

## Community Q&A Short Answers

### Can I use ArcPay for my own agent?

Yes. You can onboard an agent through the dashboard, or use the CLI/starter kit if you want to integrate directly.

### Do I need to know smart contracts?

Not for the dashboard. Developers can go deeper with the CLI, MCP, contracts, and starter kit.

### Can my agent sell a paid API?

Yes. The x402 flow is designed for paid resources like research endpoints, paid MCP tools, data APIs, and agent services.

### Can I test today?

Yes. Use the live app on Somnia Testnet. You need a wallet and testnet funds for live transactions.

### Is there a Telegram or beta channel?

Answer with the actual link when ready. If not ready:

We are setting up the beta/community channel and will share it after the session.

### Does this support mainnet?

Current public build is Somnia Testnet. The product is intentionally testnet-only right now so builders can test safely.

## Roadmap Talk Track

Use this version. It sounds more like a serious startup and less like a hackathon checklist.

### Product Vision

Our long-term vision is to make ArcPay the default consumer and business gateway for agent-powered finance on Somnia.

Most people will not join a new chain because of infrastructure alone. They join when there is something they can use, earn from, compete in, and understand quickly.

ArcPay’s job is to turn Somnia agents from developer primitives into everyday products:

- a trader can launch a strategy agent
- a creator can charge for an AI service
- a small team can manage agent spend
- a community member can complete tasks and earn points
- an outside project can move agent operations onto Somnia without rebuilding treasury tools

That is the direction: not only “agent infrastructure,” but a usable agent economy.

### Phase 1: Community Beta Launch

The first phase is a public Somnia community beta.

On launch day, we want users to do three things without needing to be developers:

1. Connect a wallet.
2. Create or claim an agent workspace.
3. Complete simple agent treasury actions: register an agent, create an x402 task, issue a card, create an invoice, or complete a swap/yield action.

Every meaningful action should produce proof and points.

The beta loop is:

- connect wallet
- create workspace
- launch or claim agent
- complete actions
- earn points
- climb leaderboard
- share progress
- invite another user or team

This gives Somnia visible activity, repeatable user flows, and social proof.

### Phase 2: Points, Leaderboards, And Campaigns

The next layer is the ArcPay points system.

Points should reward useful behavior, not empty clicks.

Examples:

- register an agent
- complete an x402 paid task
- issue and fund a SOMUSD card
- create or pay an invoice
- create a privacy intent
- complete a verified swap/yield route
- invite another operator
- onboard an external agent endpoint
- publish a paid API or MCP tool through ArcPay

The leaderboard should have categories:

- Top Operators
- Top Agents
- Top Builders
- Top Traders
- Top Teams
- Top x402 Services

This makes the product understandable for the community. Users do not need to understand every contract first. They understand missions, points, rankings, and proof.

### Phase 3: Consumer-Grade Agent Creation

Agent creation needs to become as easy as creating a social profile.

The current builder flow is powerful, but the next version should feel like:

1. Choose what your agent does.
2. Set what it can spend.
3. Pick how it gets paid.
4. Launch it.

Example templates:

- Research Agent
- Trading Assistant
- Invoice Collector
- Risk Checker
- Content Agent
- Market Data Agent
- Community Moderator
- Strategy Tracker

Each template should automatically configure:

- endpoint pattern
- capabilities
- pricing
- spend policy
- x402 route
- card budget
- audit requirements

This is how ArcPay moves from developer-only infrastructure into a product the community can actually use.

### Phase 4: Trader And DeFi User Growth

Traders are one of the fastest adoption groups for a chain.

ArcPay can bring traders into Somnia by giving them agent-controlled treasury workflows:

- strategy agents with fixed budgets
- copy/research agent payments
- risk checks before trade execution
- swap/yield receipts
- leaderboard campaigns for verified activity
- agent cards for controlled strategy budgets

The goal is not to pretend every venue is mature today. The goal is to create the operator layer that makes new Somnia DeFi products easier to use safely when they launch.

As Somnia DeFi grows, ArcPay can become the treasury and proof layer for those users.

### Phase 5: Team And Project Onboarding

ArcPay should also target teams already building on other chains.

The pitch is:

If your project has agents, paid APIs, research bots, automation tools, trading bots, or AI workflows, ArcPay gives you a fast way to bring those operations onto Somnia.

They do not need to rebuild:

- agent identity
- payment gates
- x402 flows
- budget controls
- invoice logic
- audit logs
- MCP integration
- developer docs

This makes ArcPay a migration and onboarding product for Somnia.

### Phase 6: Somnia-Native Infrastructure Depth

Once users and teams are active, we deepen the Somnia-native layer.

Roadmap items:

- official Somnia Agents receipt integration
- Reactivity-powered subscriptions for orders, cards, privacy, invoices, and risk
- Data Streams schemas for agent activity and reputation
- stronger agent reputation and dispute history
- richer x402 settlement dashboards
- hosted MCP bridge with usage analytics
- agent-to-agent hiring flows
- marketplace discovery for paid agents and tools
- deeper privacy model beyond intent commitments
- mainnet readiness plan

This is where ArcPay becomes core agent-commerce infrastructure.

### Phase 7: Business Model

ArcPay can become a real business through:

- paid operator workspaces
- premium treasury policy and audit tooling
- hosted x402 gateway usage
- agent marketplace fees
- premium MCP/API access
- compliance and reporting exports
- team/enterprise agent treasury plans
- protocol partnerships with Somnia ecosystem apps

The near-term goal is not immediate monetization. The near-term goal is activity, proof, and adoption. Once teams rely on ArcPay to manage agent payments, monetization becomes natural.

### North Star

The north star is simple:

ArcPay should make it easy for anyone to launch, fund, control, and monetize an AI agent on Somnia.

If we do that well, ArcPay does not just benefit from Somnia growth. ArcPay helps create that growth.

## Community Beta Product Direction

This is the product direction to mention if Lisa or the team asks what changes after Explorer.

### What The Community Should Experience

The community version should feel less like a protocol dashboard and more like an agent launchpad.

The user should see:

- clear missions
- simple wallet onboarding
- agent templates
- points
- leaderboard
- progress cards
- “what to do next” prompts
- one-click proof sharing
- beginner explanations

Avoid heavy language in consumer UI:

- use “Create an agent” instead of “Register service metadata”
- use “Set budget” instead of “Configure treasury policy”
- use “Get paid” instead of “x402 protected resource”
- use “Proof” instead of “audit artifact”
- use “Agent card” instead of “SOMUSD-backed spend vault”

The advanced language can stay in docs and developer mode.

### Suggested Beta Missions

Mission 1: Create your workspace.

Mission 2: Launch your first agent.

Mission 3: Set a budget.

Mission 4: Create a paid task.

Mission 5: Issue an agent card.

Mission 6: Create a privacy intent.

Mission 7: Complete a swap/yield proof.

Mission 8: Invite another builder or team.

Mission 9: Publish an x402 endpoint.

Mission 10: Connect your agent through CLI/MCP.

### Suggested Leaderboard Names

- Agent Operators
- Paid Agent Services
- Somnia Treasury League
- x402 Builders
- Strategy Agents
- Community Beta Points

### Why This Helps Somnia

This gives Somnia more than a one-time demo.

It creates:

- wallet activity
- testnet transactions
- user-generated agent profiles
- paid endpoint experiments
- social posts
- builder onboarding
- feedback loops
- community missions
- repeat visits

That is the difference between “we built an app on Somnia” and “we are helping bring people into Somnia.”

## If Something Breaks Live

Use these exact lines.

### Wallet Prompt Delay

Wallet prompts can take a moment on testnet. I’ll keep this short and show the architecture while it confirms.

### Transaction Pending

This transaction is pending, so I won’t claim it as completed yet. ArcPay’s rule is that completion needs a confirmed tx hash or order evidence.

### API Slow

The API is responding slower than expected, but the flow is still the same: quote, order, verify, fulfill, unlock, and audit.

### Feature Not Signing

For safety, I’ll show the prepared payload and evidence requirement here. In ArcPay, this is not marked complete unless there is a tx hash or verified response.

### Someone Asks If It Is Production Ready

It is a live testnet MVP, not a mainnet production treasury yet. The important point is that the architecture, contracts, app, x402 server, docs, CLI, MCP, and starter kit are live enough for builders to test and give feedback.

## Closing Script

ArcPay is built around one belief: if agents are going to do real work onchain, they need real financial controls.

Somnia gives us the fast agentic execution layer. ArcPay adds the treasury operating system around it: identity, policy, x402 payments, escrow, cards, privacy intents, audit, and developer tools.

We’re looking for Somnia builders who are creating agents, paid APIs, data services, or automation workflows. If you want your agent to get paid safely, or if you need a control layer for agent spending, we’d love your feedback and we’d love to onboard you into the beta.

Thank you.

## Links To Share In Chat

```text
Live app: https://arcpay-somnia.vercel.app
Docs: https://arcpay-somnia.vercel.app/docs/overview
Repo: https://github.com/ArcPayLabs/arcpay-somnia
Demo video: https://youtu.be/aBnVYkRZkSc
CLI: https://www.npmjs.com/package/@arcpaylabs/somnia-cli
MCP: https://www.npmjs.com/package/@arcpaylabs/somnia-mcp
Starter kit: https://www.npmjs.com/package/@arcpaylabs/somnia-x402-agent-starter
Status: https://arcpay-somnia.vercel.app/status
```

## Presenter Checklist

Before the session:

- Confirm app loads.
- Confirm wallet can connect.
- Confirm `/status` is healthy enough.
- Confirm `/docs/overview` loads.
- Confirm x402 server URL responds.
- Have explorer links ready.
- Have demo video link ready as backup.
- Keep private keys, env files, and admin tokens closed.
- Use a clean browser profile if possible.

During the session:

- Start with the problem, not the tech.
- Explain x402 in plain language.
- Show proof whenever possible.
- Do not overclaim privacy.
- Do not overclaim external DEX execution without tx proof.
- Invite builders to test ArcPay with their own agents.

## Explorer Day Launch Plan

Use this as the operational plan for June 29 if ArcPay is selected.

### What We Announce

ArcPay Somnia is opening a community beta for Somnia users, builders, traders, and agent teams.

The beta is not only for developers. Anyone with a Somnia Testnet wallet should be able to:

- create a workspace
- launch or claim an agent
- set a budget
- issue an agent card
- create a paid task
- create a privacy intent
- produce proof
- earn points
- appear on a leaderboard

### What We Ask The Community To Do

Ask users to test one of three paths.

Path 1: Operator

- create workspace
- register an agent
- set policy
- issue card
- create invoice

Path 2: Builder

- install CLI or starter kit
- onboard an existing agent endpoint
- expose a paid x402 resource
- attach proof

Path 3: Trader / DeFi User

- create treasury workspace
- complete a swap or yield proof
- set a strategy budget
- share evidence

### What We Track

Track:

- beta signups
- connected wallets
- agent registrations
- x402 quotes
- x402 orders
- invoices created
- cards created
- privacy intents
- swap/yield proofs
- CLI/starter-kit downloads
- MCP/tool usage
- leaderboard points

### What We Share Publicly After The Session

Post:

- session recap
- demo clip
- top questions answered
- beta link
- first leaderboard snapshot
- builder docs
- “build your Somnia agent with ArcPay” thread

### Simple Community CTA

Use this line:

If you have an agent, a trading bot, a paid API, or even just an idea for an AI service on Somnia, ArcPay gives you the wallet, budget, payment, and proof layer to launch it safely.

### Beta Access Announcement Script

Use this near the end of the live session:

We are opening ArcPay Somnia beta in waves.

The reason is simple: we want the product to feel smooth and supported, not chaotic. Wave 1 will focus on the first 50 users who want to create an agent workspace, complete a proof action, and give real feedback.

If you are a community user, trader, builder, or team exploring Somnia, you can join the waitlist today. Once you receive an invite code, you can enter the app, launch your first agent, set a budget, complete missions, and start earning beta points.

The goal is to make agent creation on Somnia feel simple: connect wallet, choose agent, set budget, get paid, collect proof, and climb the leaderboard.

### Telegram / Discord Message After Explorer

```text
Thanks everyone for joining the ArcPay Somnia Explorer session.

We’re opening ArcPay Somnia community beta in waves.

Wave 1 is for the first 50 testers: community users, traders, builders, and teams who want to launch agents, test x402 paid work, issue agent cards, create privacy intents, and collect proof on Somnia Testnet.

Beta loop:
1. Connect wallet
2. Create workspace
3. Launch an agent
4. Complete quests
5. Earn points
6. Share proof

App: https://arcpay-somnia.vercel.app
Docs: https://arcpay-somnia.vercel.app/docs/overview
Repo: https://github.com/ArcPayLabs/arcpay-somnia

If you’re building an agent, paid API, trading bot, or AI workflow on Somnia, I’d love your feedback.
```

### X Launch Post

```text
ArcPay Somnia community beta is opening in waves.

We’re building the treasury layer for agent businesses on @Somnia_Network:

• create an agent workspace
• set agent budgets
• get paid through x402-style tasks
• issue SOMUSD agent cards
• create privacy intents
• collect proof
• earn beta points

Wave 1 starts with the first 50 testers.

App: https://arcpay-somnia.vercel.app
Docs: https://arcpay-somnia.vercel.app/docs/overview
```

## Product Refinement Branch Goals

Branch:

```text
community-beta-refinement
```

Purpose:

Make the Somnia app feel like a community beta product, not only a hackathon/operator dashboard.

### UX Fixes

- simplify landing copy for normal users
- add “Launch your first agent” as the primary onboarding path
- add mission cards on dashboard
- add points and leaderboard preview
- reduce protocol-heavy wording in app pages
- keep advanced technical terms in docs/developer mode
- make swap/yield/card flows feel guided and obvious
- make every empty state explain the next action
- make proof sharing easy after successful actions

### New Community Pages

Built pages on this branch:

- `/quests`
- `/leaderboard`
- `/launch-agent`

### Agent Templates

Templates to add:

- Research Agent
- Trading Assistant
- Market Data Agent
- Invoice Agent
- Risk Checker
- Content Agent
- Community Helper

Each template should prefill:

- agent slug
- endpoint example
- capability list
- default policy
- card budget
- x402 price
- proof requirement

### Copy Direction

Replace:

```text
Register service metadata
```

With:

```text
Create your agent profile
```

Replace:

```text
Treasury policy enforcement
```

With:

```text
Set what your agent can spend
```

Replace:

```text
x402 protected resource
```

With:

```text
Get paid for agent work
```

Replace:

```text
Audit artifact
```

With:

```text
Proof
```

### Why This Matters

Somnia DevRel may be technical, but community adoption will come from simple loops:

- create
- test
- earn
- share
- invite

ArcPay should make agent finance feel understandable in under one minute.
