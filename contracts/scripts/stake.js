const { ethers } = require("hardhat");

async function main() {

  const tokenAddress = "0x7ab82B5063E19d3748389DdDA5291412E3B25fF4";
  const stakingAddress = "0x5F3Da0ADb23430F18ba46EE95b33d1af61EED8a6";

  const [user] = await ethers.getSigners();
  console.log("User:", user.address);

  const token = await ethers.getContractAt("Token", tokenAddress);
  const staking = await ethers.getContractAt("Staking", stakingAddress);

  const amount = ethers.parseUnits("1000", 18);

  // 🔥 Approve staking contract
  const approveTx = await token.approve(stakingAddress, amount);
  await approveTx.wait();
  console.log("✅ Approved staking");

  // 🔥 Stake with 2 min lock
  const stakeTx = await staking.stake(amount, 120);
  await stakeTx.wait();

  console.log("✅ Staked successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});