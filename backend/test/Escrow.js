const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether"); // v6 syntax
};

describe("Escrow", function () {
  let escrow, collectibles;
  let artist, verifier, collector1, collector2;

  beforeEach(async () => {
    [artist, verifier, collector1, collector2] = await ethers.getSigners();

    // Deploy Collectibles contract
    const Collectibles = await ethers.getContractFactory("Collectibles");
    collectibles = await Collectibles.connect(artist).deploy();
    await collectibles.waitForDeployment();

    // Mint NFT
    let transaction = await collectibles
      .connect(artist)
      .mint(
        "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafkreidu5ks5cjlaccazqx2bwokjfp7ddawrxiab5b2ezjjto77ee4zzxu"
      );
    await transaction.wait(); // need to await confirmation

    // Deploy Escrow contract
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      collectibles.target, // use .target in ethers v6
      artist.address,
      verifier.address
    );
    await escrow.waitForDeployment();

    // Approve escrow to transfer NFT
    transaction = await collectibles.connect(artist).approve(escrow.target, 1); // approve called on NFT contract
    await transaction.wait();

    // List NFT in escrow
    transaction = await escrow
      .connect(artist)
      .list(1, tokens(0.005), tokens(0.005));
    await transaction.wait();
  });

  describe("deployment", () => {
    it("returns nft address", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.equal(collectibles.target);
    });

    it("returns artists address", async () => {
      const result = await escrow.artist();
      expect(result).to.equal(artist.address);
    });

    it("returns verifier address", async () => {
      const result = await escrow.verifier();
      expect(result).to.equal(verifier.address);
    });
  });

  describe("listing", async () => {
    it("updates listed status", async () => {
      const result = await escrow.isListed(1);
      expect(result).to.equal(true);
    });

    it("updates ownership", async () => {
      const result = await collectibles.ownerOf(1);
      expect(result).to.equal(escrow.target);
    });

    it("sets purchase amount and escrow amount correctly", async () => {
      expect(await escrow.purchaseAmount(1)).to.equal(tokens(0.005));
      expect(await escrow.escrowAmount(1)).to.equal(tokens(0.005));
    });
  });

  describe("deposit Escrow Fees", async () => {
    beforeEach(async () => {
      const transaction = await escrow
        .connect(collector1)
        .depositEscrow(1, { value: tokens(0.005) });
      await transaction.wait();
    });

    it("updates contract balance", async () => {
      const result = await escrow.getBalance();
      expect(result).to.equal(tokens(0.005));
    });

    it("updates the deposited mapping", async () => {
      const result = await escrow.escrowAmount(1);
      expect(result).to.equal(tokens(0.005));
    });

    it("updates buyer's address for nft", async () => {
      const result = await escrow.buyer(1);
      expect(result).to.equal(collector1.address);
    });
  });

  describe("verifies the quality of the art", async () => {
    beforeEach(async () => {
      const transaction = await escrow.connect(verifier).verifyStatus(1, true);
      await transaction.wait();
    });

    it("Updates verified status of id", async () => {
      expect(await escrow.isVerified(1)).to.equal(true);
    });
  });

  describe("Approval", async () => {
    beforeEach(async () => {
      let transaction = await escrow.connect(artist).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(verifier).approveSale(1);
      await transaction.wait();
    });

    it("updates approval", async () => {
      expect(await escrow.approval(1, artist.address)).to.be.equal(true);
      expect(await escrow.approval(1, verifier.address)).to.be.equal(true);
    });
  });

  describe("Sale", async () => {
    beforeEach(async () => {
      let transaction = await escrow
        .connect(collector1)
        .depositEscrow(1, { value: tokens(0.005) });
      await transaction.wait();

      transaction = await escrow.connect(verifier).verifyStatus(1, true);
      await transaction.wait();

      transaction = await escrow.connect(artist).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(collector1).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(verifier).approveSale(1);
      await transaction.wait();
    });

    it("transfers NFT to buyer and pays the seller", async () => {
      const sellerInitialBalance = await ethers.provider.getBalance(
        artist.address
      );

      // Finalize sale
      let transaction = await escrow.connect(collector1).finalizeSale(1);
      await transaction.wait();

      // Check NFT ownership
      const newOwner = await collectibles.ownerOf(1);
      expect(newOwner).to.equal(collector1.address);

      // Check seller received funds
      const sellerFinalBalance = await ethers.provider.getBalance(
        artist.address
      );
      expect(sellerFinalBalance).to.equal(sellerInitialBalance + tokens(0.005));

      // Check NFT is no longer listed
      const listed = await escrow.isListed(1);
      expect(listed).to.equal(false);
    });
  });
});
