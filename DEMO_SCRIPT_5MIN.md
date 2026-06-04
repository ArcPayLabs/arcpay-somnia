# ArcPay 5-Minute Demo Script

Target length: 4:30 to 4:55.

## 0:00-0:25 - Opening

ArcPay is a control plane and developer distribution layer for agent payments, treasury policies, paid APIs, and verifiable execution.

Today I am showing the Somnia version: a wallet-first operating account for AI-agent businesses on Somnia Testnet.

## 0:25-0:55 - Problem

AI agents can discover tools and pay for work, but operators still need spend controls, receipts, policies, privacy boundaries, and audit evidence before trusting autonomous execution.

ArcPay solves that by putting every agent action through one treasury layer: x402 payment requirements, orderbook escrow, policy checks, privacy intents, risk records, and audit trails.

## 0:55-1:30 - Agent Onboarding

Open the app, sign in, and enter the dashboard.

On the Agents page, ArcPay supports bring-your-own-agent onboarding. A builder registers a service slug, capability metadata, endpoint, and STT price.

ArcPay also integrates official Somnia Agents. The app exposes the Somnia platform contract, AgentRegistry, LLM Parse Website, LLM Inference, and JSON API Request IDs. Their receipts can be attached to ArcPay orders before settlement.

## 1:30-2:10 - x402 Paid Work

Move to x402.

ArcPay exposes paid agent work over HTTP 402. A client requests a protected resource, receives exact payment requirements, creates an on-chain order, verifies it, and unlocks the result only after fulfillment.

This makes ArcPay useful for agents and developers: paid APIs, paid MCP tools, research endpoints, and agent-to-agent work.

## 2:10-2:45 - Policies, Privacy, And Audit

Show Policies, Privacy, and Audit.

Operators can define budget controls and evidence requirements. Privacy intents let teams hide memo details during the intent phase while still producing release evidence later. Audit records track wallet actions, x402 orders, invoices, cards, privacy intents, and partner evidence.

## 2:45-3:25 - DeFi And Ecosystem Integrations

Show Swaps and Yield.

ArcPay maps Somnia ecosystem routes into policy-gated intent flows: dreamDEX CLOB, Somnia Exchange, Somnex, Potion Swap, and custom Somnia DEX adapters.

The important rule is that ArcPay does not mark a route complete from a quote alone. Completion needs venue evidence or a Somnia transaction hash.

## 3:25-4:00 - Developer Distribution Layer

Show docs/proofs/status.

ArcPay is not only an app. It publishes CLI, MCP, starter kits, OpenAPI, `llms.txt`, an MCP server card, agent-skills, API catalog, and x402 discovery.

That means human operators, AI agents, and external developers can all discover and use the same payment and evidence layer.

## 4:00-4:40 - Proof And Close

Show Status and QA report.

The live app exposes health checks, deployed contracts, x402 status, agent-ready metadata, and QA evidence. The automated browser QA passed the public routes and API surfaces on desktop and mobile.

The next step is live wallet approval: connect a funded wallet, register an agent, create an x402 order, attach evidence, and show it in audit.

ArcPay turns agent payments from isolated demos into a usable treasury operating system for real agent businesses.

## Capture Checklist

- Landing page
- Sign-in page
- Dashboard
- Agents with official Somnia Agents section
- x402 quote/order page
- Privacy intents
- Swaps/yield adapters
- Status/API proof
- QA report
- npm package proof
