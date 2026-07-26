"""
PROJECT GOLD: Automated Alert Dispatch & Notification Hook
Description: Monitors master compliance audit results and dispatches automated alerts 
when AS 2870 or EPBC Act 1999 thresholds are breached.
"""

import json
from pathlib import Path
from master_compliance_engine import MasterComplianceEngine

class AlertDispatcher:
    def __init__(self, engine: MasterComplianceEngine):
        self.engine = engine

    def check_and_dispatch(self):
        audit_results = self.engine.run_audit()
        alerts = []
        
        for node in audit_results:
            if "NON_COMPLIANT" in node["compliance_status"] or "CONDITIONAL" in node["compliance_status"]:
                alert = {
                    "id": node["id"],
                    "branch_name": node["branch_name"],
                    "severity": "CRITICAL_BREACH" if "NON_COMPLIANT" in node["compliance_status"] else "WARNING",
                    "status_message": node["compliance_status"],
                    "action": node["merge_status"]
                }
                alerts.append(alert)
                
        return alerts

if __name__ == "__main__":
    print("--- PROJECT GOLD: Alert Dispatch Hook Initialized ---")
    engine = MasterComplianceEngine()
    dispatcher = AlertDispatcher(engine)
    triggered_alerts = dispatcher.check_and_dispatch()
    print(json.dumps(triggered_alerts, indent=4))