import { expect } from "chai";
import { ethers } from "hardhat";

describe("SomniaAgentRiskOracle", () => {
  it("stores owner-provided demo fulfillment for judge walkthroughs", async () => {
    const [owner, requester] = await ethers.getSigners();
    const platform = await ethers.deployContract("MockSomniaAgentPlatform");
    const oracle = await ethers.deployContract("SomniaAgentRiskOracle", [await platform.getAddress(), 7]);
    const requestId = ethers.id("risk-request-1");
    const orderId = ethers.id("order-1");

    await expect(oracle.ownerFulfillForDemo(requestId, 82, "APPROVE", "ipfs://risk-evidence"))
      .to.be.revertedWith("request missing");

    await oracle.connect(requester).requestRisk(orderId, "Score this order");
    const resultRequestId = await oracle.queryFilter(oracle.filters.RiskRequested()).then((events) => events[0].args.requestId);

    await expect(oracle.ownerFulfillForDemo(resultRequestId, 82, "APPROVE", "ipfs://risk-evidence"))
      .to.emit(oracle, "RiskFulfilled")
      .withArgs(resultRequestId, orderId, 82, "APPROVE", "ipfs://risk-evidence");

    const result = await oracle.results(resultRequestId);
    expect(result.fulfilled).to.equal(true);
    expect(result.requester).to.equal(requester.address);
  });
});
