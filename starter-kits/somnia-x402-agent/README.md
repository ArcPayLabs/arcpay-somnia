# ArcPay Somnia x402 Agent Starter

This starter is the plug-and-play client for Somnia agent builders who want to sell or consume paid agent work through ArcPay. Point it at ArcPay's live Somnia x402 server, request a protected resource, read the HTTP 402 quote, verify an order, and unlock the result after payment evidence exists.

It covers:

- reading a payment quote
- requesting a protected agent resource
- checking HTTP 402 requirements
- verifying an order id
- deriving the agent id locally
- generating a bring-your-own-agent onboarding payload
- generating a SOMUSD card delegation plan
- generating workspace/per-agent policy requirements
- printing the evidence checklist ArcPay expects before work is marked complete

It does not hold private keys by default. Wallet payment is intentionally left to your app, operator wallet, or agent wallet so teams can plug it into their own custody model.

## Setup

```bash
npm install
cp src/env.example .env
```

## Commands

```bash
node src/agent-client.mjs quote research-agent
node src/agent-client.mjs locked research-agent
node src/agent-client.mjs verify 0xORDER_ID research-agent
node src/agent-client.mjs unlock research-agent 0xORDER_ID
node src/agent-client.mjs agent-id research-agent
node src/agent-client.mjs onboard research-agent https://your-agent.example/work
node src/agent-client.mjs card research-agent 0xAgentWallet
node src/agent-client.mjs policy research-agent 10
node src/agent-client.mjs evidence research-agent
```

## Live Server

```text
https://x402.20.208.46.195.nip.io
```

## Payment Flow

1. `quote` the agent slug.
2. Create an order in `AgentOrderBook` with the quoted `agentId`, `requestUri`, and `amountWei`.
3. Provider fulfills the order.
4. `unlock` the resource with `orderId`.

## Bring Your Own Agent

Use `onboard` when you already have a Claude/Codex/custom agent or API endpoint and want it governed by ArcPay:

```bash
node src/agent-client.mjs onboard research-agent https://your-agent.example/work
```

The output includes the Somnia contract addresses, deterministic `agentId`, x402 endpoint, and the exact next steps for claim-code onboarding, policy assignment, order creation, and audit evidence.

## Cards and Policies

Use `card` to prepare a SOMUSD agent card without opening the dashboard. Use `policy` to generate the global workspace plus per-agent policy requirements that should be enforced before a signed action.

```bash
node src/agent-client.mjs card research-agent 0xAgentWallet
node src/agent-client.mjs policy research-agent 10
```

These commands generate execution plans and proof requirements. Actual card creation, top-up, spend, and policy writes still require a wallet signature or a backend signer controlled by the builder.

See the main docs at:

```text
https://arcpay-somnia.vercel.app/docs/x402-agent-payments
```
