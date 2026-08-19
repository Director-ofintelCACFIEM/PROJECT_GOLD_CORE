import json
from pathlib import Path
from datetime import datetime, timezone

def filter_and_log_targets(threshold=2.0):
    base_dir = Path(__file__).parent
    target_path = base_dir / "target_registry.json"
    registry_path = base_dir / "registry.json"
    
    print(f"=== CACFIEM // TARGET RISK FILTER & LOG (Threshold > {threshold}) ===")
    
    if not target_path.exists() or not registry_path.exists():
        print("[-] Required registry files missing.")
        return

    with open(target_path, "r", encoding="utf-8") as f:
        targets = json.load(f)
        
    flagged_entries = []
    for target in targets:
        risk = target.get("risk_score", 0.0)
        if risk >= threshold:
            flagged_entries.append({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "id": target.get("id"),
                "branch_name": target.get("branch_name"),
                "risk_score": risk,
                "status": "FLAGGED_HIGH_RISK"
            })
            print(f"\n[!] LOGGING HIGH RISK TARGET: {target.get('id')} ({risk})")

    # Update registry.json with entropy logs
    with open(registry_path, "r", encoding="utf-8") as f:
        registry_data = json.load(f)
        
    registry_data["project_gold_registry"]["entropy_logs"] = flagged_entries
    registry_data["project_gold_registry"]["last_updated"] = datetime.now(timezone.utc).isoformat()

    with open(registry_path, "w", encoding="utf-8") as f:
        json.dump(registry_data, f, indent=2)
        
    print(f"\n[+] Audit logged successfully. {len(flagged_entries)} targets recorded to registry.json.")

if __name__ == "__main__":
    filter_and_log_targets(threshold=2.0)