import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

//abis
import Collectibles from "./abis/Collectibles.json";
import Escrow from "./abis/Escrow.json";
import config from "./config.json";

import Navbar from "./components/NavBar";
import NFTCard from "./components/NFTCard";
import CollectiblesBanner from "./components/CollectiblesBanner";
import ToggleProp from "./components/ToggleProp";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);

  const [nfts, setNfts] = useState([]);
  const [art, setArt] = useState({});
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    const collectibles = new ethers.Contract(
      config[network.chainId].collectibles.address,
      Collectibles.abi,
      provider
    );

    const totalSupply = await collectibles.totalNFTs();
    const nfts = [];

    for (let i = 2; i <= totalSupply; i += 2) {
      const uri = await collectibles.tokenURI(i);
      const response = await fetch(uri);
      const metadata = await response.json();
      nfts.push(metadata);
    }

    setNfts(nfts);

    const escrow = new ethers.Contract(
      config[network.chainId].escrow.address,
      Escrow.abi,
      provider
    );
    setEscrow(escrow);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const togglePop = (art) => {
    setArt(art);
    toggle ? setToggle(false) : setToggle(true);
    console.log(art.description);
  };

  return (
    <div>
      <Navbar></Navbar>
      <CollectiblesBanner />

      <div style={{ width: "85%", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Top Picks For You
        </h2>
        <hr />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {nfts.map((nft, index) => (
            <NFTCard data={nft} key={index} onClickHandler={togglePop} />
          ))}
        </div>
      </div>

      {toggle && <ToggleProp art={art} onClose={togglePop} />}
    </div>
  );
}
