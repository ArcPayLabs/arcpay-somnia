import fs from "node:fs";
import path from "node:path";
import { ethers } from "hardhat";

const deploymentPath = path.join(process.cwd(), "deployments", "somnia-testnet.json");

async function main() {
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8")) as {
    somUsdToken: string;
    contracts: Record<string, string>;
  };
  const [deployer] = await ethers.getSigners();
  const token = await ethers.deployContract("MockERC20");
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  const rate = 100_000000n; // 1 STT -> 100 SOMUSD units at 6 decimals.

  const router = await ethers.deployContract("SomniaSwapRouter", [tokenAddress, rate]);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();

  const vault = await ethers.deployContract("SomniaYieldVault", [520n]);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();

  const seedAmount = 500_000n * 1_000000n;
  const mintTx = await token.mint(routerAddress, seedAmount);
  await mintTx.wait();

  const updated = {
    ...deployment,
    contracts: {
      ...deployment.contracts,
      SomniaSwapRouter: routerAddress,
      SomniaYieldVault: vaultAddress,
    },
    defi: {
      swapRouter: routerAddress,
      yieldVault: vaultAddress,
      swapToken: tokenAddress,
      swapRateTokenUnitsPerSttWei: rate.toString(),
      routerSeededSomusdUnits: seedAmount.toString(),
      yieldApyBps: 520,
      venues: ["dreamDEX", "Somnia Exchange", "Somnex", "Potion Swap", "ArcPay Testnet Router"],
    },
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(deploymentPath, `${JSON.stringify(updated, null, 2)}\n`);
  console.log(JSON.stringify({
    deployer: deployer.address,
    router: routerAddress,
    vault: vaultAddress,
    token: tokenAddress,
    seedAmount: seedAmount.toString(),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
