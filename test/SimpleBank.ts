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
      
      await sut.enroll();

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

      await sut.enroll();

      expect(await sut.getBalance()).to.equal(0);
    });

  });

  describe("Deposit", function () {
    
    it("Make a deposit while not being enrolled", async function () {
      const { sut } = await loadFixture(deployContract);

      await expect(sut.deposit()).to.be.revertedWith(
          "Account is not enrolled"
      );
    });

    it("Make a deposit with zero amount", async function () {
      const { sut, owner } = await loadFixture(deployContract);

      await sut.enroll();
      
      expect(sut.deposit({ value: 0 })).to.be.revertedWith(
          "Amount must be greater than 0"
      );
    });
    
    it("Make a deposit and check balance", async function () {
      const { sut, owner } = await loadFixture(deployContract);
      
      await sut.enroll();

      let depositAmount = await ethers.utils.parseEther("1.0");

      expect(await sut.deposit({
        value: depositAmount
      }))

      expect(await sut.getBalance()).to.equal(depositAmount);
    });

  });

  describe("Withdraw", function () {

    it("Withdraw not being enrolled", async function () {
      const { sut } = await loadFixture(deployContract);

      await expect(sut.withdraw(await ethers.utils.parseEther("1.0"))).to.be.revertedWith(
          "Account is not enrolled"
      );
    });

    it("Withdraw a zero amount", async function () {
      const { sut, owner } = await loadFixture(deployContract);

      await sut.enroll();

      let depositAmount = await ethers.utils.parseEther("1.0");

      await sut.deposit({
        value: depositAmount
      });
      
      await expect(sut.withdraw(0)).to.be.revertedWith(
          "Amount must be greater than 0"
      );
    });

    it("Withdraw specified amount successfully", async function () {
      const { sut, owner } = await loadFixture(deployContract);

      await sut.enroll();
      let depositAmount = await ethers.utils.parseEther("2.0");
      
      await sut.deposit({value: depositAmount});

      let withdrawAmount = await ethers.utils.parseEther("1.0");
      
      await sut.withdraw(withdrawAmount);
      
      expect(await sut.getBalance()).to.equal(depositAmount.sub(withdrawAmount));
      
    });


    it("Withdraw all funds successfully", async function () {
      const { sut } = await loadFixture(deployContract);

      await sut.enroll();
      let depositAmount = await ethers.utils.parseEther("2.0");
      
      await sut.deposit({value: depositAmount});

      await sut.withdrawAll();
      
      expect(await sut.getBalance()).to.equal(0);
    });

  });
});
