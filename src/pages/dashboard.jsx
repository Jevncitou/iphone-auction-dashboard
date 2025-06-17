import { useState } from "react";
import models from "../data/models.json";
import logo from "../assets/images/Albi_Logo_WhiteFill_TransparentBG.png";
import fallbackImage from "../assets/images/iPhone_Generic.png";

export default function Dashboard() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleClose = () => {
    setSelectedGroup(null);
  };

  const handleVariantClick = (variant) => {
    const defaultGrade = variant.grades?.[0];
    if (defaultGrade?.chart) {
      window.location.href = `/chart?file=${encodeURIComponent(defaultGrade.chart)}`;
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.title}>AlbiLogistics</span>
        <img src={logo} alt="Albi Logo" style={styles.logo} />
      </div>

      <div style={styles.grid}>
        {models.map((group, index) => (
          <div key={index} style={styles.card} onClick={() => handleGroupClick(group)}>
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
            <h4 style={styles.subTitle}>Capacities</h4>

            <div style={styles.variantList}>
              {selectedGroup.variants.map((variant, idx) => (
                <button
                  key={idx}
                  style={styles.variantBtn}
                  onClick={() => handleVariantClick(variant)}
                >
                  {variant.name}
                </button>
              ))}
            </div>

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
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    alignItems: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#fff",
  },
  logo: {
    height: 40,
    objectFit: "contain",
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
    marginBottom: 8,
    fontSize: "1.6rem",
  },
  subTitle: {
    color: "#aaa",
    fontWeight: 500,
    marginBottom: 16,
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
