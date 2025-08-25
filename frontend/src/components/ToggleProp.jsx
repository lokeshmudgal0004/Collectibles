import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./ToggleProp.css";

export default function ToggleProp({ provider, escrow, id, art, onClose }) {
  if (!art) return null; // don't render if no art selected

  const [hasBought, setHasBought] = useState(false);

  const [buyer, setBuyer] = useState(null);

  const buyHandler = async () => {
    const escrowAmount = await escrow.escrowAmount(id);
    const signer = await provider.getSigner();

    // Buyer deposit earnest
    let transaction = await escrow
      .connect(signer)
      .depositEscrow(id, { value: escrowAmount });
    await transaction.wait();

    // Buyer approves...
    transaction = await escrow.connect(signer).approveSale(id);
    await transaction.wait();

    setHasBought(true);

    const buyer = await escrow.buyer(id);
    setBuyer(buyer);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        {/* LEFT: Image */}
        <div className="overlay-image">
          <img src={art.image} alt={art.name} />
        </div>

        {/* RIGHT: Details */}
        <div className="overlay-details">
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>

          <h1 className="title">{art.name}</h1>
          <p className="artist">by {art.artist}</p>
          <p className="price">
            {
              art.attributes.find((a) => a.trait_type === "Purchase Price")
                .value
            }{" "}
            ETH
          </p>

          <h3>Overview</h3>
          <p>{art.description}</p>

          <h3>Facts & Features</h3>
          <ul>
            {art.attributes.map((attr, index) => (
              <li key={index}>
                <b>{attr.trait_type}:</b> {attr.value}
              </li>
            ))}
            <li>
              <b>Created At:</b> {art.created_at}
            </li>
          </ul>

          <div className="actions">
            <button
              className="buy-btn"
              onClick={buyHandler}
              disabled={hasBought}
            >
              {hasBought ? "Purchased" : "Buy"}
            </button>
            <button className="contact-btn">Contact Artist</button>
          </div>
        </div>
      </div>
    </div>
  );
}
