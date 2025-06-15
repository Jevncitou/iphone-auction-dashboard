import React, { useState, useEffect } from "react";

const Chart = ({ chartFile, selectedGrade = "Grade_A" }) => {
  const [iframeError, setIframeError] = useState(false);

  if (!chartFile) {
    return <div style={{ color: "white", textAlign: "center" }}>Chart not available</div>;
  }

  const chartPath = `/Listings/Charts_By_Grade/${selectedGrade}/${chartFile}`;

  useEffect(() => {
    setIframeError(false); // reset error on new file load
  }, [chartFile, selectedGrade]);

  return (
    <div style={{ width: "100%", height: "100%", padding: "1rem", boxSizing: "border-box" }}>
      {iframeError ? (
        <div
          style={{
            color: "white",
            textAlign: "center",
            border: "1px solid #444",
            borderRadius: "12px",
            backgroundColor: "#1a1a1a",
            padding: "2rem"
          }}
        >
          📉 No lots sold for this model on <b>{selectedGrade.replace("_", " ")}</b>
        </div>
      ) : (
        <iframe
          src={chartPath}
          title="Auction Chart"
          width="100%"
          height="600px"
          style={{
            border: "1px solid #444",
            borderRadius: "12px",
            backgroundColor: "#1a1a1a",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => console.log(`✅ Chart loaded: ${chartPath}`)}
          onError={() => setIframeError(true)}
        />
      )}
    </div>
  );
};

export default Chart;
