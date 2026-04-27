'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchGrowthMetrics, saveAOI } from '@/lib/api';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#030712] animate-pulse flex items-center justify-center font-mono text-[10px] text-slate-700">INITIALIZING_SPATIAL_ENGINE...</div>
});

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL_RAILS');
  const [activeTab, setActiveTab] = useState('SCHEMES');
  const [mapMode, setMapMode] = useState<'BEFORE' | 'AFTER'>('AFTER');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
  const [savedAois, setSavedAois] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const result = await fetchGrowthMetrics(activeFilter.toLowerCase());
      setData(result);
      setLoading(false);
    }
    loadData();
    
    // Load Saved AOIs from LocalStorage on mount
    const saved = JSON.parse(localStorage.getItem('saved_aois') || '[]');
    setSavedAois(saved);
  }, [activeFilter]);

  const handleSaveSnapshot = async () => {
    setSaveStatus('SAVING');
    const snapshot = {
      name: `${activeFilter}_${new Date().toLocaleTimeString()}`,
      latitude: 12.9716,
      longitude: 77.5946,
      zoom: 13,
      user_id: 'internship_user_01',
      timestamp: new Date().toISOString()
    };
    const result = await saveAOI(snapshot);
    const updated = [result, ...savedAois];
    setSavedAois(updated);
    localStorage.setItem('saved_aois', JSON.stringify(updated));
    setSaveStatus('SAVED');
    setTimeout(() => setSaveStatus('IDLE'), 2000);
  };

  const latestMetric = data?.metrics?.[data.metrics.length - 1];

  return (
    <main className="flex h-screen w-screen bg-[#030712] text-foreground font-sans overflow-hidden select-none">
      
      {/* MAIN STAGE (70%) */}
      <section className="h-full w-[70vw] relative overflow-hidden border-r border-[#1F2937]">
        <div className="absolute inset-0 z-0">
          <MapComponent filter={activeFilter} mode={mapMode} showHeatmap={showHeatmap} />
        </div>

        {/* HUD: Branding & Status */}
        <div className="absolute top-8 left-8 z-20 space-y-4">
          <div className="space-y-1">
            <h1 className="text-[10px] font-mono tracking-[0.4em] text-accent-primary uppercase opacity-60">Intelligence Framework v1.0</h1>
            <h2 className="text-3xl font-bold text-white tracking-tighter">Urban Growth <span className="text-accent-primary">Time Machine</span></h2>
          </div>
          
          <div className="flex space-x-2">
            {['ALL_RAILS', 'LIVE', 'PILOT', 'PLANNED'].map((filter) => (
              <div key={filter} className="group relative">
                <button 
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 text-[10px] font-mono border transition-all ${
                    activeFilter === filter 
                      ? 'border-accent-primary text-accent-primary bg-accent-primary/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                      : 'border-border-custom text-slate-500 hover:border-slate-400 hover:text-slate-300'
                  }`}
                >
                  {filter}
                </button>
                {/* Tooltip (Section 1) */}
                <div className="absolute top-full mt-2 hidden group-hover:block bg-black border border-border-custom p-2 text-[8px] font-mono text-slate-400 z-50 whitespace-nowrap">
                  FILTER_BY_GROWTH_STATUS: {filter}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HUD: Map Controls */}
        <div className="absolute top-8 right-8 z-20 flex flex-col items-end space-y-2">
            <div className="glass-panel p-1 rounded-full flex items-center border-[#1F2937] bg-black/60">
                <button 
                    onClick={() => setMapMode('BEFORE')}
                    className={`px-4 py-1 rounded-full text-[9px] font-mono transition-all ${mapMode === 'BEFORE' ? 'bg-accent-primary text-black' : 'text-slate-500'}`}
                >
                    2018_BASE
                </button>
                <button 
                    onClick={() => setMapMode('AFTER')}
                    className={`px-4 py-1 rounded-full text-[9px] font-mono transition-all ${mapMode === 'AFTER' ? 'bg-accent-primary text-black' : 'text-slate-500'}`}
                >
                    2023_SYNC
                </button>
            </div>
            
            {/* Heatmap Toggle (Section 3) */}
            <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 glass-panel border rounded text-[9px] font-mono transition-all ${showHeatmap ? 'border-accent-secondary text-accent-secondary' : 'border-border-custom text-slate-500'}`}
            >
                [POPULATION_HEATMAP: {showHeatmap ? 'ENABLED' : 'DISABLED'}]
            </button>
        </div>

        {/* Ticker HUD */}
        <div className="ticker-container !bottom-0 !bg-black/80">
          <div className="ticker-text py-2">
            ENGINE_STATUS: NOMINAL // TIME_WINDOW: {mapMode} // DETECTED_ANOMALY: {data?.trend_anomaly || 'NONE'} // INTEL_SCORE: {data?.intelligence_score || '0.00'} // REAL_RAILS_INTELLIGENCE_PROTOCOL_ACTIVE
          </div>
        </div>
      </section>

      {/* SIDEBAR (30%) */}
      <aside className="h-full w-[30vw] bg-[#060a14] flex flex-col border-l border-[#1F2937]">
        <div className="p-8 pb-12 space-y-8 overflow-y-auto">
          
          {/* SECTION A: Header & Persistence */}
          <section>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[10px] font-mono tracking-widest text-accent-primary uppercase">Section A — Global Overview</h3>
              <button 
                onClick={handleSaveSnapshot}
                disabled={saveStatus !== 'IDLE'}
                className="text-[9px] font-mono border border-border-custom px-2 py-0.5 rounded hover:border-accent-primary transition-all text-slate-500 hover:text-accent-primary bg-black/20"
              >
                {saveStatus === 'IDLE' ? '[SAVE_SNAPSHOT]' : `[${saveStatus}]`}
              </button>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">Predictive Infrastructure Intelligence</h2>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="metric-card bg-[#0B1117] border-[#1F2937] p-4 rounded border">
                 <p className="text-[10px] font-mono text-slate-500 uppercase">Trend Anomaly</p>
                 <div className={`text-xl font-bold ${data?.trend_anomaly === 'DECOUPLING' ? 'text-red-400' : 'text-accent-primary'}`}>
                   {loading ? '...' : data?.trend_anomaly}
                 </div>
              </div>
              <div className="metric-card bg-[#0B1117] border-[#1F2937] p-4 rounded border">
                 <p className="text-[10px] font-mono text-slate-500 uppercase">Intel Score</p>
                 <div className="text-xl font-bold text-accent-secondary">
                   {data?.intelligence_score || '0.00'}
                 </div>
              </div>
            </div>
          </section>

          {/* Navigation Engine */}
          <section>
            <div className="flex border-b border-border-custom">
               {['SCHEMES', 'REGIONS', 'TIMELINE', 'LIBRARY'].map(tab => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-2 text-[10px] font-mono transition-all ${
                     activeTab === tab 
                       ? 'border-b-2 border-accent-primary text-white' 
                       : 'text-slate-500 hover:text-slate-300'
                   }`}
                 >
                    {tab}
                 </button>
               ))}
            </div>
          </section>

          {/* Tab Engine Content */}
          <div className="min-h-[250px]">
            {activeTab === 'SCHEMES' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <section className="space-y-2">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">Why This Matters (Infra Insight)</h3>
                  <div className="p-4 bg-accent-primary/5 border border-accent-primary/20 rounded">
                    <p className="text-[12px] text-slate-400 leading-relaxed italic">
                      "Urban expansion is currently decoupled from utility density. Predictive modeling suggest a 14-month window before infrastructure failure in the West Corridor."
                    </p>
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">Who Controls the Rail</h3>
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    Governance sits with the <span className="text-white font-bold">ESA Spatial Authority</span> and the <span className="text-white font-bold">Regional Planning Bureau</span>. All decisions are subject to spectral verification.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'REGIONS' && (
              <div className="space-y-3 animate-in slide-in-from-right duration-300">
                 <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">Critical Change Summary</h3>
                 {loading ? <p className="text-xs font-mono text-slate-600">LOADING_SPATIAL_DATA...</p> : (
                    <div className="space-y-2">
                      <div className="p-4 bg-red-900/10 border border-red-900/30 rounded flex justify-between items-center">
                         <div>
                            <p className="text-[11px] font-bold text-white">BANGALORE_WEST_CORRIDOR</p>
                            <p className="text-[9px] font-mono text-red-400/70">URGENT_UPGRADE_REQUIRED</p>
                         </div>
                         <span className="text-lg font-bold text-red-500">+31%</span>
                      </div>
                      <div className="p-4 bg-[#0B1117] border border-border-custom rounded flex justify-between items-center opacity-60">
                         <div>
                            <p className="text-[11px] font-bold text-white">CENTRAL_TRANSIT_HUB</p>
                            <p className="text-[9px] font-mono text-slate-500">MONITORING_ACTIVE</p>
                         </div>
                         <span className="text-lg font-bold text-slate-400">+12%</span>
                      </div>
                    </div>
                 )}
              </div>
            )}

            {activeTab === 'LIBRARY' && (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                 <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">Intelligence Library (Saved AOIs)</h3>
                 <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {savedAois.length === 0 ? (
                        <p className="text-[10px] font-mono text-slate-600">NO_SAVED_SNAPSHOTS_FOUND</p>
                    ) : savedAois.map((aoi, i) => (
                        <div key={i} className="p-3 border border-border-custom hover:border-accent-primary transition-all cursor-pointer bg-black/20 rounded flex justify-between items-center group">
                            <div>
                                <p className="text-[11px] font-bold text-white">{aoi.name}</p>
                                <p className="text-[8px] font-mono text-slate-500">{new Date(aoi.timestamp).toLocaleString()}</p>
                            </div>
                            <span className="text-[8px] font-mono text-accent-primary group-hover:underline">RELOAD</span>
                        </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          {/* Section D: Predictive Insights */}
          <section className="space-y-3 pt-6 border-t border-border-custom">
             <h3 className="text-[10px] font-mono uppercase text-slate-500">Predictive Intelligence Layer</h3>
             <div className="p-5 border border-accent-primary/20 bg-accent-primary/5 rounded shadow-inner">
                <p className="text-[11px] text-accent-primary leading-relaxed font-mono">
                  {loading ? 'ANALYZING_SATELLITE_TELEMETRY...' : data?.insight}
                </p>
             </div>
          </section>

          {/* Section E: Export Engine */}
          <button 
            onClick={() => {
              const exportData = { ...data, exported_at: new Date().toISOString() };
              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `urban_intel_snapshot_${new Date().getTime()}.json`;
              link.click();
            }}
            className="w-full py-4 bg-accent-primary/5 border border-accent-primary/20 text-accent-primary text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-primary/10 transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(56,189,248,0.05)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Generate Intelligence Report</span>
          </button>
        </div>

        {/* Footer HUD */}
        <div className="mt-auto p-4 border-t border-border-custom flex justify-between items-center text-[9px] font-mono text-slate-700">
           <span>ENCRYPTED_LINK: ACTIVE</span>
           <span className="text-green-900/50 flex items-center">
             <span className="w-1.5 h-1.5 rounded-full bg-green-900 mr-1.5 animate-pulse"></span>
             PROTOCOL_COMPLIANT
           </span>
        </div>
      </aside>
    </main>
  );
}
