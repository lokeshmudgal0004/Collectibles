import React from "react";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="logo-circle">
        <h1 className="logo-text">CB</h1>
        <div className="spinner"></div>
      </div>
    </div>
  );
}
