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
    metrics: any[];
    year: number;
    filter: string;
    showHeatmap: boolean;
    onMarkerClick: (marker: any) => void;
    selectedMarkerId?: string | null;
}

export default function MapComponent({ metrics, year, filter, showHeatmap, onMarkerClick, selectedMarkerId }: MapProps) {
  const position: [number, number] = [12.9716, 77.5946];
  
  const filteredMarkers = useMemo(() => {
    if (!metrics) return [];
    return metrics.filter(m => {
        const isYearMatch = m.year === year;
        const isFilterMatch = filter === 'ALL_RAILS' || m.land_use_type === filter;
        return isYearMatch && isFilterMatch;
    });
  }, [metrics, year, filter]);

  // Deck.gl Heatmap Layer Logic
  const layers = [
    showHeatmap && new HeatmapLayer({
      id: 'heatmap-layer',
      data: filteredMarkers,
      getPosition: (d: any) => [d.longitude, d.latitude],
      getWeight: (d: any) => d.population_density,
      radiusPixels: 60,
      intensity: 1,
      threshold: 0.03
    })
  ].filter(Boolean);

    const getMarkerColor = (type: string) => {
        const colors: any = {
            'URBAN': '#38BDF8',      // Electric Cyan
            'INDUSTRIAL': '#818CF8', // Indigo
            'SUBURBAN': '#0ea5e9',   // Light Blue
            'RESIDENTIAL': '#6366f1', // Indigo Light
            'COMMERCIAL': '#22d3ee',  // Cyan 400
            'RURAL': '#475569'       // Slate 600
        };
        return colors[type] || '#ffffff'; // Fallback to White for visibility
    };

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
        {!showHeatmap && filteredMarkers.map((marker, idx) => (
            <CircleMarker 
                key={`${marker.aoi_id}-${idx}`}
                center={[marker.latitude, marker.longitude] as [number, number]} 
                pathOptions={{ 
                    color: getMarkerColor(marker.land_use_type), 
                    fillColor: getMarkerColor(marker.land_use_type), 
                    fillOpacity: 0.8,
                    weight: 2
                }} 
                radius={Math.max(5, Math.sqrt(marker.built_up_area_sqkm) * 2)}
                eventHandlers={{
                    click: () => onMarkerClick(marker)
                }}
            >
                <Popup>
                    <div className="text-xs font-mono bg-[#0B1117] text-white p-2 border border-[#1F2937]">
                        <p className="font-bold uppercase text-accent-primary">{marker.aoi_id} // {marker.year}</p>
                        <p className="mt-1 text-[10px] text-slate-400">TYPE: {marker.land_use_type}</p>
                        <p className="text-[10px] text-slate-400">DENSITY: {marker.population_density.toFixed(0)}/km²</p>
                    </div>
                </Popup>
            </CircleMarker>
        ))}

        {/* Selected Node Analysis Layer */}
        {selectedMarkerId && metrics?.find(m => m.aoi_id === selectedMarkerId && m.year === year) && (
            (() => {
                const marker = metrics.find(m => m.aoi_id === selectedMarkerId && m.year === year);
                return (
                    <>
                        <CircleMarker
                            center={[marker.latitude, marker.longitude] as [number, number]}
                            pathOptions={{ 
                                color: '#38BDF8', 
                                fillColor: '#38BDF8', 
                                fillOpacity: 0.2,
                                weight: 2,
                                dashArray: '5, 10'
                            }}
                            radius={40}
                            className="animate-pulse"
                        />
                        <CircleMarker
                            center={[marker.latitude, marker.longitude] as [number, number]}
                            pathOptions={{ 
                                color: '#38BDF8', 
                                fillColor: '#38BDF8', 
                                fillOpacity: 0.1,
                                weight: 1
                            }}
                            radius={80}
                        />
                    </>
                );
            })()
        )}
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
    </div>
  );
}
