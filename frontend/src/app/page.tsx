'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchAllGrowthMetrics, saveAOI } from '@/lib/api';
import Header from '@/components/Header';
import InfoModal from '@/components/InfoModal';
import { X, ChevronRight, BarChart2, Globe, Bookmark, Zap, Activity, Download, Filter, Info as InfoIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#030712] animate-pulse flex items-center justify-center font-mono text-[10px] text-slate-700">INITIALIZING_SPATIAL_ENGINE...</div>
});

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL_RAILS');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  
  const [intelligence, setIntelligence] = useState<any>({
    whyItMatters: "Spatiotemporal shifts in Bengaluru's urban core indicate a transition toward high-density verticality and multi-modal transit nodes.",
    whoControls: "Managed by BBMP and BDA, with secondary oversight from K-RIDE for commuter rail integration.",
    stats: []
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const rawMetrics = await fetchAllGrowthMetrics();
      if (Array.isArray(rawMetrics) && rawMetrics.length > 0) {
        setData({ metrics: rawMetrics });
        
        // Initial Intelligence Stats
        setIntelligence((prev: any) => ({
            ...prev,
            stats: [
                { label: "Total Nodes", value: rawMetrics.length, unit: "POINTS" },
                { label: "Avg Density", value: "4.2k", unit: "P/KM2" },
                { label: "Growth Index", value: "0.95", unit: "VAL" }
            ]
        }));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
    
    // Update Intelligence based on selection
    const type = marker.land_use_type || 'URBAN';
    const isHighGrowth = marker.growth_velocity_pct > 15;
    
    setIntelligence({
        whyItMatters: `The ${type.toLowerCase()} development in ${marker.region_name} reflects a critical ${isHighGrowth ? 'acceleration' : 'stabilization'} phase in the city's spatiotemporal expansion.`,
        whoControls: `Primary development oversight in this node is held by the ${type === 'INDUSTRIAL' ? 'KIADB' : 'BDA'}, monitoring land-use compliance and infrastructure load.`,
        stats: [
            { label: "Area Growth", value: marker.built_up_area_sqkm, unit: "SQKM" },
            { label: "Density", value: marker.population_density.toFixed(0), unit: "P/KM2" },
            { label: "Velocity", value: marker.growth_velocity_pct.toFixed(1), unit: "%" }
        ]
    });
  };

  const handleDownload = () => {
    if (!data?.metrics) return;
    const blob = new Blob([JSON.stringify(data.metrics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `urban_growth_sample_${selectedYear}.json`;
    link.click();
  };

  return (
    <main className="dashboard-container font-sans overflow-hidden select-none">
      
      {/* HEADER & INFO MODAL */}
      <Header onInfoClick={() => setIsInfoOpen(true)} />
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* MAIN STAGE (70%) */}
      <section className="main-stage">
        <MapComponent 
          metrics={data?.metrics}
          year={selectedYear}
          filter={activeFilter} 
          showHeatmap={showHeatmap} 
          onMarkerClick={handleMarkerClick}
          selectedMarkerId={selectedMarker?.aoi_id}
        />
        
        {/* TICKER */}
        <div className="ticker-container">
          <div className="ticker-text">
            ENGINE_STATUS: NOMINAL // TIME_WINDOW: {selectedYear} // NODE_COUNT: {data?.metrics?.length || 0} // PROTOCOL: RR_MASTER_MANIFESTO // DATA_SOURCE: SYNTHETIC_SPATIOTEMPORAL_ENGINE // DEVELOPER: ANANTHU ANIL
          </div>
        </div>
      </section>

      {/* INTELLIGENCE SIDEBAR (30%) */}
      <aside className="sidebar flex flex-col p-8 pt-24 space-y-8">
        
        {/* SECTION A: Title & High-level Metric */}
        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.3em] mb-1">Intelligence Sidebar</h3>
            <h2 className="text-2xl font-bold text-white tracking-tighter">
              {selectedMarker ? selectedMarker.region_name : "Bengaluru Network"}
            </h2>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {intelligence.stats.map((stat: any, idx: number) => (
              <div key={idx} className="metric-card bg-surface/50 border border-border p-3 rounded flex flex-col items-center justify-center">
                <p className="text-[8px] font-mono text-slate-500 uppercase">{stat.label}</p>
                <p className="text-sm font-bold text-white mt-1">{stat.value}<span className="text-[7px] ml-0.5 text-slate-600">{stat.unit}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION B: Why This Matters */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center">
            <Zap className="w-3 h-3 mr-2 text-accent-primary" />
            Why This Matters
          </h4>
          <div className="p-4 border-l-2 border-accent-primary bg-accent-primary/5 rounded-r">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{intelligence.whyItMatters}"
            </p>
          </div>
        </section>

        {/* SECTION C: Who Controls the Rail */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center">
            <Globe className="w-3 h-3 mr-2 text-accent-secondary" />
            Who Controls the Rail
          </h4>
          <div className="p-4 border border-border bg-surface/30 rounded">
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {intelligence.whoControls}
            </p>
          </div>
        </section>

        {/* SECTION D: Functional Filters & Tooltips */}
        <section className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-3 h-3 text-slate-500" />
            <h4 className="text-[10px] font-mono text-slate-500 uppercase">Functional Filters</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {['ALL_RAILS', 'URBAN', 'INDUSTRIAL', 'SUBURBAN', 'RESIDENTIAL', 'COMMERCIAL'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-2 text-[9px] font-mono border transition-all ${
                  activeFilter === filter 
                    ? 'border-accent-primary text-accent-primary bg-accent-primary/10' 
                    : 'border-border text-slate-500 hover:text-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Temporal Scrubbing</span>
              <span className="text-xs font-mono text-accent-primary">{selectedYear}</span>
            </div>
            <input 
              type="range" 
              min="2000" 
              max="2023" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full accent-accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex-1 px-3 py-2 border rounded text-[9px] font-mono transition-all ${
                showHeatmap 
                  ? 'border-accent-secondary text-accent-secondary bg-accent-secondary/5' 
                  : 'border-border text-slate-500'
              }`}
            >
              [HEATMAP: {showHeatmap ? 'ON' : 'OFF'}]
            </button>
          </div>
        </section>

        {/* SECTION E: Download Sample Data */}
        <div className="mt-auto pt-8">
          <button 
            onClick={handleDownload}
            className="w-full py-4 bg-accent-primary text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-secondary transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
          >
            <Download className="w-3 h-3" />
            <span>Download Sample Data</span>
          </button>
        </div>

        {/* Side Footer */}
        <div className="flex justify-between items-center text-[8px] font-mono text-slate-600 mt-4">
           <span className="flex items-center">
             <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-2 animate-pulse"></span>
             DATA_ENCRYPTED
           </span>
           <span>REAL_RAILS_v2.0</span>
        </div>
      </aside>
    </main>
  );
}
