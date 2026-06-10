import { expect } from "chai";
import { ethers } from "hardhat";

describe("Somnia live DeFi contracts", () => {
  it("swaps native STT for SOMUSD through the router", async () => {
    const [owner, trader] = await ethers.getSigners();
    const token = await ethers.deployContract("MockERC20");
    const router = await ethers.deployContract("SomniaSwapRouter", [await token.getAddress(), 100_000000n]);

    await token.mint(await router.getAddress(), 1_000_000n * 1_000000n);

    const nativeIn = ethers.parseEther("0.01");
    const quote = await router.quoteNativeToToken(nativeIn);

    await expect(router.connect(trader).swapExactNativeForToken(quote, trader.address, "ArcPay testnet router", { value: nativeIn }))
      .to.emit(router, "NativeToTokenSwap")
      .withArgs(trader.address, trader.address, nativeIn, quote, "ArcPay testnet router");

    expect(await token.balanceOf(trader.address)).to.equal(quote);
    expect(await ethers.provider.getBalance(await router.getAddress())).to.equal(nativeIn);
    expect(owner.address).to.not.equal(ethers.ZeroAddress);
  });

  it("deposits and withdraws native STT yield positions", async () => {
    const [, trader] = await ethers.getSigners();
    const vault = await ethers.deployContract("SomniaYieldVault", [520n]);
    const amount = ethers.parseEther("0.01");

    await expect(vault.connect(trader).depositNative("dreamDEX maker yield", { value: amount }))
      .to.emit(vault, "Deposited")
      .withArgs(trader.address, amount, "dreamDEX maker yield");

    expect(await vault.balances(trader.address)).to.equal(amount);
    expect(await vault.totalDeposits()).to.equal(amount);

    await expect(vault.connect(trader).withdrawNative(amount / 2n))
      .to.emit(vault, "Withdrawn")
      .withArgs(trader.address, amount / 2n);

    expect(await vault.balances(trader.address)).to.equal(amount / 2n);
  });
});
