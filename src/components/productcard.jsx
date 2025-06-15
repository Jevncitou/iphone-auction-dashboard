import React from "react";
import iPhoneGeneric from "../assets/images/iPhone_Generic.png";

const ProductCard = ({ model, onClick }) => {
  const fallbackImage = iPhoneGeneric;

  return (
    <div
      className="bg-zinc-800 rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer transition duration-300"
      onClick={onClick}
      style={{
        width: "150px",
        height: "180px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={model.image || fallbackImage}
        alt={model.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "contain",
          marginBottom: "10px",
        }}
      />
      <h2
        style={{
          fontSize: "14px",
          color: "#ddd",
          textAlign: "center",
        }}
      >
        {model.name}
      </h2>
    </div>
  );
};

export default ProductCard;
