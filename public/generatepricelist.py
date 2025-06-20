import pandas as pd
import os
import json
from datetime import datetime, timedelta

# === CONFIG ===
BASE_DIR = os.getcwd()
GRADES_FOLDER = os.path.join(BASE_DIR, "Model_Lots_By_Grade")
OUTPUT_FILE = "price_list.json"
OUTPUT_PATH = os.path.join(BASE_DIR, OUTPUT_FILE)

# === TIME WINDOW: 8 months ago ===
cutoff_date = datetime.now() - timedelta(days=8 * 30)

# === INIT STRUCTURE ===
price_data = {}

# === GRADE FOLDERS LOOP ===
for grade_folder in os.listdir(GRADES_FOLDER):
    grade_path = os.path.join(GRADES_FOLDER, grade_folder)
    if not os.path.isdir(grade_path):
        continue

    for file in os.listdir(grade_path):
        if not file.endswith(".csv"):
            continue

        file_path = os.path.join(grade_path, file)
        try:
            df = pd.read_csv(file_path)

            if "date_closed" not in df.columns or "price_per_unit" not in df.columns:
                raise ValueError("Missing required 'date_closed' or 'price_per_unit' columns")

            # Clean date
            df["date_closed"] = df["date_closed"].astype(str).str.replace(r"\s+\w{2,4}$", "", regex=True)
            df["date_closed"] = pd.to_datetime(df["date_closed"], errors="coerce")
            df = df[df["date_closed"] >= cutoff_date]

            if df.empty:
                raise ValueError("No recent data within 8 months")

            # Parse model and capacity
            if "model" not in df.columns or "capacity" not in df.columns:
                raise ValueError("Missing 'model' or 'capacity' column")

            model = str(df["model"].iloc[0]).strip()
            raw_capacity = str(df["capacity"].iloc[0]).strip()

            if not model or not raw_capacity or model.lower() == "nan" or raw_capacity.lower() == "nan":
                raise ValueError("Invalid model or capacity value")

            # Handle multi-capacity
            is_multi = ',' in raw_capacity
            capacity = raw_capacity.split(',')[0].strip()

            # Calculate price
            avg_price = round(df["price_per_unit"].mean(), 2)
            if is_multi:
                avg_price += 15
                avg_price = round(avg_price, 2)

            # Save result
            price_data.setdefault(model, {})
            price_data[model].setdefault(capacity, {})
            price_data[model][capacity][grade_folder] = avg_price

        except Exception as e:
            print(f"❌ Error parsing {file}: {e}")

# === WRITE OUTPUT ===
with open(OUTPUT_PATH, "w") as f:
    json.dump(price_data, f, indent=2)

print(f"✅ Done. Saved price_list.json with {len(price_data)} models.")
