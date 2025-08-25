// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VIPMembership is ReentrancyGuard {
    uint256 public membershipPrice = 0.1 ether;
    uint256 public membershipDuration = 30 days;
    address public owner;
    mapping(address => uint256) public membershipExpiry;
    mapping(address => uint256) public withdrawalRequests;

    event MembershipPurchased(address indexed member, uint256 expiryDate);
    event PriceUpdated(uint256 newPrice);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event WithdrawalRequested(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function buyMembership() external payable nonReentrant {
        require(msg.value >= membershipPrice, "Insufficient payment");

        uint256 newExpiry;

        if (membershipExpiry[msg.sender] > block.timestamp) {
            newExpiry = membershipExpiry[msg.sender] + membershipDuration;
        } else {
            newExpiry = block.timestamp + membershipDuration;
        }

        membershipExpiry[msg.sender] = newExpiry;

        if (msg.value > membershipPrice) {
            payable(msg.sender).transfer(msg.value - membershipPrice);
        }

        emit MembershipPurchased(msg.sender, newExpiry);
    }

    function isVIPMember(address member) external view returns (bool) {
        return membershipExpiry[member] > block.timestamp;
    }

    function getMembershipExpiry(address member) external view returns (uint256) {
        return membershipExpiry[member];
    }

    function updatePrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than zero");
        membershipPrice = newPrice;
        emit PriceUpdated(newPrice);
    }

    function requestWithdrawal(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(amount <= address(this).balance, "Insufficient contract balance");
        withdrawalRequests[owner] = amount;
        emit WithdrawalRequested(owner, amount);
    }

    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 amount = withdrawalRequests[owner];
        require(amount > 0, "No withdrawal requested");
        withdrawalRequests[owner] = 0;
        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
