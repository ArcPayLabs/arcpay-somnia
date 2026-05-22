import { ethers } from "hardhat";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying ArcPay Somnia contracts from ${deployer.address}`);

  const registry = await ethers.deployContract("AgentRegistry");
  await registry.waitForDeployment();

  const policy = await ethers.deployContract("TreasuryPolicy");
  await policy.waitForDeployment();

  const treasury = await ethers.deployContract("AgentTreasury");
  await treasury.waitForDeployment();

  const orderBook = await ethers.deployContract("AgentOrderBook", [
    await registry.getAddress(),
    await policy.getAddress(),
    await treasury.getAddress(),
  ]);
  await orderBook.waitForDeployment();

  const operatorControls = await ethers.deployContract("OperatorControls");
  await operatorControls.waitForDeployment();

  const spendCardVault = await ethers.deployContract("AgentSpendCardVault");
  await spendCardVault.waitForDeployment();

  let platformAddress = process.env.SOMNIA_AGENT_PLATFORM ?? "0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776";
  let mockPlatformAddress: string | undefined;
  if (platformAddress === "mock") {
    const mockPlatform = await ethers.deployContract("MockSomniaAgentPlatform");
    await mockPlatform.waitForDeployment();
    mockPlatformAddress = await mockPlatform.getAddress();
    platformAddress = mockPlatformAddress;
  }
  const riskAgentId = BigInt(process.env.SOMNIA_RISK_AGENT_ID ?? "13174292974160097713");
  const riskOracle = await ethers.deployContract("SomniaAgentRiskOracle", [platformAddress, riskAgentId]);
  await riskOracle.waitForDeployment();

  await (await policy.setOrderBook(await orderBook.getAddress())).wait();
  await (await treasury.setOrderBook(await orderBook.getAddress())).wait();

  const deployment = {
    network: "somnia-testnet",
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      AgentRegistry: await registry.getAddress(),
      TreasuryPolicy: await policy.getAddress(),
      AgentTreasury: await treasury.getAddress(),
      AgentOrderBook: await orderBook.getAddress(),
      OperatorControls: await operatorControls.getAddress(),
      SomniaAgentRiskOracle: await riskOracle.getAddress(),
      AgentSpendCardVault: await spendCardVault.getAddress(),
      ...(mockPlatformAddress ? { MockSomniaAgentPlatform: mockPlatformAddress } : {}),
    },
    somniaAgentPlatform: platformAddress,
    somniaRiskAgentId: riskAgentId.toString(),
    somUsdToken: process.env.SOMUSD_TOKEN_ADDRESS ?? "0x02b8316775057e2096471473663d51ceafbe3e3b",
  };

  fs.mkdirSync("deployments", { recursive: true });
  fs.writeFileSync(path.join("deployments", "somnia-testnet.json"), `${JSON.stringify(deployment, null, 2)}\n`);

  for (const [name, address] of Object.entries(deployment.contracts)) {
    console.log(`${name}: ${address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
