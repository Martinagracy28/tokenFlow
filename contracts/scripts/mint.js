const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Using account:", deployer.address);

  // 🔹 Replace with your deployed Token address
  const tokenAddress = "0x7ab82B5063E19d3748389DdDA5291412E3B25fF4";

  // 🔹 Get contract instance
  const token = await ethers.getContractAt("Token", tokenAddress);

  // 🔹 Mint amount (example: 100 tokens)
  const amount = ethers.parseUnits("100", 18);

  // 🔹 Call mint
  const tx = await token.mint(deployer.address, amount);
  const txn2 = await token.mint("0xd72558ab56489747360657ab4802176ce18b49e5", amount); // Mint to another address

  console.log("Minting tokens...");

  await tx.wait();

  console.log("✅ Mint successful");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});