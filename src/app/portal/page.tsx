'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  FileText, 
  Download, 
  ArrowLeft,
  Layers
} from 'lucide-react';

// Explicitly resolve the default export to prevent Next.js dynamic render errors
const MapComponent = dynamic(
  () => import('./MapComponent').then((mod) => mod.MapComponent),
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-lg border border-slate-800 bg-slate-900/50 flex items-center justify-center font-mono text-xs text-emerald-500 animate-pulse">
        [INITIALIZING GIS SPATIAL CANVAS...]
      </div>
    )
  }
);

// Mock telemetry data per sector
const siteData: Record<string, {
  name: string;
  gsd: string;
  poeoStatus: 'PASSED' | 'ACTION REQ';
  poeoDetails: string;
  structuralStatus: 'PASSED' | 'MONITORING';
  structuralDetails: string;
  center: [number, number];
  polygon: [number, number][];
  displacementData: number[];
  logs: string[];
}> = {
  'central-coast-4': {
    name: 'CENTRAL COAST SECTOR 4',
    gsd: '0.82 cm/px',
    poeoStatus: 'PASSED',
    poeoDetails: '0 Active Environmental Breaches',
    structuralStatus: 'MONITORING',
    structuralDetails: '1 Soil Movement Anomaly Flagged',
    center: [-33.4267, 151.3417],
    polygon: [
      [-33.425, 151.340],
      [-33.425, 151.343],
      [-33.428, 151.343],
      [-33.428, 151.340]
    ],
    displacementData: [1.2, 1.4, 1.8, 2.1, 2.0, 2.1],
    logs: [
      '[2026-07-23 15:00:01 AEST] Ingress Hash Verified: 0x8f2a...c4e9',
      '[2026-07-23 15:02:14 AEST] Telemetry stream locked: Ground elevation baseline recorded.',
      '[2026-07-23 15:05:30 AEST] Section 120 POEO Act compliance check executed: PASS.',
      '[2026-07-23 15:08:12 AEST] AS 2870 Foundation displacement delta: +2.1mm (Within tolerance threshold).'
    ]
  },
  'hunter-1': {
    name: 'HUNTER REGION SECTOR 1',
    gsd: '0.45 cm/px',
    poeoStatus: 'ACTION REQ',
    poeoDetails: '1 Potential Sediment Ingress Alert',
    structuralStatus: 'PASSED',
    structuralDetails: '0 Structural Anomalies Detected',
    center: [-32.9283, 151.7817],
    polygon: [
      [-32.926, 151.780],
      [-32.926, 151.784],
      [-32.930, 151.784],
      [-32.930, 151.780]
    ],
    displacementData: [0.2, 0.3, 0.2, 0.4, 0.3, 0.2],
    logs: [
      '[2026-07-23 14:10:00 AEST] Ingress Hash Verified: 0x3d11...91b0',
      '[2026-07-23 14:15:22 AEST] Thermal layer anomaly flagged near runoff point B.',
      '[2026-07-23 14:18:05 AEST] POEO Act Audit: Runoff risk identified. Mitigation advisory issued.',
      '[2026-07-23 14:20:00 AEST] AS 2870 Foundation metrics normal (0.4mm max).'
    ]
  },
  'sydney-west-2': {
    name: 'SYDNEY WEST SECTOR 2',
    gsd: '0.95 cm/px',
    poeoStatus: 'PASSED',
    poeoDetails: '0 Environmental Breaches',
    structuralStatus: 'PASSED',
    structuralDetails: '0 Foundation Displacement Alerts',
    center: [-33.7500, 150.6800],
    polygon: [
      [-33.748, 150.678],
      [-33.748, 150.682],
      [-33.752, 150.682],
      [-33.752, 150.678]
    ],
    displacementData: [0.1, 0.1, 0.2, 0.1, 0.2, 0.1],
    logs: [
      '[2026-07-23 13:00:00 AEST] Ingress Hash Verified: 0x7e4f...11a2',
      '[2026-07-23 13:05:00 AEST] Civil works baseline telemetry stable.',
      '[2026-07-23 13:10:00 AEST] POEO Act Check: CLEAR.',
      '[2026-07-23 13:15:00 AEST] AS 2870 Check: CLEAR.'
    ]
  }
};

export default function PortalPage() {
  const [selectedSiteKey, setSelectedSiteKey] = useState<string>('central-coast-4');
  const currentSite = siteData[selectedSiteKey];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 space-y-6">
      
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            C
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-slate-100 font-mono">CACFIEM</h1>
            <p className="text-[10px] text-slate-400 font-mono">SECURE CLIENT PORTAL v1.0</p>
          </div>
        </div>

        <Link 
          href="/" 
          className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-emerald-400 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>RETURN TO MAIN</span>
        </Link>
      </header>

      {/* Control Strip & Dynamic Site Selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <select 
            value={selectedSiteKey}
            onChange={(e) => setSelectedSiteKey(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold text-sm rounded px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="central-coast-4">CENTRAL COAST SECTOR 4</option>
            <option value="hunter-1">HUNTER REGION SECTOR 1</option>
            <option value="sydney-west-2">SYDNEY WEST SECTOR 2</option>
          </select>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Clean Room Data Ingress | Statutory Compliance Verification (POEO / AS 2870)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            PIPELINE LIVE
          </span>
        </div>
      </div>

      {/* Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Spatial Accuracy */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">SPATIAL ACCURACY (GSD)</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold font-mono text-slate-100">{currentSite.gsd}</span>
            <p className="text-xs text-slate-400 mt-1">Sub-centimeter photogrammetry verified</p>
          </div>
        </div>

        {/* POEO Act Compliance */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">POEO ACT COMPLIANCE</span>
            <ShieldCheck className={`h-4 w-4 ${currentSite.poeoStatus === 'PASSED' ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className="my-3">
            <span className={`text-2xl font-bold font-mono ${currentSite.poeoStatus === 'PASSED' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentSite.poeoStatus}
            </span>
            <p className="text-xs text-slate-400 mt-1">{currentSite.poeoDetails}</p>
          </div>
        </div>

        {/* Structural Risk AS 2870 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">STRUCTURAL RISK (AS 2870)</span>
            <AlertTriangle className={`h-4 w-4 ${currentSite.structuralStatus === 'PASSED' ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className="my-3">
            <span className={`text-2xl font-bold font-mono ${currentSite.structuralStatus === 'PASSED' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentSite.structuralStatus}
            </span>
            <p className="text-xs text-slate-400 mt-1">{currentSite.structuralDetails}</p>
          </div>
        </div>

      </div>

      {/* GIS Map & Telemetry Charts Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            <h2 className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
              GIS SPATIAL INTELLIGENCE & BOUNDARY POLYGON
            </h2>
          </div>
        </div>

        {/* Interactive GIS Leaflet Canvas */}
        <MapComponent 
          center={currentSite.center} 
          polygon={currentSite.polygon} 
          siteName={currentSite.name} 
        />

        {/* Foundation Displacement Metric Visualization */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-300">FOUNDATION DISPLACEMENT DELTA METRICS (mm) — 6-MONTH INTERVAL</span>
            <span className="text-[10px] font-mono text-slate-500">TOLERANCE LIMIT: ±5.0mm</span>
          </div>

          <div className="h-32 flex items-end justify-between gap-2 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
            {currentSite.displacementData.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full rounded-t transition-all ${val > 1.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ height: `${(val / 3) * 100}%` }}
                />
                <span className="text-[9px] font-mono text-slate-400">M{idx + 1}: {val}mm</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Room Audit Trail & Evidence Package Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Terminal Ingress Trail */}
        <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 font-bold">CLEAN ROOM AUDIT TRAIL — {currentSite.name}</span>
            <span className="text-[10px] font-mono text-slate-500">ISO/IEC 27037 STANDARD</span>
          </div>
          <div className="bg-slate-950 rounded p-3 font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
            {currentSite.logs.map((log, idx) => (
              <p key={idx} className={idx === currentSite.logs.length - 1 ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                {log}
              </p>
            ))}
            <p className="text-slate-600 italic">// End of active evidence buffer block</p>
          </div>
        </div>

        {/* Evidence Export Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-mono font-bold text-slate-200">Forensic Artifacts</span>
            </div>
            <p className="text-xs text-slate-400">
              Download fully structured forensic documentation, statutory breach analyses, and spatial maps formatted for court submission.
            </p>
          </div>

          <button 
            type="button"
            onClick={() => window.print()}
            className="mt-4 w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs py-2.5 px-4 rounded transition"
          >
            <Download className="h-4 w-4" />
            <span>Export Evidence Package</span>
          </button>
        </div>

      </div>

    </div>
  );
}