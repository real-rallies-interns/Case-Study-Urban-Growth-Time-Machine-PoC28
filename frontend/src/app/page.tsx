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
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  
  const [intelligence, setIntelligence] = useState<any>({
    whyItMatters: "Urban expansion is currently decoupled from utility density. Predictive modeling suggests a 14-month window before infrastructure failure in the West Corridor.",
    whoControls: "Governance sits with the ESA Spatial Authority and the Regional Planning Bureau. All decisions are subject to spectral verification.",
    stats: [
        { label: "Trend Anomaly", value: "ACCELERATING", unit: "" },
        { label: "Intel Score", value: "0.99", unit: "" }
    ]
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const rawMetrics = await fetchAllGrowthMetrics();
      if (Array.isArray(rawMetrics) && rawMetrics.length > 0) {
        setData({ metrics: rawMetrics });
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
        whyItMatters: `Detected ${type.toLowerCase()} development in ${marker.region_name}. Built-up area increased by ${marker.built_up_area_sqkm}sqkm. Infrastructure demand is peaking in the local corridors.`,
        whoControls: `Primary development oversight in this node is held by the ${type === 'INDUSTRIAL' ? 'KIADB' : 'BDA'}, monitoring land-use compliance and infrastructure load.`,
        stats: [
            { label: "Trend Anomaly", value: isHighGrowth ? "ACCELERATING" : "STABLE", unit: "" },
            { label: "Intel Score", value: (0.9 + (Math.random() * 0.09)).toFixed(2), unit: "" }
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
          onMarkerClick={handleMarkerClick}
          selectedMarkerId={selectedMarker?.aoi_id}
        />

        {/* TOP LEFT HUD: FILTERS */}
        <div className="absolute top-20 left-16 z-[700] flex flex-col space-y-4 pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="text-3xl font-bold text-white tracking-tighter mb-4">
              Urban Growth <span className="text-accent-primary">Time Machine</span>
            </h1>
            <div className="flex space-x-2">
              {['ALL_RAILS', 'LIVE', 'PILOT', 'PLANNED'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter === 'ALL_RAILS' ? 'ALL_RAILS' : filter)}
                  className={`px-4 py-1.5 text-[10px] font-mono border transition-all ${
                    activeFilter === filter 
                      ? 'border-accent-primary text-accent-primary bg-accent-primary/10' 
                      : 'border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300 bg-black/40 backdrop-blur-md'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TOP RIGHT HUD: ENGINE STATUS & YEAR TOGGLES */}
        <div className="absolute top-12 right-8 z-[700] flex flex-col items-end space-y-4 pointer-events-none">
          <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded min-w-[200px]">
            <div className="text-[9px] font-mono text-accent-primary uppercase tracking-widest text-right mb-3">
              ENGINE_ACTIVE // MODE: AFTER
            </div>
            
            <div className="flex justify-between space-x-2">
              <button 
                onClick={() => setSelectedYear(2018)}
                className={`flex-1 py-1 text-[10px] font-mono border rounded transition-all ${
                  selectedYear === 2018 
                    ? 'border-accent-primary text-accent-primary bg-accent-primary/10' 
                    : 'border-white/10 text-slate-500 hover:text-slate-300'
                }`}
              >
                2018_BASE
              </button>
              <button 
                onClick={() => setSelectedYear(2023)}
                className={`flex-1 py-1 text-[10px] font-mono border rounded transition-all ${
                  selectedYear === 2023 
                    ? 'border-accent-primary text-accent-primary bg-accent-primary/10' 
                    : 'border-white/10 text-slate-500 hover:text-slate-300'
                }`}
              >
                2023_SYNC
              </button>
            </div>
          </div>
        </div>
        
        {/* TICKER */}
        <div className="ticker-container">
          <div className="ticker-text">
            ENGINE_STATUS: NOMINAL // TIME_WINDOW: {selectedYear} // NODE_COUNT: {data?.metrics?.length || 0} // PROTOCOL: RR_MASTER_MANIFESTO // DATA_SOURCE: SYNTHETIC_SPATIOTEMPORAL_ENGINE // DEVELOPER: ANANTHU ANIL
          </div>
        </div>
      </section>

      {/* INTELLIGENCE SIDEBAR (30%) */}
      <aside className="sidebar flex flex-col p-8 pt-24 space-y-10">
        
        {/* SECTION A: GLOBAL OVERVIEW */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.3em]">Section A — Global Overview</h3>
            <button className="text-[8px] font-mono border border-white/10 px-2 py-0.5 rounded text-slate-500 hover:text-accent-primary hover:border-accent-primary transition-all">
                [SAVE_SNAPSHOT]
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-tighter leading-tight">
            Predictive Infrastructure Intelligence
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {intelligence.stats.map((stat: any, idx: number) => (
              <div key={idx} className="metric-card bg-surface/50 border border-border p-5 rounded-sm">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-accent-primary tracking-tighter">{stat.value}<span className="text-[10px] ml-1 text-slate-600">{stat.unit}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* TABS (Mock) */}
        <div className="flex border-b border-border">
            {['SCHEMES', 'REGIONS', 'TIMELINE', 'LIBRARY'].map((tab, idx) => (
                <button key={tab} className={`flex-1 py-3 text-[9px] font-mono transition-all ${idx === 0 ? 'text-white border-b-2 border-accent-primary' : 'text-slate-600 hover:text-slate-400'}`}>
                    {tab}
                </button>
            ))}
        </div>

        {/* WHY THIS MATTERS */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">
            Why This Matters (Infra Insight)
          </h4>
          <div className="p-6 border border-border bg-white/5 rounded-sm">
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "{intelligence.whyItMatters}"
            </p>
          </div>
        </section>

        {/* WHO CONTROLS THE RAIL */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">
            Who Controls the Rail
          </h4>
          <div className="text-xs text-slate-400 leading-relaxed">
            <p>
                Governance sits with the <span className="text-white font-bold">ESA Spatial Authority</span> and the <span className="text-white font-bold">Regional Planning Bureau</span>. All decisions are subject to spectral verification.
            </p>
          </div>
        </section>

        {/* PREDICTIVE INTELLIGENCE LAYER */}
        <section className="space-y-4 pt-8 border-t border-border">
          <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Predictive Intelligence Layer</h4>
          <div className="p-6 border border-accent-primary/20 bg-accent-primary/5 rounded-sm">
            <p className="text-xs text-accent-primary leading-relaxed font-mono">
              {intelligence.whyItMatters}
            </p>
          </div>
        </section>

        {/* Side Footer */}
        <div className="mt-auto flex justify-between items-center text-[8px] font-mono text-slate-700">
           <span>ENCRYPTED_LINK: ACTIVE</span>
           <span className="flex items-center">
             <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-2"></span>
             PROTOCOL_COMPLIANT
           </span>
        </div>
      </aside>
    </main>
  );
}
