import os
import shutil

def lowercase_html_csv_recursive(input_root, output_root):
    total_files = 0
    html_count = 0
    csv_count = 0
    renamed_files = []

    for root, _, files in os.walk(input_root):
        for file in files:
            if file.endswith((".html", ".csv")):
                total_files += 1

                src_file = os.path.join(root, file)
                rel_dir = os.path.relpath(root, input_root)
                dst_dir = os.path.join(output_root, rel_dir)
                os.makedirs(dst_dir, exist_ok=True)

                dst_file = os.path.join(dst_dir, file.lower())

                shutil.copy2(src_file, dst_file)
                renamed_files.append((src_file, dst_file))

                if file.endswith(".html"):
                    html_count += 1
                elif file.endswith(".csv"):
                    csv_count += 1

                print(f"✅ Copied: {src_file} → {dst_file}")

    print(f"\n📊 Scanned: {input_root}")
    print(f"  Total files: {total_files}")
    print(f"  HTML files: {html_count}")
    print(f"  CSV files: {csv_count}")
    print(f"  Renamed files: {len(renamed_files)}")


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))  # src/
    base_input = os.path.normpath(os.path.join(script_dir, "..", "public", "data"))
    base_output = os.path.normpath(os.path.join(script_dir, "..", "public", "data_lowercase"))

    grade_dirs = [
        os.path.join(base_input, "Charts_By_Grade", "Grade_A"),
        os.path.join(base_input, "Charts_By_Grade", "Grade_AA"),
        os.path.join(base_input, "Charts_By_Grade", "Grade_B"),
        os.path.join(base_input, "Charts_By_Grade", "Grade_C"),
        os.path.join(base_input, "Model_Lots")
    ]

    for input_path in grade_dirs:
        rel_path = os.path.relpath(input_path, base_input)
        output_path = os.path.join(base_output, rel_path)
        print(f"\n🔍 Processing: {input_path}")
        lowercase_html_csv_recursive(input_path, output_path)

    print("\n✅ Done. All lowercase .html and .csv copies are under /public/data_lowercase/\n")


if __name__ == "__main__":
    main()
