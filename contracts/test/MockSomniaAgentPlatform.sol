// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockSomniaAgentPlatform {
    uint256 public nonce;

    event MockRequestCreated(uint256 indexed agentId, bytes input, address callback, bytes4 callbackSelector);

    function createRequest(uint256 agentId, bytes calldata input, address callback, bytes4 callbackSelector)
        external
        payable
        returns (bytes32 requestId)
    {
        requestId = keccak256(abi.encode(block.chainid, address(this), msg.sender, nonce++));
        emit MockRequestCreated(agentId, input, callback, callbackSelector);
    }
}
