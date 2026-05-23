# ArcPay Somnia Worker

`apps/worker` is the Azure-ready event watcher for Somnia.

It listens to:

- `AgentOrderBook` order lifecycle events
- `AgentSpendCardVault` SOMUSD card events
- `OperatorControls` claim-code and webhook-circuit events

## Run Locally

```bash
npm run install:worker
npm run worker
```

## Azure App Service / VM

Set:

```bash
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
ARCPAY_ROOT=/path/to/arcpay-somnia
```

Start command:

```bash
npm run worker
```

The worker prints structured JSON logs. A production deployment can route those
logs into Azure Monitor, Log Analytics, or a Supabase ingestion table.
