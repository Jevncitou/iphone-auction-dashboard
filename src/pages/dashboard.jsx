import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import models from "../data/models.json";
import pricingData from "../data/price_list.json";
import upcomingData from "../data/upcoming_auctions.json";
import logo from "../assets/images/Albi_Logo_WhiteFill_TransparentBG.png";
import graphImg from "../assets/images/graph.jpg";

export default function Dashboard() {
  const [expandedBrand, setExpandedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [countdowns, setCountdowns] = useState({ Tuesday: "", Thursday: "" });
  const navigate = useNavigate(); // ✅ Hook initialized

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns({
        Tuesday: getNextCountdown("Tuesday"),
        Thursday: getNextCountdown("Thursday"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getNextCountdown = (dayName) => {
    const now = new Date();
    const targetDay = dayName === "Tuesday" ? 2 : 4;
    const nextTarget = new Date(now);
    nextTarget.setHours(12, 0, 0, 0);
    let daysUntilTarget = targetDay - now.getDay();
    if (daysUntilTarget < 0 || (daysUntilTarget === 0 && now >= nextTarget)) {
      daysUntilTarget += 7;
    }
    nextTarget.setDate(now.getDate() + daysUntilTarget);
    const diff = nextTarget - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const handleToggleBrand = (brand) => {
    setExpandedBrand(brand === expandedBrand ? null : brand);
  };

  const handleOpenModal = (model) => {
    setSelectedModel(model);
  };

  const handleCloseModal = () => {
    setSelectedModel(null);
  };

  const handleCapacityClick = (variant) => {
    const defaultGrade = variant.grades?.[0];
    if (defaultGrade?.chart) {
      navigate(`/chart?file=${encodeURIComponent(defaultGrade.chart)}`); // ✅ FIXED
    }
  };

  const groupedModels = {
    Apple: [],
    Samsung: [],
    Motorola: [],
  };

  models.forEach((model) => {
    const name = model.model.toLowerCase();
    if (name.includes("iphone")) groupedModels.Apple.push(model);
    else if (name.includes("samsung")) groupedModels.Samsung.push(model);
    else if (name.includes("moto")) groupedModels.Motorola.push(model);
  });

  const groupBySeries = (iphoneModels) => {
    const series = {
      "16 Series": [], "15 Series": [], "14 Series": [],
      "13 Series": [], "12 Series": [], "11 Series": [],
      "X Series": [], "Legacy": [], Others: []
    };
    iphoneModels.forEach(model => {
      const name = model.model.toLowerCase();
      if (name.includes("iphone 16")) series["16 Series"].push(model);
      else if (name.includes("iphone 15")) series["15 Series"].push(model);
      else if (name.includes("iphone 14")) series["14 Series"].push(model);
      else if (name.includes("iphone 13")) series["13 Series"].push(model);
      else if (name.includes("iphone 12")) series["12 Series"].push(model);
      else if (name.includes("iphone 11")) series["11 Series"].push(model);
      else if (name.includes("xr") || name.includes("xs") || name.includes("x"))
        series["X Series"].push(model);
      else if (name.includes("7") || name.includes("8"))
        series["Legacy"].push(model);
      else series["Others"].push(model);
    });
    return series;
  };

  const renderModels = (modelList) => (
    <div style={styles.modelGrid}>
      {modelList.map((model, idx) => (
        <div key={idx} style={styles.modelBox} onClick={() => handleOpenModal(model)}>
          <img src={graphImg} alt="Chart" style={styles.chartImage} />
          <div style={styles.modelName}>{model.model}</div>
        </div>
      ))}
    </div>
  );

  const renderAuctionDay = (dayName) => {
    const dayIndex = dayName === "Tuesday" ? 2 : 4;
    const filteredModels = Object.entries(upcomingData).filter(([modelName, listings]) =>
      listings.some(lot => new Date(lot.end_time).getDay() === dayIndex)
    );

    return (
      <div style={styles.folderBox}>
        <div style={styles.sectionHeader}>
          {dayName} – Next auction in: {countdowns[dayName]}
        </div>
        <div style={styles.modelGrid}>
          {models.map((model) => {
            const name = model.model;
            const isAvailable = filteredModels.some(([m]) => m === name);
            return (
              <div
                key={name}
                style={{
                  ...styles.modelBox,
                  backgroundColor: isAvailable ? "#0a0" : "#333",
                  pointerEvents: isAvailable ? "auto" : "none",
                  opacity: isAvailable ? 1 : 0.3,
                }}
                onClick={() => {
                  if (isAvailable) {
                    navigate(`/upcoming?model=${encodeURIComponent(name)}`); // ✅ FIXED
                  }
                }}
              >
                <span style={styles.modelName}>{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.wrapper}>
      {/* LOGO */}
      <div style={styles.headerContainer}>
        <div style={styles.logoBox}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h1 style={styles.title}>Albi<span style={{ fontWeight: "bold" }}>Logistics</span></h1>
        </div>
      </div>

      {/* BRAND SECTIONS */}
      {Object.entries(groupedModels).map(([brand, models], idx) => (
        <div key={idx} style={styles.folderBox}>
          <div style={styles.dropdownHeader} onClick={() => handleToggleBrand(brand)}>
            <img src={logo} alt="Brand" style={{ height: 28, filter: "invert(1)" }} />
            <span style={styles.brandName}>{brand}</span>
            <span style={styles.arrow}>{expandedBrand === brand ? "▲" : "▼"}</span>
          </div>

          {expandedBrand === brand && (
            brand === "Apple"
              ? Object.entries(groupBySeries(models)).map(([seriesName, group]) =>
                  group.length > 0 && (
                    <div key={seriesName}>
                      <h3 style={styles.sectionHeader}>{seriesName}</h3>
                      {renderModels(group)}
                    </div>
                  )
                )
              : renderModels(models)
          )}
        </div>
      ))}

      {/* UPCOMING AUCTIONS */}
      <div style={styles.folderBox}>
        <div style={styles.dropdownHeader}>
          <img src={logo} alt="Auction" style={{ height: 28, filter: "invert(1)" }} />
          <span style={styles.brandName}>Upcoming Auctions</span>
        </div>
        {renderAuctionDay("Tuesday")}
        {renderAuctionDay("Thursday")}
      </div>

      {/* MODAL */}
      {selectedModel && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>{selectedModel.model}</h2>
            <h4 style={styles.subTitle}>Capacities</h4>
            <div style={styles.variantList}>
              {selectedModel.variants.map((variant, idx) => (
                <button key={idx} style={styles.variantBtn} onClick={() => handleCapacityClick(variant)}>
                  {variant.name}
                </button>
              ))}
            </div>
            <button style={styles.closeBtn} onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// === STYLES ===
const styles = {
  wrapper: { backgroundColor: "#1a1a1a", minHeight: "100vh", padding: "1rem 2rem" },
  headerContainer: { display: "flex", justifyContent: "center", marginBottom: "2rem" },
  logoBox: { display: "flex", flexDirection: "column", alignItems: "center", padding: "1.2rem 2rem", borderRadius: 12, backgroundColor: "#111", border: "2px solid #333", boxShadow: "0 0 12px rgba(0,0,0,0.6)", minWidth: "340px" },
  logo: { height: 48, marginBottom: 8, filter: "invert(1)" },
  title: { fontSize: "1.6rem", color: "#fff", margin: "0 0 1rem" },
  folderBox: { marginBottom: "2rem", backgroundColor: "#111", borderRadius: 12, border: "1px solid #333", padding: "1rem" },
  dropdownHeader: { display: "flex", alignItems: "center", cursor: "pointer", gap: "1rem", color: "#fff", fontSize: "1.2rem", fontWeight: 600, paddingBottom: "0.5rem", borderBottom: "1px solid #333", marginBottom: "1rem" },
  brandName: { flexGrow: 1, textAlign: "left" },
  arrow: { fontSize: "1rem" },
  sectionHeader: { color: "#fff", marginBottom: "0.8rem", fontSize: "1.1rem", fontWeight: 600 },
  modelGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" },
  modelBox: { backgroundColor: "#222", borderRadius: 10, padding: "1rem", textAlign: "center", color: "#fff", cursor: "pointer", border: "1px solid #333" },
  chartImage: { width: "100%", height: "100px", objectFit: "contain", marginBottom: "0.5rem", filter: "invert(1)" },
  modelName: { fontWeight: 600, fontSize: "0.95rem" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" },
  modalContent: { backgroundColor: "#222", borderRadius: 12, padding: 24, width: "90%", maxWidth: "1000px", textAlign: "center", maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { color: "#fff", marginBottom: 8, fontSize: "1.6rem" },
  subTitle: { color: "#aaa", fontWeight: 500, marginBottom: 16 },
  variantList: { display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginBottom: "1rem" },
  variantBtn: { padding: "10px 20px", backgroundColor: "#444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  closeBtn: { marginTop: 20, padding: "10px 20px", backgroundColor: "#444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500 }
};
