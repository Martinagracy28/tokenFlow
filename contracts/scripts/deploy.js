async function main() {
  const Token = await ethers.getContractFactory("Token");

  const token = await Token.deploy(
    "TokenFlow",
    "TFLOW",
    ethers.parseUnits("1000000", 18),
    ethers.parseUnits("10000000", 18)
  );

  await token.waitForDeployment();

  console.log("Token deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});