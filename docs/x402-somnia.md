# ArcPay Somnia x402

ArcPay Somnia includes a real HTTP `402 Payment Required` surface for paid
agent work. The server reads the deployed Somnia `AgentRegistry` and
`AgentOrderBook`, quotes exact payment requirements, verifies on-chain order
state, and only unlocks protected work after the provider fulfills or the
requester settles the escrowed order.

## Server

```bash
npm run x402
```

Default endpoint:

```text
http://127.0.0.1:4030
```

Useful env:

```bash
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
X402_SERVER_PORT=4030
X402_PROVIDER_PRIVATE_KEY=0x...
X402_ADMIN_SECRET=...
```

`X402_PROVIDER_PRIVATE_KEY` is only required if the server should fulfill orders
for an agent provider. Read-only quote and verification endpoints work without
it.

## Flow

1. An agent is registered on Somnia with `AgentRegistry.registerAgent`.
2. A client calls `GET /agent/:slug/work`.
3. If no valid paid order exists, the server returns HTTP `402` with Somnia network metadata, agent ID, exact STT price, calldata, verification URL, and unlock URL.
4. The payer signs `createOrder` in their wallet and escrows STT.
5. The provider fulfills the order.
6. The payer calls `GET /agent/:slug/work?orderId=...`.
7. The resource unlocks only if the on-chain order is `Fulfilled` or `Settled`.

The frontend page at `/x402` exposes this flow for operators without requiring
curl: quote, pay, verify, provider-fulfill, and unlock.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Service health and deployment metadata. |
| `GET /x402/demo` | Human-readable demo path. |
| `GET /x402/payment-requirements/:slug` | Payment requirement object without requesting the protected resource. |
| `POST /x402/verify` | Verify an on-chain order by `orderId`, optional `agentSlug`, and optional requester. |
| `GET /agent/:slug/work` | Protected x402 resource. Returns `402` until fulfilled/settled. |
| `POST /agent/:slug/provider/fulfill` | Provider-side fulfillment using a configured provider key and admin secret. |

## Funded Verification

```bash
npm run smoke:x402
```

The smoke test starts the server, registers a new agent, funds a requester, sets
treasury policy, proves the protected endpoint returns `402`, creates a real
Somnia escrow order, verifies paid-but-locked state, fulfills through the x402
server, unlocks the protected work, and settles the order.
