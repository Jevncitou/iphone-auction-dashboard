import pandas as pd
import json

# === CONFIG ===
CSV_PATH = "upcoming_auctions.csv"
OUTPUT_JSON = "upcoming_auctions.json"

# === LOAD CSV AND FORMAT ===
df = pd.read_csv(CSV_PATH)
df['end_time'] = pd.to_datetime(df['end_time'])  # ensure datetime format

# === VALIDATE 'model' COLUMN EXISTS ===
if 'model' not in df.columns:
    raise ValueError("❌ 'model' column is missing in the CSV.")

# === GROUP BY CLEAN MODEL NAMES ===
structured_data = {}

for model_name, group in df.groupby('model'):
    structured_data[model_name] = []
    for _, row in group.iterrows():
        structured_data[model_name].append({
            "listing_id": int(row['listing_id']),
            "sku": row['sku'],
            "grade": row['grade'],
            "units": int(row['units']),
            "end_time": row['end_time'].isoformat(),
            "image_url": row.get('image_url', ""),  # ✅ Include image
            "manifest_models": row.get('manifest_models', ""),
            "manifest_capacities": row.get('manifest_capacities', ""),
            "manifest_colors": row.get('manifest_colors', ""),
            "manifest_part_numbers": row.get('manifest_part_numbers', "")
        })

# === SAVE OUTPUT ===
with open(OUTPUT_JSON, 'w') as f:
    json.dump(structured_data, f, indent=2)

print(f"✅ Saved structured JSON to {OUTPUT_JSON}")
