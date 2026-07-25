'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface MapProps {
  center: [number, number];
  polygon: [number, number][];
  siteName: string;
}

export function MapComponent({ center, polygon, siteName }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);

  const [activeLayer, setActiveLayer] = useState<'sat' | 'thermal' | 'mesh'>('sat');

  const tileUrls = {
    sat: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    thermal: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    mesh: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  };

  // Initialize map instance
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 14,
      scrollWheelZoom: false,
    });

    const tileLayer = L.tileLayer(tileUrls[activeLayer], {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const poly = L.polygon(polygon, {
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.25,
    }).addTo(map);

    poly.bindPopup(`<span style="font-family: monospace; font-size: 11px;">${siteName} Boundary Polygon</span>`);

    mapRef.current = map;
    tileLayerRef.current = tileLayer;
    polygonRef.current = poly;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update center, polygon, and tiles when props or layer choices change
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setView(center, 14);

    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(tileUrls[activeLayer]);
    }

    if (polygonRef.current) {
      polygonRef.current.setLatLngs(polygon);
      polygonRef.current.setPopupContent(`<span style="font-family: monospace; font-size: 11px;">${siteName} Boundary Polygon</span>`);
    }
  }, [center, polygon, activeLayer, siteName]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-slate-400">GIS SPATIAL OVERLAY:</span>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveLayer('sat')}
            className={`px-2 py-1 rounded transition ${
              activeLayer === 'sat'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('thermal')}
            className={`px-2 py-1 rounded transition ${
              activeLayer === 'thermal'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Thermal
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('mesh')}
            className={`px-2 py-1 rounded transition ${
              activeLayer === 'mesh'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Mesh Vector
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-64 w-full rounded-lg overflow-hidden border border-slate-800 relative z-0"
      />
    </div>
  );
}

export default MapComponent;