import json
from pathlib import Path

def audit_local_data():
    base_dir = Path(__file__).parent
    files = ["registry.json", "target_registry.json"]
    
    print("=== CACFIEM // LOCAL DATA AUDIT ===")
    for filename in files:
        path = base_dir / filename
        if path.exists():
            print(f"\n[+] Reading: {filename}")
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    print(json.dumps(data, indent=2))
            except json.JSONDecodeError as e:
                print(f"    [!] JSON Syntax Error in {filename} at line {e.lineno}, column {e.colno}: {e.msg}")
            except Exception as e:
                print(f"    [!] Error reading {filename}: {e}")
        else:
            print(f"\n[-] Not found: {filename}")

if __name__ == "__main__":
    audit_local_data()