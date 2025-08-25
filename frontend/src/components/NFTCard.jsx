import React, { useState } from "react";
import "./NFTCard.css";

export default function NFTCard({ data, key, onClickHandler }) {
  const [showAttributes, setShowAttributes] = useState(false);

  // Extract purchase price if it exists
  const purchasePrice = data.attributes.find(
    (attr) => attr.trait_type.toLowerCase() === "purchase price"
  );

  return (
    <div className="nft-card" key={key} onClick={() => onClickHandler(data)}>
      {/* Image */}
      <div className="nft-image">
        <img src={data.image} alt={data.name} />
      </div>

      {/* Content */}
      <div className="nft-content">
        <h2 className="nft-title">{data.name}</h2>
        <p className="nft-description">{data.description}</p>

        <div className="nft-meta">
          <span>
            <strong>Artist:</strong> {data.artist}
          </span>
          <span>
            <strong>Created:</strong> {data.created_at}
          </span>
        </div>

        {/* Highlight purchase price */}
        {purchasePrice && (
          <div className="nft-price">
            <strong>Price:</strong> {purchasePrice.value} ETH
          </div>
        )}

        <br />
        {/* Attributes toggle */}
        <button
          className="toggle-btn"
          onClick={() => setShowAttributes(!showAttributes)}
        >
          {showAttributes ? "Hide Attributes ▲" : "Show Attributes ▼"}
        </button>

        {/* Attributes list (excluding purchase price to avoid duplicate) */}
        {showAttributes && (
          <div className="nft-attributes">
            {data.attributes
              .filter(
                (attr) => attr.trait_type.toLowerCase() !== "purchase price"
              )
              .map((attr, index) => (
                <div key={index} className="attribute">
                  <span className="trait">{attr.trait_type}:</span>
                  <span className="value">{attr.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
