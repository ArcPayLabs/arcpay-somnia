// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SomniaYieldVault {
    address public immutable owner;
    uint256 public totalDeposits;
    uint256 public apyBps;
    mapping(address => uint256) public balances;

    event Deposited(address indexed account, uint256 amount, string strategy);
    event Withdrawn(address indexed account, uint256 amount);
    event ApyUpdated(uint256 apyBps);

    error NotOwner();
    error NoValue();
    error InsufficientBalance();
    error TransferFailed();

    constructor(uint256 apyBps_) {
        owner = msg.sender;
        apyBps = apyBps_;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function depositNative(string calldata strategy) external payable {
        if (msg.value == 0) revert NoValue();
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        emit Deposited(msg.sender, msg.value, strategy);
    }

    function withdrawNative(uint256 amount) external {
        if (balances[msg.sender] < amount) revert InsufficientBalance();
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        (bool ok,) = payable(msg.sender).call{ value: amount }("");
        if (!ok) revert TransferFailed();
        emit Withdrawn(msg.sender, amount);
    }

    function setApyBps(uint256 nextApyBps) external onlyOwner {
        apyBps = nextApyBps;
        emit ApyUpdated(nextApyBps);
    }
}
