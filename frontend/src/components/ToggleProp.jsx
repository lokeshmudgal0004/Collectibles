import React from "react";
import "./ToggleProp.css";

export default function ToggleProp({ art, onClose }) {
  if (!art) return null; // don't render if no art selected

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
            <button className="buy-btn">Buy</button>
            <button className="contact-btn">Contact Artist</button>
          </div>
        </div>
      </div>
    </div>
  );
}
