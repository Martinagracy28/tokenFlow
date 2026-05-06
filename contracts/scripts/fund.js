const { ethers } = require("hardhat");

async function main() {

  const tokenAddress = "0x7ab82B5063E19d3748389DdDA5291412E3B25fF4";
  const stakingAddress = "0x5F3Da0ADb23430F18ba46EE95b33d1af61EED8a6";
  const vestingAddress = "0x73585DA686Baf24E94a6DA6205c9a2778e4d3bC9";

  const token = await ethers.getContractAt("Token", tokenAddress);

  // 🔥 Send tokens to staking (for rewards)
  const tx1 = await token.transfer(
    stakingAddress,
    ethers.parseUnits("100000", 18)
  );
  await tx1.wait();
  console.log("✅ Staking funded");

  // 🔥 Send tokens to vesting
  const tx2 = await token.transfer(
    vestingAddress,
    ethers.parseUnits("50000", 18)
  );
  await tx2.wait();
  console.log("✅ Vesting funded");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});