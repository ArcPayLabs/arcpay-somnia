# ArcPay Multi-Chain Porting Plan

ArcPay chain repos should reuse the same product surface, then replace only the
network adapter, contracts, and pages that cannot be made real on that chain.

## Repo Pattern

| Repo | Chain | Contract stack | Frontend rule |
| --- | --- | --- | --- |
| `arcpay-somnia` | Somnia Testnet | Solidity + Hardhat | EVM wallet, fixed to Somnia Testnet. |
| `arcpay-mantle` | Mantle Testnet | Solidity + Foundry/Hardhat | Reuse EVM wallet and treasury pages, add Mantle RWA/agent features. |
| `arcpay-arbitrum` | Arbitrum Sepolia | Solidity or Stylus | Reuse EVM wallet, add Arbitrum/Stylus policy proof if used. |
| `arcpay-sui` | Sui Testnet | Move + Sui TypeScript SDK | Rebuild wallet adapter and contracts around Sui objects. |

## Required Product Pages

Every port should keep these pages unless the chain makes the feature
impossible:

- Dashboard
- Agents
- Orders
- Payments
- Invoices
- Contractors
- Policies
- Audit
- Proofs
- Settings

## Adapter Boundary

Keep chain-specific logic inside one library module, like
`apps/frontend/src/lib/somnia.ts`. Future ports should create:

- `mantle.ts` for Mantle RPC, explorer, addresses, ABI calls
- `arbitrum.ts` for Arbitrum Sepolia/Stylus contracts
- `sui.ts` for Sui wallet, package IDs, object IDs, and Move calls

## Testnet-Only Rule

Unlike the Solana ArcPay app, these hackathon ports should be fixed to the
target testnet. Do not add a mainnet/devnet switch unless the track explicitly
requires it.

## Judge Verification

Each repo should expose:

- deployed contract/package addresses
- local install commands
- contract tests
- frontend production build
- proof page with explorer links
- demo path that starts from wallet connect and ends in an auditable action
