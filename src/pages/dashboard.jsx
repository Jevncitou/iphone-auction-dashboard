import { useState } from "react";
import models from "../data/models.json";
import Header from "../components/Header";
import fallbackImage from "../assets/images/iPhone_Generic.png";
import Chart from "../components/Chart"; // ✅ Import your Chart component

export default function Dashboard() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setSelectedVariant(null);
  };

  const handleClose = () => {
    setSelectedGroup(null);
    setSelectedVariant(null);
  };

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.grid}>
        {models.map((group, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => handleGroupClick(group)}
          >
            <img
              src={fallbackImage}
              alt={group.model}
              style={styles.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />
            <span style={styles.label}>{group.model}</span>
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>{selectedGroup.model}</h2>

            <div style={styles.variantList}>
              {selectedGroup.variants.map((variant, idx) => (
                <button
                  key={idx}
                  style={{
                    ...styles.variantBtn,
                    backgroundColor:
                      selectedVariant?.name === variant.name ? "#666" : "#444",
                  }}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.name}
                </button>
              ))}
            </div>

            {selectedVariant && (
              <div style={styles.chartContainer}>
                <h4 style={styles.chartTitle}>{selectedVariant.name}</h4>
                <Chart chartFile={selectedVariant.chart} /> {/* ✅ Use Chart component */}
              </div>
            )}

            <button style={styles.closeBtn} onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    paddingBottom: "3rem",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1.5rem",
    padding: "2rem",
  },
  card: {
    width: 160,
    height: 180,
    padding: 12,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "center",
    color: "#f2f2f2",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease-in-out",
  },
  image: {
    width: 80,
    height: 80,
    objectFit: "contain",
    marginBottom: 10,
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: "1000px",
    textAlign: "center",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: {
    color: "#fff",
    marginBottom: 20,
    fontSize: "1.5rem",
  },
  variantList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  variantBtn: {
    padding: "10px 20px",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
  },
  chartContainer: {
    marginTop: "1rem",
    textAlign: "center",
    color: "#fff",
  },
  chartTitle: {
    marginBottom: "1rem",
    fontSize: "1.1rem",
  },
  closeBtn: {
    marginTop: 20,
    padding: "10px 20px",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
};
