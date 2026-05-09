const { ethers } = require("hardhat");

async function main() {

  const vestingAddress = "0x73585DA686Baf24E94a6DA6205c9a2778e4d3bC9";

  const [owner] = await ethers.getSigners();
  console.log("Owner:", owner.address);

  const vesting = await ethers.getContractAt("Vesting", vestingAddress);

  const now = Math.floor(Date.now() / 1000);

  const tx = await vesting.addVesting(
    owner.address,
    ethers.parseUnits("1000", 18),
    now,
    60,   // 1 min cliff
    300   // 5 min duration
  );

  await tx.wait();

  console.log("✅ Vesting added");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});