// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {

    IERC20 public stakingToken;

    uint256 public rewardRate; // reward per second (scaled)

    struct StakeInfo {
        uint256 amount;
        uint256 lastUpdated;
        uint256 rewards;
        uint256 lockEndTime;
    }

    mapping(address => StakeInfo) public stakes;

    constructor(address _token, uint256 _rewardRate) Ownable(msg.sender) {
        stakingToken = IERC20(_token);
        rewardRate = _rewardRate;
    }

    // 🔥 INTERNAL: Update rewards
    function _updateRewards(address user) internal {
        StakeInfo storage s = stakes[user];

        if (s.amount > 0) {
            uint256 timeElapsed = block.timestamp - s.lastUpdated;

            uint256 reward = (s.amount * rewardRate * timeElapsed) / 1e18;
            s.rewards += reward;
        }

        s.lastUpdated = block.timestamp;
    }

    // 🔥 Stake with lock duration (in seconds)
    function stake(uint256 amount, uint256 lockDuration) external {
        require(amount > 0, "Amount must be > 0");

        StakeInfo storage s = stakes[msg.sender];

        _updateRewards(msg.sender);

        stakingToken.transferFrom(msg.sender, address(this), amount);

        s.amount += amount;

        // 🔥 Extend lock if already staking
        uint256 newLock = block.timestamp + lockDuration;
        if (newLock > s.lockEndTime) {
            s.lockEndTime = newLock;
        }
    }

    // 🔥 Withdraw (only after lock)
    function withdraw(uint256 amount) external {
        StakeInfo storage s = stakes[msg.sender];

        require(block.timestamp >= s.lockEndTime, "Tokens are locked");
        require(s.amount >= amount, "Insufficient balance");

        _updateRewards(msg.sender);

        s.amount -= amount;

        stakingToken.transfer(msg.sender, amount);
    }

    // 🔥 Claim rewards
    function claim() external {
        _updateRewards(msg.sender);

        uint256 reward = stakes[msg.sender].rewards;
        require(reward > 0, "No rewards");

        stakes[msg.sender].rewards = 0;

        stakingToken.transfer(msg.sender, reward);
    }

    // 🔥 View pending rewards
    function pendingRewards(address user) external view returns (uint256) {
        StakeInfo memory s = stakes[user];

        if (s.amount == 0) return s.rewards;

        uint256 timeElapsed = block.timestamp - s.lastUpdated;
        uint256 reward = (s.amount * rewardRate * timeElapsed) / 1e18;

        return s.rewards + reward;
    }

    // 🔥 View remaining lock time
    function getRemainingLockTime(address user) external view returns (uint256) {
        if (block.timestamp >= stakes[user].lockEndTime) {
            return 0;
        }
        return stakes[user].lockEndTime - block.timestamp;
    }

    // 🔥 Owner can update reward rate
    function setRewardRate(uint256 _rate) external onlyOwner {
        rewardRate = _rate;
    }
}