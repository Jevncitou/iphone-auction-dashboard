import React from 'react';
import iPhoneGeneric from '../assets/iPhone_Generic.png';

<img src={iPhoneGeneric} alt={model.name} />

export default function ProductCard({ model, onClick }) {
  return (
    <div
      className="hover:shadow-lg transition-all duration-200 bg-white rounded-xl p-4 cursor-pointer text-center"
      onClick={onClick}
    >
      <img
        src={`/assets/${model.image}`}
        alt={model.name}
        className="w-full h-40 object-contain mb-3"
      />
      <h3 className="text-base font-semibold text-gray-800">{model.name}</h3>
    </div>
  );
}
