const hre = require("hardhat");
const { ethers } = hre;

const tokens = (n) => ethers.parseUnits(n.toString(), "ether");

async function main() {
  console.log("🛠  Starting deploy...\n");

  // ---------------------------------------------------------------------------
  // Accounts
  // ---------------------------------------------------------------------------
  const [artist, verifier, collector1, collector2] = await ethers.getSigners();
  console.log("👤 Artist   :", artist.address);
  console.log("👤 Verifier :", verifier.address);
  console.log("👤 Collector1:", collector1.address);
  console.log("👤 Collector2:", collector2.address);

  // ---------------------------------------------------------------------------
  // Deploy Collectibles (ERC721)
  // ---------------------------------------------------------------------------
  const Collectibles = await ethers.getContractFactory("Collectibles");
  const collectibles = await Collectibles.connect(artist).deploy();
  await collectibles.waitForDeployment();
  console.log("\n✅ Collectibles deployed at:", collectibles.target);

  // ---------------------------------------------------------------------------
  // Mint some NFTs to the artist
  // Assumes Collectibles has mint(string memory tokenURI) that mints to msg.sender
  // ---------------------------------------------------------------------------
  const tokenURIs = [
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/1.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/2.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/3.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/4.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/5.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/6.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/7.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/8.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/9.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/10.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/11.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/12.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/13.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/14.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/15.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/16.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/17.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/18.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/19.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/20.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/21.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/22.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/23.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/24.json",
    "https://coffee-junior-hawk-271.mypinata.cloud/ipfs/bafybeibomed5dh7s6w6rbxjjxlmtt34eehh53d2sgn6dbkb3ruds6twnqa/25.json",
  ];

  for (let i = 0; i < tokenURIs.length; i++) {
    const tx = await collectibles.connect(artist).mint(tokenURIs[i]);
    await tx.wait();
    console.log(`🖼  Minted tokenId ${i + 1} to artist`);
  }

  // ---------------------------------------------------------------------------
  // Deploy Escrow (nftAddress, artist, verifier)  <-- your current constructor
  // ---------------------------------------------------------------------------
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    collectibles.target,
    artist.address,
    verifier.address
  );
  await escrow.waitForDeployment();
  console.log("\n✅ Escrow deployed at      :", escrow.target);

  // ---------------------------------------------------------------------------
  // Approve Escrow to transfer each NFT on behalf of artist
  // ---------------------------------------------------------------------------
  for (let tokenId = 1; tokenId <= tokenURIs.length; tokenId++) {
    const tx = await collectibles
      .connect(artist)
      .approve(escrow.target, tokenId);
    await tx.wait();
    console.log(`✔️  Approved Escrow for tokenId ${tokenId}`);
  }

  // ---------------------------------------------------------------------------
  // List NFTs in Escrow
  // Your current list signature (from tests): list(uint256 _nftId, uint256 _purchasePrice, uint256 _escrowPrice)
  // ---------------------------------------------------------------------------
  const listings = [
    { tokenId: 1, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 2, price: tokens(0.0075), escrowFee: tokens(0.0075) },
    { tokenId: 3, price: tokens(0.01), escrowFee: tokens(0.01) },
    { tokenId: 4, price: tokens(0.0125), escrowFee: tokens(0.0125) },
    { tokenId: 5, price: tokens(0.015), escrowFee: tokens(0.015) },
    { tokenId: 6, price: tokens(0.0175), escrowFee: tokens(0.0175) },
    { tokenId: 7, price: tokens(0.02), escrowFee: tokens(0.02) },
    { tokenId: 8, price: tokens(0.025), escrowFee: tokens(0.025) },
    { tokenId: 9, price: tokens(0.007), escrowFee: tokens(0.007) },
    { tokenId: 10, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 11, price: tokens(0.01), escrowFee: tokens(0.01) },
    { tokenId: 12, price: tokens(0.008), escrowFee: tokens(0.008) },
    { tokenId: 13, price: tokens(0.009), escrowFee: tokens(0.009) },
    { tokenId: 14, price: tokens(0.006), escrowFee: tokens(0.006) },
    { tokenId: 15, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 16, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 17, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 18, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 19, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 20, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 21, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 22, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 23, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 24, price: tokens(0.005), escrowFee: tokens(0.005) },
    { tokenId: 25, price: tokens(0.005), escrowFee: tokens(0.005) },
  ];

  for (const { tokenId, price, escrowFee } of listings) {
    const tx = await escrow.connect(artist).list(tokenId, price, escrowFee);
    await tx.wait();
    console.log(
      `📋 Listed tokenId ${tokenId} | price: ${ethers.formatEther(
        price
      )} ETH | escrow: ${ethers.formatEther(escrowFee)} ETH`
    );
  }

  console.log("\n🎉 All done! Your marketplace is ready:");
  console.log("   • Collectibles:", collectibles.target);
  console.log("   • Escrow      :", escrow.target);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
