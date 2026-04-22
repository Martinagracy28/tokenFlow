async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 🔹 1. Deploy Token
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(
    "TokenFlow",
    "TFLOW",
    ethers.parseUnits("1000000", 18),
    ethers.parseUnits("10000000", 18)
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token:", tokenAddress);

  // 🔹 2. Deploy Vesting
  const Vesting = await ethers.getContractFactory("Vesting");
  const vesting = await Vesting.deploy(tokenAddress);

  await vesting.waitForDeployment();
  const vestingAddress = await vesting.getAddress();
  console.log("Vesting:", vestingAddress);

  // 🔹 3. Deploy Staking
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(
    tokenAddress,
    ethers.parseUnits("0.0001", 18)
  );

  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("Staking:", stakingAddress);

  // 🔥 4. FUND CONTRACTS

  // Send tokens to staking for rewards
  await token.transfer(stakingAddress, ethers.parseUnits("100000", 18));
  console.log("Funded staking");

  // Send tokens to vesting
  await token.transfer(vestingAddress, ethers.parseUnits("50000", 18));
  console.log("Funded vesting");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});