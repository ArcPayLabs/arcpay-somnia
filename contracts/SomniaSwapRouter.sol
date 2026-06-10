// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISwapToken {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract SomniaSwapRouter {
    address public immutable owner;
    address public immutable token;
    uint256 public rateTokenUnitsPerSttWei;

    event RateUpdated(uint256 rateTokenUnitsPerSttWei);
    event NativeToTokenSwap(
        address indexed sender,
        address indexed recipient,
        uint256 nativeIn,
        uint256 tokenOut,
        string venue
    );
    event NativeWithdrawn(address indexed recipient, uint256 amount);
    event TokenWithdrawn(address indexed recipient, uint256 amount);

    error NotOwner();
    error NoValue();
    error Slippage();
    error TransferFailed();

    constructor(address token_, uint256 rateTokenUnitsPerSttWei_) {
        owner = msg.sender;
        token = token_;
        rateTokenUnitsPerSttWei = rateTokenUnitsPerSttWei_;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function quoteNativeToToken(uint256 nativeIn) public view returns (uint256) {
        return nativeIn * rateTokenUnitsPerSttWei / 1 ether;
    }

    function setRate(uint256 nextRateTokenUnitsPerSttWei) external onlyOwner {
        rateTokenUnitsPerSttWei = nextRateTokenUnitsPerSttWei;
        emit RateUpdated(nextRateTokenUnitsPerSttWei);
    }

    function swapExactNativeForToken(uint256 minOut, address recipient, string calldata venue)
        external
        payable
        returns (uint256 tokenOut)
    {
        if (msg.value == 0) revert NoValue();
        tokenOut = quoteNativeToToken(msg.value);
        if (tokenOut < minOut) revert Slippage();
        if (!ISwapToken(token).transfer(recipient, tokenOut)) revert TransferFailed();
        emit NativeToTokenSwap(msg.sender, recipient, msg.value, tokenOut, venue);
    }

    function withdrawNative(address payable recipient, uint256 amount) external onlyOwner {
        (bool ok,) = recipient.call{ value: amount }("");
        if (!ok) revert TransferFailed();
        emit NativeWithdrawn(recipient, amount);
    }

    function withdrawToken(address recipient, uint256 amount) external onlyOwner {
        if (!ISwapToken(token).transfer(recipient, amount)) revert TransferFailed();
        emit TokenWithdrawn(recipient, amount);
    }
}
