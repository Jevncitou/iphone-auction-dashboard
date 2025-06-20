import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AlbiLogo from "../assets/images/Albi_Logo_WhiteFill_TransparentBG.png";
import Papa from "papaparse";
import SearchBar from "../components/SearchBar";

const GRADES = ["AA", "A", "B", "C"];

// === Position the INVISIBLE clickable box ===
const clickZoneOffset = {
  top: 5,   // Move up
  left: 15,    // Move left
  width: 300, // Width of clickable area
  height: 100, // Height of clickable area
};

export default function ChartPage() {
  const iframeRef = useRef();
  const [params] = useSearchParams();
  const chartFile = params.get("file");
  const navigate = useNavigate();

  const [baseName, setBaseName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("A");
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!chartFile || !chartFile.endsWith(".html")) {
      iframeRef.current.src = "/emptychart.html";
      return;
    }

    const fullUrl = `/Charts_By_Grade/${chartFile}`;
    const fallbackUrl = fullUrl.replace(".html", ".empty.html");

    fetch(fullUrl, { method: "HEAD" }).then((res) => {
      iframeRef.current.src = res.ok ? fullUrl : fallbackUrl;
    });

    const parts = chartFile.split("/");
    const rawName = parts[parts.length - 1].replace(".html", "");
    setBaseName(rawName);
  }, [chartFile]);

  useEffect(() => {
    if (!baseName || !selectedGrade) return;

    const csvPath = `/Model_Lots_By_Grade/Grade_${selectedGrade}/${baseName}.csv`;

    fetch(csvPath)
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data.map((row) => ({
              model: row["full_model"]?.trim() || "",
              capacity: row["normalized_capacity"]?.trim() || "",
              grade: row["grade"]?.trim() || "",
              bid: row["bid"]?.trim() || "",
              units: row["units"]?.trim() || "",
              price_per_unit: row["price_per_unit"]?.trim() || "",
              date: formatDate(row["date_closed"]),
            }));
            setSales(data);
          },
        });
      })
      .catch(() => setSales([]));
  }, [baseName, selectedGrade]);

  const formatDate = (rawDate) => {
    if (!rawDate || typeof rawDate !== "string") return "";
    const parts = rawDate.split(" ");
    return parts.length >= 2 ? `${parts[0]} ${parts[1].replace(",", "")}` : rawDate;
  };

  const handleModelSelect = (modelName) => {
    const file = modelName.replaceAll(" ", "_");
    navigate(`/chart?file=${file}.html`);
  };

  return (
    <div style={styles.container}>
      {/* === INVISIBLE CLICKABLE ZONE === */}
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

      {/* === LOGO BOX VISIBLE === */}
      <div style={styles.logoBox}>
        <div style={styles.headerContent}>
          <img src={AlbiLogo} alt="Albi Logo" style={styles.logo} />
          <h1 style={styles.title}>
            Albi<span style={{ fontWeight: "bold" }}>Logistics</span>
          </h1>
        </div>
      </div>

      <div style={styles.searchWrapper}>
        <SearchBar onSelect={handleModelSelect} />
      </div>

      <div style={styles.chartWrapper}>
        <iframe
          ref={iframeRef}
          title="Auction Chart"
          width="100%"
          height="600px"
          style={styles.iframe}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <div style={styles.salesSection}>
        <div style={styles.gradeFilter}>
          <label htmlFor="gradeSelect">🟪 Filter by Grade:</label>{" "}
          <select
            id="gradeSelect"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            style={styles.dropdown}
          >
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
        </div>

        <h2>History of Sales:</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Model</th>
              <th style={styles.th}>Capacity</th>
              <th style={styles.th}>Grade</th>
              <th style={styles.th}>Bid</th>
              <th style={styles.th}>Units</th>
              <th style={styles.th}>Price/Unit</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((s, i) => (
                <tr key={i}>
                  <td style={styles.td}>{s.model}</td>
                  <td style={styles.td}>{s.capacity}</td>
                  <td style={styles.td}>{s.grade}</td>
                  <td style={styles.td}>{s.bid}</td>
                  <td style={styles.td}>{s.units}</td>
                  <td style={styles.td}>{s.price_per_unit}</td>
                  <td style={styles.td}>{s.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={styles.td}>
                  No matching sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#eee",
    padding: "10px 20px",
    boxSizing: "border-box",
  },
  logoBox: {
    display: "inline-block",
    padding: "20px 35px",
    borderRadius: "12px",
    backgroundColor: "#111",
    userSelect: "none",
    border: "2px solid #333",
    boxShadow: "0 0 10px rgba(0,0,0,0.6)",
    transition: "background-color 0.2s",
    zIndex: 1,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logo: {
    height: "50px",
    filter: "invert(1)", // ✅ Ensures white logo stays visible on dark bg
  },
  title: {
    fontSize: "1.6rem",
    lineHeight: "50px",
    margin: "0px",
    padding: "0px",
  },
  searchWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: "-70px",
    zIndex: 10,
  },
  chartWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  iframe: {
    width: "90%",
    maxWidth: "1000px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#111",
  },
  salesSection: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    paddingTop: "20px",
  },
  gradeFilter: {
    marginBottom: "10px",
  },
  dropdown: {
    padding: "5px",
    backgroundColor: "#222",
    color: "#eee",
    border: "1px solid #444",
    borderRadius: "5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#111",
    fontFamily: "monospace",
    fontSize: "0.9rem",
  },
  th: {
    borderBottom: "1px solid #444",
    padding: "12px 8px",
    textAlign: "left",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #333",
    verticalAlign: "top",
  },
};
