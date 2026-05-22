// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISomniaAgentPlatform {
    function createRequest(uint256 agentId, bytes calldata input, address callback, bytes4 callbackSelector)
        external
        payable
        returns (bytes32 requestId);
}

contract SomniaAgentRiskOracle {
    struct RiskResult {
        bytes32 orderId;
        address requester;
        uint256 score;
        string verdict;
        string evidenceUri;
        bool fulfilled;
        uint256 requestedAt;
        uint256 fulfilledAt;
    }

    address public owner;
    address public platform;
    uint256 public riskAgentId;

    mapping(bytes32 => RiskResult) public results;

    event PlatformUpdated(address indexed platform, uint256 riskAgentId);
    event RiskRequested(bytes32 indexed requestId, bytes32 indexed orderId, address indexed requester, string prompt);
    event RiskFulfilled(bytes32 indexed requestId, bytes32 indexed orderId, uint256 score, string verdict, string evidenceUri);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyPlatform() {
        require(msg.sender == platform, "not platform");
        _;
    }

    constructor(address platform_, uint256 riskAgentId_) {
        owner = msg.sender;
        platform = platform_;
        riskAgentId = riskAgentId_;
    }

    function setPlatform(address platform_, uint256 riskAgentId_) external onlyOwner {
        platform = platform_;
        riskAgentId = riskAgentId_;
        emit PlatformUpdated(platform_, riskAgentId_);
    }

    function requestRisk(bytes32 orderId, string calldata prompt) external payable returns (bytes32 requestId) {
        require(platform != address(0), "platform missing");
        require(orderId != bytes32(0), "order required");
        require(bytes(prompt).length > 0, "prompt required");

        requestId = ISomniaAgentPlatform(platform).createRequest{value: msg.value}(
            riskAgentId,
            abi.encode(orderId, prompt),
            address(this),
            this.fulfillRisk.selector
        );

        results[requestId] = RiskResult({
            orderId: orderId,
            requester: msg.sender,
            score: 0,
            verdict: "pending",
            evidenceUri: "",
            fulfilled: false,
            requestedAt: block.timestamp,
            fulfilledAt: 0
        });

        emit RiskRequested(requestId, orderId, msg.sender, prompt);
    }

    function fulfillRisk(bytes32 requestId, uint256 score, string calldata verdict, string calldata evidenceUri)
        external
        onlyPlatform
    {
        _fulfill(requestId, score, verdict, evidenceUri);
    }

    function ownerFulfillForDemo(bytes32 requestId, uint256 score, string calldata verdict, string calldata evidenceUri)
        external
        onlyOwner
    {
        _fulfill(requestId, score, verdict, evidenceUri);
    }

    function _fulfill(bytes32 requestId, uint256 score, string calldata verdict, string calldata evidenceUri) internal {
        RiskResult storage result = results[requestId];
        require(result.requester != address(0), "request missing");
        require(!result.fulfilled, "already fulfilled");
        require(score <= 100, "score max 100");

        result.score = score;
        result.verdict = verdict;
        result.evidenceUri = evidenceUri;
        result.fulfilled = true;
        result.fulfilledAt = block.timestamp;

        emit RiskFulfilled(requestId, result.orderId, score, verdict, evidenceUri);
    }
}
