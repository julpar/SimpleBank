import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SimpleBank", function () {

  async function deployContract() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SimpleBank = await ethers.getContractFactory("SimpleBank");
    const sut = await SimpleBank.deploy();

    return { sut, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner after deploy", async function () {
      const { sut, owner } = await loadFixture(deployContract);
      
      expect(await sut.owner()).to.equal(owner.address);
    });

  });


  describe("Enrollment", function () {
    it("Check for enrollment before and after", async function () {
      const { sut, owner } = await loadFixture(deployContract);

      expect(await sut.isEnrolled(owner.address)).false;
      
      sut.enroll();

      expect(await sut.isEnrolled(owner.address)).true;
    });

    it("Should emit an event on enrollment", async function () {
      const { sut, owner } = await loadFixture(deployContract);
      
      await expect(sut.enroll())
          .to.emit(sut, "LogEnrolled")
          .withArgs( owner.address);
    });
    
    

  });

  describe("Balance", function () {
    it("Check balance for an unrolled account", async function () {
      const { sut } = await loadFixture(deployContract);

      await expect(sut.getBalance()).to.be.revertedWith(
          "Account is not enrolled"
      );
    });

    it("Check balance for an enrolled account", async function () {
      const { sut, owner } = await loadFixture(deployContract);

      sut.enroll();

      expect(await sut.getBalance()).to.equal(0);
    });

  });
  
  
});
