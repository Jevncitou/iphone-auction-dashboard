import React, { useState } from 'react';
import defaultImage from '../assets/default.png';

export default function ProductCard({ model, onClick }) {
  const [imageError, setImageError] = useState(false);
  
  // Handle image loading errors
  const handleImageError = () => {
    console.log(`Failed to load image for ${model.name}`);
    setImageError(true);
  };

  return (
    <div
      className="hover:shadow-lg transition-all duration-200 bg-white rounded-xl p-4 cursor-pointer text-center"
      onClick={onClick}
    >
      <img
        src={imageError ? defaultImage : `/assets/${model.image}`}
        alt={model.name}
        className="w-full h-40 object-contain mb-3"
        onError={handleImageError}
      />
      <h3 className="text-base font-semibold text-gray-800">{model.name}</h3>
    </div>
  );
}