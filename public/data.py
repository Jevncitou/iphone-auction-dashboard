import os
import pandas as pd
from pathlib import Path
import re

# === CONFIG ===
INPUT_FOLDER = "Model_Lots"
OUTPUT_FOLDER = "Model_Lots_By_Grade"
VALID_GRADES = ["AA", "A", "B", "C"]

def extract_clean_grade(raw):
    """
    Extract the core grade from entries like 'Grade A+(T)', 'Grade B-', 'Grade AA', etc.
    Returns 'AA', 'A', 'B', or 'C' only if matched.
    """
    raw = str(raw).upper()
    match = re.search(r"GRADE\s+([A-Z]{1,2})", raw)
    if match:
        return match.group(1)
    return None

# === Ensure output folder exists ===
Path(OUTPUT_FOLDER).mkdir(parents=True, exist_ok=True)

# === Iterate over CSVs ===
for file in os.listdir(INPUT_FOLDER):
    if not file.endswith(".csv"):
        continue

    input_path = os.path.join(INPUT_FOLDER, file)
    try:
        df = pd.read_csv(input_path)
    except Exception as e:
        print(f"❌ Failed to read {file}: {e}")
        continue

    if "grade" not in df.columns:
        print(f"❌ Skipping {file}: 'grade' column not found")
        continue

    df["clean_grade"] = df["grade"].apply(extract_clean_grade)
    headers = df.columns.drop("clean_grade")

    for grade in VALID_GRADES:
        filtered = df[df["clean_grade"] == grade]
        grade_dir = Path(OUTPUT_FOLDER) / f"Grade_{grade}"
        grade_dir.mkdir(parents=True, exist_ok=True)
        output_path = grade_dir / file

        if not filtered.empty:
            filtered.drop(columns=["clean_grade"]).to_csv(output_path, index=False)
            print(f"✅ {file} → Grade_{grade} ({len(filtered)} rows)")
        else:
            pd.DataFrame(columns=headers).to_csv(output_path, index=False)
            print(f"⚠️ EMPTY: {file} → Grade_{grade}")

print("✅ All models processed.")
