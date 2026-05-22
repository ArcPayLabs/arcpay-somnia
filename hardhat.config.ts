import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import type { HardhatUserConfig } from "hardhat/config";

const privateKey = normalizePrivateKey(process.env.PRIVATE_KEY);

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    somniaTestnet: {
      url: process.env.SOMNIA_RPC_URL ?? "https://dream-rpc.somnia.network",
      chainId: Number(process.env.SOMNIA_CHAIN_ID ?? 50312),
      accounts: privateKey ? [privateKey] : [],
    },
  },
};

export default config;

function normalizePrivateKey(value: string | undefined): string | undefined {
  const key = value?.trim();
  if (!key || key === "0xYOUR_DEPLOYER_PRIVATE_KEY") {
    return undefined;
  }
  return /^0x[0-9a-fA-F]{64}$/.test(key) ? key : undefined;
}
