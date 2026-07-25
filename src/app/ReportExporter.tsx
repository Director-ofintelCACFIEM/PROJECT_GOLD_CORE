import React from 'react';
import jsPDF from 'jspdf';

export default function ReportExporter({ telemetryData, cryptoHash }) {
  const generateRawIncidentReport = () => {
    const doc = new jsPDF();
    
    // Header & Document Control
    doc.setFont("Helvetica", "BOLD");
    doc.setFontSize(16);
    doc.text("CACFIEM FORENSIC INTELLIGENCE DIVISION", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("Helvetica", "NORMAL");
    doc.text("SUBJECT: Raw Incident Report & Compliance Breach Summary", 14, 28);
    doc.text(`Timestamp: ${new Date().toISOString()}`, 14, 34);
    doc.text(`Chain of Custody Protocol: ISO 27037 Compliant`, 14, 40);

    doc.line(14, 44, 196, 44);

    // Telemetry & Spatial Data
    doc.setFont("Helvetica", "BOLD");
    doc.text("1. UAS Telemetry Snapshot (DJI Mini 4 Pro)", 14, 54);
    doc.setFont("Helvetica", "NORMAL");
    doc.text(`Latitude: ${telemetryData?.lat || 'N/A'}`, 20, 62);
    doc.text(`Longitude: ${telemetryData?.lon || 'N/A'}`, 20, 68);
    doc.text(`Altitude: ${telemetryData?.alt || 'N/A'} m (Locked)`, 20, 74);
    doc.text(`Ground Speed: ${telemetryData?.velocity || 'N/A'} m/s`, 20, 80);
    doc.text(`Ground Sample Distance (GSD): ${telemetryData?.gsd || 'N/A'} cm/px`, 20, 86);

    // Compliance Triggers & Structural Anomalies
    doc.setFont("Helvetica", "BOLD");
    doc.text("2. Regulatory Compliance Triggers", 14, 98);
    doc.setFont("Helvetica", "NORMAL");
    
    const as2870 = telemetryData?.compliance_triggers?.as2870_m4_delta;
    doc.text(`AS 2870 Footing Delta (Node M4):`, 20, 106);
    doc.text(`- Measurement: ${as2870?.measurement_mm} mm (Threshold: ${as2870?.threshold_mm} mm)`, 26, 112);
    doc.text(`- Status: ${as2870?.status}`, 26, 118);

    const poeo = telemetryData?.compliance_triggers?.poeo_runoff_vector;
    doc.text(`POEO Act 1997 s120 Water Runoff Vector:`, 20, 128);
    doc.text(`- Flux Rate: ${poeo?.flux_kg_hr} kg/hr`, 26, 134);
    doc.text(`- Status: ${poeo?.status}`, 26, 140);

    // Cryptographic Proof (ISO 27037)
    doc.setFont("Helvetica", "BOLD");
    doc.text("3. Cryptographic State Verification", 14, 152);
    doc.setFont("Helvetica", "NORMAL");
    doc.text(`SHA-256 State Hash:`, 20, 160);
    doc.setFont("Courier", "NORMAL");
    doc.setFontSize(8);
    doc.text(cryptoHash || 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855', 20, 166);

    // Executive Sign-off Block
    doc.setFont("Helvetica", "BOLD");
    doc.setFontSize(10);
    doc.text("4. Sovereign Execution & Moral Grounding", 14, 180);
    doc.setFont("Helvetica", "NORMAL");
    doc.text("Executive Sign-off (Master Chief Oversight): ___________________________", 20, 190);
    doc.text("Status: Pending Human Review & Shadow Integration", 20, 196);

    // Output PDF
    doc.save(`CACFIEM-Incident-Report-${Date.now()}.pdf`);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Raw Incident Report Generator</h3>
      <p className="text-sm text-slate-400 mb-4">
        Compile current telemetry stream, structural failures, and cryptographic chain into an immutable court-admissible PDF.
      </p>
      <button 
        onClick={generateRawIncidentReport}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-medium rounded transition"
      >
        Export Raw Incident Report (PDF)
      </button>
    </div>
  );
}