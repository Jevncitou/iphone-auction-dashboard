import { useState } from "react";
import models from "../data/models.json";
import logo from "../assets/images/Albi_Logo_WhiteFill_TransparentBG.png";

export default function Dashboard() {
  const [expandedBrand, setExpandedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

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
      window.location.href = `/chart?file=${encodeURIComponent(defaultGrade.chart)}`;
    }
  };

  const categorizeIphones = (iphoneModels) => {
    const sections = {
      "Latest Models": [],
      "15 Series": [],
      "14 Series": [],
      "13 Series": [],
      "12 Series": [],
      "11 Series": [],
      "X Series": [],
      "Legacy Series": [],
      Others: [],
    };

    iphoneModels.forEach((model) => {
      const name = model.model.toLowerCase();
      if (name.startsWith("iphone 16")) sections["Latest Models"].push(model);
      else if (name.startsWith("iphone 15")) sections["15 Series"].push(model);
      else if (name.startsWith("iphone 14")) sections["14 Series"].push(model);
      else if (name.startsWith("iphone 13")) sections["13 Series"].push(model);
      else if (name.startsWith("iphone 12")) sections["12 Series"].push(model);
      else if (name.startsWith("iphone 11")) sections["11 Series"].push(model);
      else if (name.includes("xr") || name.includes("xs") || name.includes("x"))
        sections["X Series"].push(model);
      else if (name.includes("7") || name.includes("8"))
        sections["Legacy Series"].push(model);
      else sections["Others"].push(model);
    });

    return sections;
  };

  const groupedModels = {
    Apple: [],
    Samsung: [],
    Motorola: [],
  };

  // Auto-sort models into brands
  models.forEach((model) => {
    const name = model.model?.toLowerCase() || "";
    if (name.includes("iphone")) groupedModels.Apple.push(model);
    else if (name.includes("samsung")) groupedModels.Samsung.push(model);
    else if (name.includes("moto") || name.includes("motorola")) groupedModels.Motorola.push(model);
  });

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerContainer}>
        <div style={styles.logoBox}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h1 style={styles.title}>
            Albi<span style={{ fontWeight: "bold" }}>Logistics</span>
          </h1>
        </div>
      </div>

      {Object.entries(groupedModels).map(([brand, models], idx) => (
        <div key={idx} style={styles.folderBox}>
          <div
            style={styles.dropdownHeader}
            onClick={() => handleToggleBrand(brand)}
          >
            <img src={logo} alt="Brand Logo" style={{ height: 28 }} />
            <span style={styles.brandName}>{brand}</span>
            <span style={styles.arrow}>{expandedBrand === brand ? "▲" : "▼"}</span>
          </div>

          {expandedBrand === brand && (
            <div>
              {brand === "Apple"
                ? Object.entries(categorizeIphones(models)).map(
                    ([sectionTitle, sectionModels], sectionIdx) =>
                      sectionModels.length > 0 && (
                        <div key={sectionIdx} style={{ marginBottom: "1.5rem" }}>
                          <h3 style={styles.sectionHeader}>{sectionTitle}</h3>
                          <div style={styles.modelGrid}>
                            {sectionModels.map((model, index) => {
                              const chartNum = index + 1;
                              const chartPath = `/charts/chart${chartNum}.png`;
                              return (
                                <div
                                  key={model.model}
                                  style={styles.modelBox}
                                  onClick={() => handleOpenModal(model)}
                                >
                                  <img
                                    src={chartPath}
                                    alt={`Chart ${chartNum}`}
                                    style={styles.chartImage}
                                    onError={(e) => (e.target.style.display = "none")}
                                  />
                                  <span style={styles.modelName}>{model.model}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                  )
                : (
                  <div style={styles.modelGrid}>
                    {models.length === 0 ? (
                      <p style={{ color: "#aaa", paddingLeft: "0.5rem" }}>No models available yet.</p>
                    ) : (
                      models.map((model, index) => {
                        const chartNum = index + 1;
                        const chartPath = `/charts/chart${chartNum}.png`;
                        return (
                          <div
                            key={model.model}
                            style={styles.modelBox}
                            onClick={() => handleOpenModal(model)}
                          >
                            <img
                              src={chartPath}
                              alt={`Chart ${chartNum}`}
                              style={styles.chartImage}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                            <span style={styles.modelName}>{model.model}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      ))}

      {selectedModel && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>{selectedModel.model}</h2>
            <h4 style={styles.subTitle}>Capacities</h4>
            <div style={styles.variantList}>
              {selectedModel.variants.map((variant, idx) => (
                <button
                  key={idx}
                  style={styles.variantBtn}
                  onClick={() => handleCapacityClick(variant)}
                >
                  {variant.name}
                </button>
              ))}
            </div>
            <button style={styles.closeBtn} onClick={handleCloseModal}>
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
    padding: "1rem 2rem",
    boxSizing: "border-box",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  logoBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.2rem 2rem",
    borderRadius: 12,
    backgroundColor: "#111",
    border: "2px solid #333",
    boxShadow: "0 0 12px rgba(0,0,0,0.6)",
    minWidth: "340px",
  },
  logo: {
    height: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: "1.6rem",
    color: "#fff",
    margin: "0 0 1rem",
  },
  folderBox: {
    marginBottom: "2rem",
    backgroundColor: "#111",
    borderRadius: 12,
    border: "1px solid #333",
    padding: "1rem",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "1rem",
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: 600,
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #333",
    marginBottom: "1rem",
  },
  brandName: {
    flexGrow: 1,
    textAlign: "left",
  },
  arrow: {
    fontSize: "1rem",
  },
  sectionHeader: {
    color: "#fff",
    marginBottom: "0.8rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    paddingLeft: "0.5rem",
  },
  modelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1rem",
  },
  modelBox: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: "0.5rem",
    textAlign: "center",
    color: "#fff",
    cursor: "pointer",
    border: "1px solid #333",
    transition: "transform 0.2s ease",
  },
  chartImage: {
    width: "100%",
    height: "100px",
    objectFit: "contain",
    marginBottom: "0.5rem",
  },
  modelName: {
    fontWeight: 500,
    fontSize: "0.95rem",
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
