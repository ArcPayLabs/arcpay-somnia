# ArcPay Agent Protocol

## Agent Registration

Agents register with:

- `agentId`
- owner address
- display name
- endpoint URI
- capabilities string
- price in native Somnia gas token

The endpoint is intentionally a URI so an agent can expose HTTPS, x402, MCP, or
another agent-readable interface.

## x402 Resource Flow

ArcPay exposes paid agent work through `apps/x402-server`:

```text
GET /agent/:slug/work -> 402 Payment Required
AgentOrderBook.createOrder(agentId, requestUri) -> escrow STT
POST /x402/verify -> paid but locked until fulfillment
Provider fulfills order -> protected resource unlocks
Requester settles -> provider receives escrow
```

The server does not trust headers alone. It reads `AgentOrderBook.orders(orderId)`
and unlocks only when the order is `Fulfilled` or `Settled`.

## Order State Machine

```text
Pending -> Accepted -> Processing -> Fulfilled -> Settled
Pending -> Refunded
Accepted -> Refunded
```

Failed/disputed states can be added after the first testnet deployment.

## Agent Payment Policy

Treasury policy gates every new order:

- emergency pause
- hourly spend limit
- daily spend limit
- approval threshold
- optional agent allowlist
- x402 resource unlock requires fulfilled or settled order state

## MCP Direction

The MCP server should expose:

- `list_agents`
- `register_agent`
- `create_order`
- `accept_order`
- `fulfill_order`
- `settle_order`
- `get_policy`
- `set_policy`
- `x402_guide`
