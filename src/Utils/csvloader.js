export async function preloadCSVData() {
  const context = import.meta.glob("/public/data/Model_Lots/*.csv", { as: "raw" });
  const data = {};

  for (const path in context) {
    const rawCSV = await context[path]();
    const filename = path.split("/").pop().replace(".csv", "");

    const rows = rawCSV.split("\n").slice(1).filter(r => r.trim().length > 0);
    data[filename] = rows.map((line) => {
      const [_, title, bid, , date, units, pricePerUnit] = line.split(",");
      return {
        title,
        bid,
        pricePerUnit,
        units,
        date,
      };
    });
  }

  return data;
}
