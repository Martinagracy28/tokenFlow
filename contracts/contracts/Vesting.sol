// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vesting is Ownable {

    IERC20 public token;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 start;
        uint256 cliff;
        uint256 duration;
    }

    mapping(address => VestingSchedule) public vestings;

    constructor(address tokenAddress) Ownable(msg.sender) {
        token = IERC20(tokenAddress);
    }

    // 🔥 Add vesting schedule (only owner)
    function addVesting(
        address beneficiary,
        uint256 amount,
        uint256 start,
        uint256 cliffDuration,
        uint256 duration
    ) external onlyOwner {

        require(beneficiary != address(0), "Invalid address");
        require(amount > 0, "Amount must be > 0");
        require(duration > 0, "Duration must be > 0");

        vestings[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            start: start,
            cliff: start + cliffDuration,
            duration: duration
        });
    }

    // 🔥 Calculate releasable amount
    function releasable(address beneficiary) public view returns (uint256) {
        VestingSchedule memory v = vestings[beneficiary];

        if (block.timestamp < v.cliff) {
            return 0;
        }

        if (block.timestamp >= v.start + v.duration) {
            return v.totalAmount - v.releasedAmount;
        }

        uint256 vested = (v.totalAmount * (block.timestamp - v.start)) / v.duration;
        return vested - v.releasedAmount;
    }

    // 🔥 Claim tokens
    function claim() external {
        VestingSchedule storage v = vestings[msg.sender];

        uint256 amount = releasable(msg.sender);
        require(amount > 0, "No tokens to claim");

        v.releasedAmount += amount;

        token.transfer(msg.sender, amount);
    }
}