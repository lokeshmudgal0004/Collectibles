const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Collectibles", function () {
  let collectibles;
  let owner;
  let add1;
  let add2;

  this.beforeEach(async function () {
    [owner, add1, add2] = await ethers.getSigners();
    let Collectibles = await ethers.getContractFactory("Collectibles", owner);
    collectibles = await Collectibles.deploy();
  });

  describe("deployment", async function () {
    it("Should have the correct name and symbol", async function () {
      expect(await collectibles.name()).to.equal("Collectibles");
      expect(await collectibles.symbol()).to.equal("CB");
    });

    it("Should initialize tokenCounter to 0", async function () {
      expect(await collectibles.totalNFTs()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow another address to mint and own a token", async function () {
      const tokenURI = "ipfs://testuri";
      // Use .connect(addr1) to send the transaction from the addr1 account
      const mintTx = await collectibles.connect(add1).mint(tokenURI);
      const receipt = await mintTx.wait();

      // The owner of the new NFT should be addr1, not the default owner
      expect(await collectibles.ownerOf(1)).to.equal(add1.address);
    });

    it("Should increment the tokenCounter after each mint", async function () {
      const tokenURI1 = "ipfs://testuri1";
      const tokenURI2 = "ipfs://testuri2";

      await collectibles.mint(tokenURI1);
      expect(await collectibles.totalNFTs()).to.equal(1);

      await collectibles.mint(tokenURI2);
      expect(await collectibles.totalNFTs()).to.equal(2);
    });
  });

  describe("NFTSupply", function () {
    it("gives the correct value of total number of NFTs", async function () {
      const tokenURI1 = "ipfs://testuri1";
      const tokenURI2 = "ipfs://testuri2";

      await collectibles.mint(tokenURI1);
      await collectibles.mint(tokenURI2);

      expect(await collectibles.totalNFTs()).to.equal(2);
    });
  });
});
