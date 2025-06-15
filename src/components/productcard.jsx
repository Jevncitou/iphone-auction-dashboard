import React from "react";
import iphoneGeneric from "../assets/images/iPhone_Generic.png";

const ProductCard = ({ product, onClick }) => {
  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = iphoneGeneric; // fallback again in case something fails
  };

  return (
    <div
      className="product-card"
      onClick={onClick}
      style={{
        width: "140px",
        height: "160px",
        backgroundColor: "#2b2b2b",
        borderRadius: "12px",
        padding: "12px",
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s",
      }}
    >
      <img
        src={iphoneGeneric}
        onError={handleImgError}
        alt={product.name}
        style={{
          width: "100%",
          height: "100px",
          objectFit: "contain",
          marginBottom: "8px",
          borderRadius: "8px",
          backgroundColor: "#1a1a1a", // fallback bg
        }}
      />
      <div
        style={{
          color: "#ccc",
          fontSize: "0.85rem",
          overflowWrap: "break-word",
        }}
      >
        {product.name}
      </div>
    </div>
  );
};

export default ProductCard;
