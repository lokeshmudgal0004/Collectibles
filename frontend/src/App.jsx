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
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [id, setId] = useState(0);
  const [nfts, setNfts] = useState([]);
  const [art, setArt] = useState({});
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true); // <-- added state

  const loadBlockchainData = async () => {
    try {
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

      for (let i = 1; i <= totalSupply; i += 1) {
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
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    } finally {
      setLoading(false); // <-- stop loading after everything
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const togglePop = (art, key) => {
    setArt(art);
    setId(key);
    toggle ? setToggle(false) : setToggle(true);
    console.log(art.description);
  };

  if (loading) {
    return <LoadingScreen />; // <-- show loading screen
  }

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
            <NFTCard
              data={nft}
              id={index + 1}
              key={index + 1}
              onClickHandler={togglePop}
            />
          ))}
        </div>
      </div>

      {toggle && (
        <ToggleProp
          provider={provider}
          escrow={escrow}
          id={id}
          art={art}
          onClose={togglePop}
        />
      )}
    </div>
  );
}
