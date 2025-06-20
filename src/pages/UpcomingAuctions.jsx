import { useLocation, useNavigate } from "react-router-dom";
import upcomingData from "../data/upcoming_auctions.json";
import AlbiLogo from "../assets/images/Albi_Logo_WhiteFill_TransparentBG.png";

// === INVISIBLE CLICK ZONE OFFSET (same as ChartPage) ===
const clickZoneOffset = {
  top: 5,
  left: 15,
  width: 300,
  height: 100,
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UpcomingAuctions() {
  const query = useQuery();
  const selectedModel = query.get("model");
  const navigate = useNavigate();

  // === Filter logic ===
  let filteredModels = Object.entries(upcomingData).filter(
    ([modelName]) => modelName.toLowerCase() === selectedModel?.toLowerCase()
  );

  if (filteredModels.length === 0 && selectedModel) {
    filteredModels = Object.entries(upcomingData).filter(
      ([modelName]) =>
        modelName.toLowerCase().includes(selectedModel.toLowerCase())
    );
  }

  const groupedByModel = filteredModels.flatMap(([modelName, listings]) =>
    listings.map((item, idx) => ({
      ...item,
      modelName,
      key: `${modelName}-${idx}`,
    }))
  );

  return (
    <div style={styles.pageWrapper}>
      {/* === Invisible Clickable Logo Zone === */}
      <div
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: `${clickZoneOffset.top}px`,
          left: `${clickZoneOffset.left}px`,
          width: `${clickZoneOffset.width}px`,
          height: `${clickZoneOffset.height}px`,
          zIndex: 100,
          cursor: "pointer",
        }}
      />

      {/* === Page Title – centered and top aligned === */}
      <h2 style={styles.pageTitle}>
        Upcoming Auctions {selectedModel ? `– ${selectedModel}` : ""}
      </h2>

      {/* === AlbiLogistics Logo Box === */}
      <div style={styles.logoBox}>
        <div style={styles.headerContent}>
          <img src={AlbiLogo} alt="Albi Logo" style={styles.logo} />
          <h1 style={styles.title}>
            Albi<span style={{ fontWeight: "bold" }}>Logistics</span>
          </h1>
        </div>
      </div>

      {/* === Grid of Auction Cards === */}
      <div style={styles.grid}>
        {groupedByModel.length === 0 ? (
          <p style={styles.noResults}>No upcoming auctions found for this model.</p>
        ) : (
          groupedByModel.map((item) => (
            <div key={item.key} style={styles.card}>
              <div style={styles.logoWrapper}>
                <img src={AlbiLogo} alt="Albi Logo" style={styles.logoCard} />
              </div>
              <img
                src={item.image_url || "https://cdn.bstock.com/iphone-default.jpg"}
                alt={item.sku}
                style={styles.productImage}
              />
              <div style={styles.content}>
                <h3 style={styles.cardTitle}>{item.sku}</h3>
                <p style={styles.location}>Flower Mound, TX, United States</p>
                <p style={styles.gradeTag}>Grade {item.grade}</p>
                <p style={styles.price}>${Number(item.units * 500).toLocaleString()}</p>
                <p style={styles.units}>{item.units} units</p>
                <p style={styles.timer}>Ends in {getTimeLeft(item.end_time)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getTimeLeft(endTimeStr) {
  const end = new Date(endTimeStr);
  const now = new Date();
  const diff = end - now;
  if (diff < 0) return "Ended";
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  return `${h}h ${m}m left`;
}

const styles = {
  pageWrapper: {
    backgroundColor: "#111",
    color: "#fff",
    padding: "2rem",
    minHeight: "100vh",
    position: "relative",
  },
  logoBox: {
    display: "inline-block",
    padding: "20px 35px",
    borderRadius: "12px",
    backgroundColor: "#111",
    userSelect: "none",
    border: "2px solid #333",
    boxShadow: "0 0 10px rgba(0,0,0,0.6)",
    zIndex: 1,
    position: "absolute",
    top: 55,
    left: 15,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logo: {
    height: "50px",
    filter: "invert(1)",
  },
  title: {
    fontSize: "1.6rem",
    lineHeight: "50px",
    margin: 0,
    padding: 0,
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    top: 10,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
  },
  noResults: {
    fontSize: "1.2rem",
    color: "#888",
    textAlign: "center",
    marginTop: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "160px",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  logoWrapper: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    backgroundColor: "#000",
    borderRadius: "50%",
    padding: 4,
    zIndex: 2,
  },
  logoCard: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    filter: "invert(1)",
  },
  productImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  content: {
    padding: "1rem",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.25rem",
  },
  location: {
    fontSize: "0.85rem",
    color: "#aaa",
    marginBottom: "0.5rem",
  },
  gradeTag: {
    color: "#55f",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  price: {
    fontSize: "1.2rem",
    color: "#0f0",
    fontWeight: 700,
    marginTop: "0.5rem",
  },
  units: {
    fontSize: "0.85rem",
    color: "#bbb",
    marginBottom: "0.5rem",
  },
  timer: {
    fontSize: "0.85rem",
    color: "#ff0",
  },
};
