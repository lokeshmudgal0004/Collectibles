// Navbar.jsx
import React from "react";
import { useEffect, useState } from "react";
import "./Navbar.css"; // import the CSS file

export default function Navbar() {
  let [account, setAccount] = useState(null);

  useEffect(() => {
    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  }, []);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };
  return (
    <nav className="navbar">
      {/* Left Section - Logo & Search */}
      <div className="navbar-left">
        <div className="logo">
          <div className="logo-box">CB</div>
          <span className="logo-text">Collectibles</span>
        </div>
        <input
          type="text"
          placeholder="Search for collections, NFTs or users"
          className="search-input"
        />
      </div>

      {/* Middle Section - Links */}
      <div className="navbar-links">
        <a href="#">Create</a>
        <a href="#">Explore</a>
        <a href="#">Sell</a>
      </div>

      {/* Right Section - Buttons */}
      <div className="navbar-right">
        <button className="yellow-btn">W3</button>
        {account ? (
          <button className="wallet-btn">
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
          </button>
        ) : (
          <button className="wallet-btn" onClick={connectHandler}>
            Connect wallet
          </button>
        )}
        <button className="cart-btn">👜</button>
      </div>
    </nav>
  );
}
