export const STAKING_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000000000"; // Replace with deployed TFW Staking address
export const VESTING_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000000000"; // Replace with deployed TFW Vesting address
export const TOKEN_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000000000"; // Replace with TFW Token address

export const STAKING_ABI = [
  "function stake(uint256 amount, uint256 lockDuration) external",
  "function withdraw() external",
  "function claimRewards() external",
  "function pendingRewards(address user) view returns (uint256)",
  "function getStakeInfo(address user) view returns (uint256 amount, uint256 lockEnd, uint256 rewardDebt)",
  "function rewardRate() view returns (uint256)",
];

export const VESTING_ABI = [
  "function claim() external",
  "function getVestingInfo(address beneficiary) view returns (uint256 total, uint256 released, uint256 cliff, uint256 duration, uint256 start)",
];

export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
];
