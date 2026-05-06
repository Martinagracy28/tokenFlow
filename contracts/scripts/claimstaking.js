const { ethers } = require("hardhat");

async function main() {

  const stakingAddress = "0x5F3Da0ADb23430F18ba46EE95b33d1af61EED8a6";

  const staking = await ethers.getContractAt("Staking", stakingAddress);

  const tx = await staking.claim();
  await tx.wait();

  console.log("✅ Staking rewards claimed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});