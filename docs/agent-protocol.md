# ArcPay Agent Protocol

## Agent Registration

Agents register with:

- `agentId`
- owner address
- display name
- endpoint URI
- capabilities string
- price in native Somnia gas token

The endpoint is intentionally a URI so an agent can expose HTTPS, MCP, or another
agent-readable interface.

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

