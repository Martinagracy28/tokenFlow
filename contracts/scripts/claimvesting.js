const { ethers } = require("hardhat");

async function main() {

  const vestingAddress = "0x73585DA686Baf24E94a6DA6205c9a2778e4d3bC9";

  const vesting = await ethers.getContractAt("Vesting", vestingAddress);

  const tx = await vesting.claim();
  await tx.wait();

  console.log("✅ Vesting claimed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});