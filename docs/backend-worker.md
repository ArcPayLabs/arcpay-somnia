# ArcPay Somnia Worker

`apps/worker` is the Azure-ready event reconciler for Somnia.

It backfills and polls:

- `AgentRegistry` registration and update events
- `TreasuryPolicy` policy, allowlist, approval, and spend events
- `AgentTreasury` escrow deposit, settlement, and refund events
- `AgentOrderBook` order lifecycle events
- `AgentSpendCardVault` SOMUSD card events
- `OperatorControls` claim-code and webhook-circuit events
- `SomniaPrivacyVault` STT/SOMUSD privacy intent events
- `AgentInvoiceBook` STT/SOMUSD invoice creation, payment, and cancellation events
- `SomniaAgentRiskOracle` risk request and fulfillment events

## Run Locally

```bash
npm run install:worker
npm run worker
```

One-shot verification:

```bash
npm run worker:once
```

## Azure App Service / VM

Set:

```bash
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
ARCPAY_ROOT=/path/to/arcpay-somnia
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
ARCPAY_RECORDS_TABLE=arcpay_somnia_records
ARCPAY_WORKER_CHECKPOINT_PATH=/home/arcpay/.arcpay-somnia-worker-checkpoint.json
```

Start command:

```bash
npm run worker
```

The worker writes structured records into Supabase when `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are set. Without Supabase it prints the same records
as structured JSON logs.

Each indexed event is idempotent by chain, contract, transaction hash, and log
index. The checkpoint file lets the worker resume from the last scanned Somnia
block after a restart.

Current VM deployment uses a systemd service:

```bash
sudo systemctl status arcpay-somnia-worker --no-pager
sudo journalctl -u arcpay-somnia-worker -n 50 --no-pager
sudo systemctl restart arcpay-somnia-worker
```

The service runs from `/home/arcpay/arcpay-somnia` and restarts automatically
after VM reboot.

Dashboard and Audit pages fetch `/api/records`, so worker-reconciled events
appear in the product UI alongside browser-created records.
