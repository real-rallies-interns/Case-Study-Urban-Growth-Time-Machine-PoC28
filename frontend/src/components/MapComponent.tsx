'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useMemo } from 'react';
import { DeckGL } from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    filter: string;
    mode: 'BEFORE' | 'AFTER';
    showHeatmap: boolean;
}

export default function MapComponent({ filter, mode, showHeatmap }: MapProps) {
  const position: [number, number] = [12.9716, 77.5946];
  
  // Growth Marker Data
  const markers = [
    { id: 1, pos: [77.5946, 12.9716], type: 'LIVE', name: 'URBAN_CORE', year: 2018, density: 8400, area: 20 },
    { id: 2, pos: [77.5946, 12.9716], type: 'LIVE', name: 'URBAN_CORE', year: 2023, density: 12400, area: 35 },
    { id: 3, pos: [77.6046, 12.9816], type: 'PILOT', name: 'GROWTH_SECTOR_A', year: 2018, density: 1200, area: 5 },
    { id: 4, pos: [77.6046, 12.9816], type: 'PILOT', name: 'GROWTH_SECTOR_A', year: 2023, density: 4200, area: 25 },
    { id: 5, pos: [77.5846, 12.9616], type: 'PLANNED', name: 'FUTURE_CORRIDOR_X', year: 2023, density: 800, area: 10 }
  ];

  const currentYear = mode === 'BEFORE' ? 2018 : 2023;

  const filteredMarkers = useMemo(() => markers.filter(m => {
    const isYearMatch = m.year === currentYear;
    const isFilterMatch = filter === 'ALL_RAILS' || m.type === filter;
    return isYearMatch && isFilterMatch;
  }), [filter, currentYear]);

  // Deck.gl Heatmap Layer Logic
  const layers = [
    showHeatmap && new HeatmapLayer({
      id: 'heatmap-layer',
      data: filteredMarkers,
      getPosition: (d: any) => d.pos,
      getWeight: (d: any) => d.density,
      radiusPixels: 60,
      intensity: 1,
      threshold: 0.03
    })
  ].filter(Boolean);

  return (
    <div className="w-full h-full relative">
      {/* Base Leaflet Map */}
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', background: '#030712' }}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Intelligence Nodes (Always Visible) */}
        {!showHeatmap && filteredMarkers.map(marker => (
            <CircleMarker 
                key={marker.id}
                center={[marker.pos[1], marker.pos[0]] as [number, number]} 
                pathOptions={{ 
                    color: marker.type === 'LIVE' ? '#10b981' : marker.type === 'PILOT' ? '#38bdf8' : '#f59e0b', 
                    fillColor: marker.type === 'LIVE' ? '#10b981' : marker.type === 'PILOT' ? '#38bdf8' : '#f59e0b', 
                    fillOpacity: 0.6,
                    weight: 2
                }} 
                radius={marker.area * 1.5}
            >
                <Popup>
                    <div className="text-xs font-mono bg-[#0B1117] text-white p-2 border border-[#1F2937]">
                        <p className="font-bold uppercase">{marker.name} // {marker.year}</p>
                        <p className="mt-1 text-[10px] text-slate-400 text-ellipsis overflow-hidden">DENSITY: {marker.density}/km²</p>
                    </div>
                </Popup>
            </CircleMarker>
        ))}
      </MapContainer>

      {/* Overlaying Deck.gl for Heatmap */}
      {showHeatmap && (
        <div className="absolute inset-0 z-[500] pointer-events-none">
          <DeckGL
            initialViewState={{
              longitude: position[1],
              latitude: position[0],
              zoom: 12
            }}
            controller={false}
            layers={layers}
          />
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-[1000] glass-panel px-3 py-1 text-[10px] font-mono text-accent-primary border-accent-primary/20">
         ENGINE_ACTIVE // MODE: {mode} // HEATMAP: {showHeatmap ? 'ON' : 'OFF'}
      </div>
    </div>
  );
}
