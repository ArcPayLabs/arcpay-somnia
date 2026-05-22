// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TreasuryPolicy {
    struct Policy {
        uint256 hourlyLimitWei;
        uint256 dailyLimitWei;
        uint256 approvalThresholdWei;
        bool emergencyPaused;
        bool allowlistEnabled;
    }

    struct SpendWindow {
        uint256 hourStart;
        uint256 hourSpentWei;
        uint256 dayStart;
        uint256 daySpentWei;
    }

    address public owner;
    address public orderBook;

    mapping(address => Policy) public policies;
    mapping(address => SpendWindow) public spendWindows;
    mapping(address => mapping(bytes32 => bool)) public allowedAgents;

    event OrderBookSet(address indexed orderBook);
    event PolicyUpdated(address indexed operator, uint256 hourlyLimitWei, uint256 dailyLimitWei, uint256 approvalThresholdWei, bool emergencyPaused, bool allowlistEnabled);
    event AgentAllowanceUpdated(address indexed operator, bytes32 indexed agentId, bool allowed);
    event SpendRecorded(address indexed operator, bytes32 indexed agentId, uint256 amountWei);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyOrderBook() {
        require(msg.sender == orderBook, "not order book");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setOrderBook(address nextOrderBook) external onlyOwner {
        require(nextOrderBook != address(0), "order book required");
        orderBook = nextOrderBook;
        emit OrderBookSet(nextOrderBook);
    }

    function setPolicy(
        uint256 hourlyLimitWei,
        uint256 dailyLimitWei,
        uint256 approvalThresholdWei,
        bool emergencyPaused,
        bool allowlistEnabled
    ) external {
        require(dailyLimitWei == 0 || hourlyLimitWei <= dailyLimitWei, "hourly exceeds daily");

        policies[msg.sender] = Policy({
            hourlyLimitWei: hourlyLimitWei,
            dailyLimitWei: dailyLimitWei,
            approvalThresholdWei: approvalThresholdWei,
            emergencyPaused: emergencyPaused,
            allowlistEnabled: allowlistEnabled
        });

        emit PolicyUpdated(msg.sender, hourlyLimitWei, dailyLimitWei, approvalThresholdWei, emergencyPaused, allowlistEnabled);
    }

    function setAgentAllowed(bytes32 agentId, bool allowed) external {
        allowedAgents[msg.sender][agentId] = allowed;
        emit AgentAllowanceUpdated(msg.sender, agentId, allowed);
    }

    function validateAndRecord(address operator, bytes32 agentId, uint256 amountWei) external onlyOrderBook {
        Policy memory policy = policies[operator];
        require(!policy.emergencyPaused, "emergency paused");
        if (policy.allowlistEnabled) {
            require(allowedAgents[operator][agentId], "agent not allowed");
        }
        if (policy.approvalThresholdWei > 0) {
            require(amountWei <= policy.approvalThresholdWei, "approval required");
        }

        SpendWindow storage window = spendWindows[operator];
        uint256 hourStart = (block.timestamp / 1 hours) * 1 hours;
        uint256 dayStart = (block.timestamp / 1 days) * 1 days;

        if (window.hourStart != hourStart) {
            window.hourStart = hourStart;
            window.hourSpentWei = 0;
        }
        if (window.dayStart != dayStart) {
            window.dayStart = dayStart;
            window.daySpentWei = 0;
        }

        if (policy.hourlyLimitWei > 0) {
            require(window.hourSpentWei + amountWei <= policy.hourlyLimitWei, "hourly limit");
        }
        if (policy.dailyLimitWei > 0) {
            require(window.daySpentWei + amountWei <= policy.dailyLimitWei, "daily limit");
        }

        window.hourSpentWei += amountWei;
        window.daySpentWei += amountWei;
        emit SpendRecorded(operator, agentId, amountWei);
    }
}

