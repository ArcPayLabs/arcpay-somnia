# Privacy Intent Examples

These examples show how Somnia builders can reuse ArcPay's privacy-intent primitive.

## Native STT Intent

```ts
import { Contract, keccak256, parseEther, toUtf8Bytes } from "ethers";

const commitment = keccak256(toUtf8Bytes("private-invoice-001"));
const nullifier = keccak256(toUtf8Bytes("release-private-invoice-001"));

await privacyVault.createNativeIntent(
  commitment,
  "ipfs://encrypted-memo-or-ciphertext-pointer",
  { value: parseEther("0.01") },
);

await privacyVault.releaseIntent(commitment, nullifier, recipient);
```

## SOMUSD Intent

```ts
const amount = 5_000000n;
await somusd.approve(privacyVaultAddress, amount);
await privacyVault.createTokenIntent(
  commitment,
  somusdAddress,
  amount,
  "ipfs://encrypted-somusd-memo",
);
```

## UX Pattern

1. Store plain business metadata off-chain or encrypted.
2. Commit only the hash and encrypted memo URI on Somnia.
3. Release the recipient later with a nullifier.
4. Export the release tx and nullifier as audit evidence.

## Boundary

This is an application privacy layer, not a full shielded pool. Final transfers are public after release.
