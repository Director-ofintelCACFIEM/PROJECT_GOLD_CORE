'use client';

import React, { useEffect, useState } from 'react';

interface TelemetryData {
  sensor_id: string;
  lat: number;
  lon: number;
  alt: number;
  velocity: number;
  gsd: string;
  compliance_triggers: {
    as_2870_footing_delta_mm: number;
    as_2870_status: string;
    poeo_runoff_flux_kg_hr: number;
    poeo_runoff_status: string;
    epbc_buffer_distance_m: number;
    epbc_status: string;
    as_3798_compaction_pct: number;
    as_3798_status: string;
    poeo_acoustic_db: number;
    poeo_acoustic_status: string;
  };
}

interface SocketMessage {
  payload: TelemetryData;
  iso27037_hash: string;
}

export default function CACFIEMDashboard() {
  const [data, setData] = useState<SocketMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('DISCONNECTED');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => setConnectionStatus('SECURE_CONNECTED');
    ws.onclose = () => setConnectionStatus('DISCONNECTED');
    ws.onmessage = (event) => {
      const parsed: SocketMessage = JSON.parse(event.data);
      setData(parsed);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <main style={{ padding: '2rem', background: '#0b0f19', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #374151', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#60a5fa' }}>CACFIEM FORENSIC INTELLIGENCE DASHBOARD</h1>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Status: <span style={{ color: connectionStatus === 'SECURE_CONNECTED' ? '#34d399' : '#f87171' }}>{connectionStatus}</span></p>
      </header>

      {data ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {/* Telemetry Panel */}
          <div style={{ background: '#111827', padding: '1.5rem', border: '1px solid #374151', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', color: '#93c5fd', marginBottom: '1rem' }}>UAS Telemetry Stream</h2>
            <p><strong>Sensor ID:</strong> {data.payload.sensor_id}</p>
            <p><strong>Latitude:</strong> {data.payload.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {data.payload.lon.toFixed(6)}</p>
            <p><strong>Altitude:</strong> {data.payload.alt} m</p>
            <p><strong>Ground Speed:</strong> {data.payload.velocity} m/s</p>
            <p><strong>GSD:</strong> {data.payload.gsd}</p>
          </div>

          {/* Compliance Panel */}
          <div style={{ background: '#111827', padding: '1.5rem', border: '1px solid #374151', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', color: '#93c5fd', marginBottom: '1rem' }}>Statutory Compliance Triggers</h2>
            <p><strong>AS 2870 Footing Delta:</strong> {data.payload.compliance_triggers.as_2870_footing_delta_mm} mm ({data.payload.compliance_triggers.as_2870_status})</p>
            <p><strong>POEO Runoff Flux:</strong> {data.payload.compliance_triggers.poeo_runoff_flux_kg_hr} kg/hr ({data.payload.compliance_triggers.poeo_runoff_status})</p>
            <p><strong>EPBC Buffer Distance:</strong> {data.payload.compliance_triggers.epbc_buffer_distance_m} m ({data.payload.compliance_triggers.epbc_status})</p>
            <p><strong>AS 3798 Compaction:</strong> {data.payload.compliance_triggers.as_3798_compaction_pct}% ({data.payload.compliance_triggers.as_3798_status})</p>
            <p><strong>POEO Acoustic Level:</strong> {data.payload.compliance_triggers.poeo_acoustic_db} dB ({data.payload.compliance_triggers.poeo_acoustic_status})</p>
          </div>

          {/* Cryptographic Hash Verification */}
          <div style={{ gridColumn: 'span 2', background: '#111827', padding: '1.5rem', border: '1px solid #374151', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', color: '#34d399', marginBottom: '0.5rem' }}>ISO 27037 Chain of Custody Hash</h2>
            <p style={{ wordBreak: 'break-all', fontSize: '0.875rem', color: '#9ca3af' }}>{data.iso27037_hash}</p>
          </div>
        </div>
      ) : (
        <p style={{ color: '#9ca3af' }}>Awaiting secure WebSocket stream from telemetry engine...</p>
      )}
    </main>
  );
}