'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface ComplianceTriggers {
  as_2870_status?: string;
  poeo_runoff_status?: string;
  epbc_status?: string;
}

interface LiveMapProps {
  lat: number;
  lon: number;
  sensorId: string;
  compliance?: ComplianceTriggers;
}

export default function LiveMap({ lat, lon, sensorId, compliance }: LiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([lat, lon], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
      
      // Initial mock compliance perimeter (Sector 5 boundary zone)
      const perimeterCoords: [number, number][] = [
        [lat + 0.002, lon - 0.002],
        [lat + 0.002, lon + 0.002],
        [lat - 0.002, lon + 0.002],
        [lat - 0.002, lon - 0.002],
      ];

      const polygon = L.polygon(perimeterCoords, {
        color: '#34d399',
        fillColor: '#34d399',
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;
      polygonRef.current = polygon;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map telemetry position and dynamically color-code compliance perimeter
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && polygonRef.current) {
      mapInstanceRef.current.setView([lat, lon], mapInstanceRef.current.getZoom());
      markerRef.current.setLatLng([lat, lon]);
      markerRef.current.setPopupContent(`<strong>Sensor ID:</strong> ${sensorId} <br />Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`);

      // Dynamic color shift based on active statutory triggers
      const hasCriticalBreach = 
        compliance?.as_2870_status?.includes('CRITICAL') || 
        compliance?.poeo_runoff_status?.includes('BREACH');

      const breachColor = hasCriticalBreach ? '#f87171' : '#34d399';
      
      polygonRef.current.setStyle({
        color: breachColor,
        fillColor: breachColor,
      });

      // Update bounding polygon center relative to drone position
      const updatedPerimeter: [number, number][] = [
        [lat + 0.002, lon - 0.002],
        [lat + 0.002, lon + 0.002],
        [lat - 0.002, lon + 0.002],
        [lat - 0.002, lon - 0.002],
      ];
      polygonRef.current.setLatLngs(updatedPerimeter);
    }
  }, [lat, lon, sensorId, compliance]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }} />;
}