import { ethers } from "hardhat";

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

  await (await policy.setOrderBook(await orderBook.getAddress())).wait();
  await (await treasury.setOrderBook(await orderBook.getAddress())).wait();

  console.log("AgentRegistry:", await registry.getAddress());
  console.log("TreasuryPolicy:", await policy.getAddress());
  console.log("AgentTreasury:", await treasury.getAddress());
  console.log("AgentOrderBook:", await orderBook.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

