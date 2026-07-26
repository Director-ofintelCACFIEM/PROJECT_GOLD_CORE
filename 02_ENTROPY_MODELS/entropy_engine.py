"""
PROJECT GOLD: Entropy Mapping Engine with Branch-and-Merge Risk Metrics
Description: Evaluates structural/environmental degradation (AS 2870, AS 3798, POEO/EPBC)
combined with Git-style narrative threat tracking.
"""

import json
from pathlib import Path

class EntropyEngine:
    def __init__(self, registry_path: str = None):
        if registry_path is None:
            self.registry_path = Path(r"C:\Users\direc\OneDrive\Documents\PROJECT GOLD\PROJECT_GOLD_CORE\01_INTEL _GATHERING\target_registry.json")
        else:
            self.registry_path = Path(registry_path)

    def load_targets(self):
        if not self.registry_path.exists():
            raise FileNotFoundError(f"Target registry not found at {self.registry_path}")
        with open(self.registry_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def calculate_systemic_entropy(self, target_data: dict) -> dict:
        """
        Calculates localized entropy index and evaluates threat branch-and-merge status.
        """
        base_variance = target_data.get("risk_score", 1.0)
        thermal_coefficient = 1.15
        entropy_index = round(base_variance * thermal_coefficient, 4)
        
        # Determine merge status based on branch narrative
        merge_status = "STABLE" if "patch" in target_data.get("branch_name", "") else "DIVERGENT_RISK"
        
        return {
            "id": target_data.get("id"),
            "branch_name": target_data.get("branch_name"),
            "entropy_index": entropy_index,
            "merge_status": merge_status
        }

    def evaluate_regulatory_compliance(self, target_data: dict) -> dict:
        """
        Evaluates systemic entropy against Australian regulatory thresholds 
        (AS 2870, AS 3798, POEO Act 1997, EPBC Act 1999).
        """
        entropy_index = target_data.get("entropy_index", 0.0)
        
        # Define threshold limits based on structural/environmental frameworks
        as_2870_structural_limit = 2.0
        poeo_environmental_limit = 2.5
        
        compliance_status = "COMPLIANT"
        breach_detected = False
        
        if entropy_index > as_2870_structural_limit:
            breach_detected = True
            compliance_status = "NON_COMPLIANT: AS 2870 Structural Threshold Exceeded"
        elif entropy_index > poeo_environmental_limit:
            breach_detected = True
            compliance_status = "NON_COMPLIANT: POEO Act 1997 Environmental Limit Exceeded"
            
        return {
            "breach_detected": breach_detected,
            "compliance_status": compliance_status
        }

    def execute_mapping(self):
        targets = self.load_targets()
        results = []
        for target in targets:
            entropy_result = self.calculate_systemic_entropy(target)
            compliance_result = self.evaluate_regulatory_compliance(entropy_result)
            
            # Combine metrics into final assessment node
            combined_assessment = {**entropy_result, **compliance_result}
            results.append(combined_assessment)
            
        return results

if __name__ == "__main__":
    print("--- PROJECT GOLD: Entropy Mapping Execution Results ---")
    engine = EntropyEngine()
    assessment = engine.execute_mapping()
    print(json.dumps(assessment, indent=4))