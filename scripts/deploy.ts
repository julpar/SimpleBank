import { ethers } from "hardhat";

async function main() {

  const SimpleBank = await ethers.getContractFactory("SimpleBank");
  const simpleBank = await SimpleBank.deploy();

  await simpleBank.deployed();

  console.log("SimpleBank deployed, owner address: ", simpleBank.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
