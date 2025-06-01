// components/atoms/UploadProgress/UploadProgress.jsx
import React from "react";
import "./UploadProgress.css"; // Aquí defines tus estilos

const UploadProgress = ({ progress }) => (
  <div className="loader">
    <div className="loading-text">
      Loading<span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>
    </div>
    <div className="loading-bar-background">
      <div className="loading-bar" style={{ width: `${progress}%` }}>
        <div className="white-bars-container">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="white-bar"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export { UploadProgress };
