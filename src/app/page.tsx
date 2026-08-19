'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('../components/LiveMap'), { 
  ssr: false,
  loading: () => <div style={{ color: '#9ca3af', padding: '1rem' }}>Initializing Geospatial Grid...</div>
});

interface ComplianceTriggers {
  as_2870_footing_delta_mm?: number;
  as_2870_status?: string;
  poeo_runoff_flux_kg_hr?: number;
  poeo_runoff_status?: string;
  epbc_buffer_distance_m?: number;
  epbc_status?: string;
  as_3798_compaction_pct?: number;
  as_3798_status?: string;
  poeo_acoustic_db?: number;
  poeo_acoustic_status?: string;
}

interface TelemetryPayload {
  sensor_id?: string;
  lat?: number;
  lon?: number;
  alt?: number;
  velocity?: number;
  gsd?: string;
  compliance_triggers?: ComplianceTriggers;
}

interface TelemetryData {
  connectionStatus: string;
  payload?: TelemetryPayload;
  iso27037_hash?: string;
}

export default function CACFIEMDashboard() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({ connectionStatus: 'DISCONNECTED' });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      setTelemetry((prev) => ({ ...prev, connectionStatus: 'SECURE_CONNECTED' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTelemetry((prev) => ({ 
          ...prev, 
          payload: data.payload ?? data,
          iso27037_hash: data.iso27037_hash 
        }));
      } catch (err) {
        console.error('Failed to parse incoming telemetry packet:', err);
      }
    };

    ws.onclose = () => {
      setTelemetry((prev) => ({ ...prev, connectionStatus: 'DISCONNECTED' }));
    };

    return () => {
      ws.close();
    };
  }, []);

  const { connectionStatus, payload } = telemetry;
  const compliance = payload?.compliance_triggers;
  
  const currentLat = payload?.lat ?? -33.868470;
  const currentLon = payload?.lon ?? 151.209410;

  return (
    <main style={{ padding: '2rem', background: '#0b0f19', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #374151', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#60a5fa' }}>CACFIEM FORENSIC INTELLIGENCE DASHBOARD</h1>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Status: <span style={{ color: connectionStatus === 'SECURE_CONNECTED' ? '#34d399' : '#f87171' }}>{connectionStatus}</span>
          {telemetry.iso27037_hash && (
            <span style={{ marginLeft: '2rem', fontSize: '0.75rem', color: '#6b7280' }}>
              ISO 27037 Hash: {telemetry.iso27037_hash.substring(0, 16)}...
            </span>
          )}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#111827', padding: '1.5rem', border: '1px solid #374151', borderRadius: '0.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', color: '#93c5fd', marginBottom: '1rem' }}>UAS Telemetry Stream</h2>
          <p><strong>Sensor ID:</strong> {payload?.sensor_id ?? 'Awaiting telemetry...'}</p>
          <p><strong>Latitude:</strong> {payload?.lat !== undefined ? payload.lat.toFixed(6) : 'N/A'}</p>
          <p><strong>Longitude:</strong> {payload?.lon !== undefined ? payload.lon.toFixed(6) : 'N/A'}</p>
          <p><strong>Altitude:</strong> {payload?.alt ?? 'N/A'} m</p>
          <p><strong>Ground Speed:</strong> {payload?.velocity ?? 'N/A'} m/s</p>
          <p><strong>GSD:</strong> {payload?.gsd ?? 'N/A'}</p>
        </div>

        <div style={{ background: '#111827', padding: '1.5rem', border: '1px solid #374151', borderRadius: '0.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', color: '#93c5fd', marginBottom: '1rem' }}>Statutory Compliance Triggers</h2>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>AS 2870 Footing Delta:</strong> {compliance?.as_2870_footing_delta_mm ?? 'N/A'} mm &nbsp; 
            <span style={{ color: compliance?.as_2870_status?.includes('CRITICAL') ? '#f87171' : '#34d399' }}>
              ({compliance?.as_2870_status ?? 'PENDING AUDIT'})
            </span>
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>POEO Runoff Flux:</strong> {compliance?.poeo_runoff_flux_kg_hr ?? 'N/A'} kg/hr &nbsp; 
            <span style={{ color: '#f87171' }}>({compliance?.poeo_runoff_status ?? 'N/A'})</span>
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>EPBC Buffer Distance:</strong> {compliance?.epbc_buffer_distance_m ?? 'N/A'} m &nbsp; 
            <span style={{ color: '#34d399' }}>({compliance?.epbc_status ?? 'N/A'})</span>
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>AS 3798 Compaction:</strong> {compliance?.as_3798_compaction_pct ?? 'N/A'}% &nbsp; 
            <span style={{ color: '#fbbf24' }}>({compliance?.as_3798_status ?? 'N/A'})</span>
          </p>
          <p>
            <strong>POEO Acoustic Entropy:</strong> {compliance?.poeo_acoustic_db ?? 'N/A'} dB &nbsp; 
            <span style={{ color: '#fbbf24' }}>({compliance?.poeo_acoustic_status ?? 'N/A'})</span>
          </p>
        </div>
      </div>

      <div style={{ background: '#111827', padding: '1.5rem', border: '1px solid #374151', borderRadius: '0.5rem', height: '400px' }}>
        <h2 style={{ fontSize: '1.125rem', color: '#93c5fd', marginBottom: '1rem' }}>Geospatial Telemetry Overlay (Sector 5)</h2>
        <div style={{ height: '320px', width: '100%' }}>
          <LiveMap lat={currentLat} lon={currentLon} sensorId={payload?.sensor_id ?? 'DJI-MINI4P-UAS-01'} />
        </div>
      </div>
    </main>
  );
}