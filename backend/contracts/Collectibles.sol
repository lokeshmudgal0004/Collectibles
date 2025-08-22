//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collectibles is ERC721URIStorage {
  uint256 private tokenCounter;

  constructor() ERC721("Collectibles" , "CB") {
    tokenCounter = 0;
  }



  function mint(string memory tokenURI) public returns (uint256) {
    tokenCounter += 1;

    uint256 tokenId = tokenCounter;
    _mint(msg.sender , tokenId); //mints a new NFT with id (tokenId) and assigns its ownership to the sender
    _setTokenURI(tokenId, tokenURI); //sets the tokenURI of the NFT with given token ID , the argument is an IPFS Link.

    
    return tokenId;
  }

  function burn(uint256 tokenId) public  {
    require(ownerOf(tokenId) == msg.sender, "You are not the owner");
    _burn(tokenId);
  }

  function totalNFTs() public view returns (uint256) { //minted not alive
    return tokenCounter;
  }
}