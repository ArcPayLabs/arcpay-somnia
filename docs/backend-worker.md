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

Current VM deployment uses a systemd service:

```bash
sudo systemctl status arcpay-somnia-worker --no-pager
sudo journalctl -u arcpay-somnia-worker -n 50 --no-pager
sudo systemctl restart arcpay-somnia-worker
```

The service runs from `/home/arcpay/arcpay-somnia` and restarts automatically
after VM reboot.
