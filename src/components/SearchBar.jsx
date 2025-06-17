import { useState, useEffect, useRef } from "react";
import modelsData from "../data/models.json";

export default function SearchBar() {
  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredModels, setFilteredModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setModels(modelsData);
    setFilteredModels(modelsData);
  }, []);

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setSearchTerm(model.model);
  };

  const handleVariantClick = (variant) => {
    const defaultGrade = variant.grades?.[0];
    if (defaultGrade?.chart) {
      window.location.href = `/chart?file=${encodeURIComponent(defaultGrade.chart)}`;
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
    setSelectedModel(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);
    setFilteredModels(
      models.filter((m) => m.model.toLowerCase().includes(value))
    );
    setSelectedModel(null);
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={inputRef}
      style={{
        position: "relative",
        margin: "0 auto",
        width: "80%",
        maxWidth: 500,
        paddingTop: "1rem",
      }}
    >
      <input
        type="text"
        placeholder="Search for a model..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        style={{
          width: "100%",
          padding: "10px 15px",
          borderRadius: 6,
          border: "1px solid #555",
          fontSize: "1rem",
          backgroundColor: "#222",
          color: "#fff",
        }}
      />

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            backgroundColor: "#1e1e1e",
            border: "1px solid #444",
            borderRadius: 6,
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 100,
            padding: 10,
          }}
        >
          {!selectedModel &&
            filteredModels.slice(0, 30).map((model, idx) => (
              <div
                key={idx}
                onClick={() => handleModelClick(model)}
                style={{
                  padding: "8px 10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #333",
                  color: "#fff",
                }}
              >
                {model.model}
              </div>
            ))}

          {selectedModel && (
            <div>
              <div style={{ marginBottom: 8, color: "#aaa", fontWeight: 500 }}>
                Capacities for {selectedModel.model}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {selectedModel.variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => handleVariantClick(variant)}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#444",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
