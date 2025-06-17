import { useEffect, useRef, useState } from "react";

export default function Chart({ chartFile }) {
  const iframeRef = useRef();
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const checkFile = async () => {
      if (!chartFile || !chartFile.endsWith(".html")) {
        iframeRef.current.src = "/emptychart.html";
        return;
      }

      const fullUrl = `/Charts_By_Grade/${chartFile}`;
      const fallbackUrl = fullUrl.replace(".html", ".empty.html");

      try {
        const res = await fetch(fullUrl, { method: "HEAD" });
        iframeRef.current.src = res.ok ? fullUrl : fallbackUrl;
      } catch {
        iframeRef.current.src = fallbackUrl;
      }
    };

    checkFile();
  }, [chartFile]);

  const move = (dx, dy) => {
    setXOffset(prev => prev + dx);
    setYOffset(prev => prev + dy);
  };

  return (
    <div style={{ padding: "20px", position: "relative", textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => move(0, -20)}>↑</button>
        <button onClick={() => move(-20, 0)} style={{ margin: "0 10px" }}>←</button>
        <button onClick={() => move(20, 0)}>→</button>
        <button onClick={() => move(0, 20)} style={{ marginLeft: "10px" }}>↓</button>
      </div>

      <div
        style={{
          transform: `translate(${xOffset}px, ${yOffset}px)`,
          transition: "transform 0.2s ease-out",
          display: "inline-block",
        }}
      >
        <iframe
          ref={iframeRef}
          title="Auction Chart"
          width="1000px"
          height="500px"
          style={{
            border: "1px solid #333",
            borderRadius: "10px",
            backgroundColor: "#111",
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
