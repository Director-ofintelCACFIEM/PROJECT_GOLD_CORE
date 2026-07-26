import json
from datetime import datetime

class ForensicTargetSchema:
    def __init__(self, target_id: str, coordinates: dict):
        self.target_id = target_id
        self.timestamp = datetime.utcnow().isoformat() + "Z"
        self.coordinates = coordinates
        self.compliance_flags = {
            "privacy_act_1988_cleared": True,
            "poeo_act_threshold_met": True,
            "epbc_act_assessed": True
        }
        self.osint_vectors = []

    def add_vector(self, source_type: str, raw_data_ref: str, verified: bool):
        vector = {
            "source_type": source_type,
            "raw_data_ref": raw_data_ref,
            "verified": verified,
            "ingestion_timestamp": datetime.utcnow().isoformat() + "Z"
        }
        self.osint_vectors.append(vector)

    def export_registry(self, file_path: str = "target_registry.json"):
        payload = {
            "target_id": self.target_id,
            "timestamp": self.timestamp,
            "coordinates": self.coordinates,
            "compliance_flags": self.compliance_flags,
            "osint_vectors": self.osint_vectors
        }
        with open(file_path, "w") as f:
            json.dump(payload, f, indent=4)
        return payload

if __name__ == "__main__":
    # Example execution instance for clean-room testing
    target = ForensicTargetSchema(
        target_id="GOLD-TARGET-001",
        coordinates={"lat": -33.8688, "lon": 151.2093}
    )
    target.add_vector("Public Registry Dork", "AS_2870_Compliance_Check", True)
    target.export_registry()