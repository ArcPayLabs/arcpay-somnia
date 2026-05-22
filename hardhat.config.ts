import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import type { HardhatUserConfig } from "hardhat/config";

const privateKey = process.env.PRIVATE_KEY;

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
      url: process.env.SOMNIA_RPC_URL ?? "https://rpc-testnet.somnia.network",
      chainId: Number(process.env.SOMNIA_CHAIN_ID ?? 50312),
      accounts: privateKey ? [privateKey] : [],
    },
  },
};

export default config;

