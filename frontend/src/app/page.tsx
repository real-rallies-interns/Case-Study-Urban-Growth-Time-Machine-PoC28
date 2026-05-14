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
  const [activeTab, setActiveTab] = useState('SCHEMES');
  
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
              {['ALL_RAILS', 'URBAN', 'INDUSTRIAL', 'SUBURBAN', 'RESIDENTIAL', 'COMMERCIAL', 'RURAL'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-[10px] font-mono border transition-all ${
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

        {/* TABS */}
        <div className="flex border-b border-border">
            {['SCHEMES', 'REGIONS', 'TIMELINE', 'LIBRARY'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-[9px] font-mono transition-all ${activeTab === tab ? 'text-white border-b-2 border-accent-primary' : 'text-slate-600 hover:text-slate-400'}`}>
                    {tab}
                </button>
            ))}
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">

          {/* SCHEMES TAB */}
          {activeTab === 'SCHEMES' && (
            <>
              <section className="space-y-4">
                <h4 className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">Why This Matters (Infra Insight)</h4>
                <div className="p-6 border border-border bg-white/5 rounded-sm">
                  <p className="text-xs text-slate-400 leading-relaxed italic">"{intelligence.whyItMatters}"</p>
                </div>
              </section>
              <section className="space-y-4">
                <h4 className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">Who Controls the Rail</h4>
                <div className="text-xs text-slate-400 leading-relaxed">
                  <p>Governance sits with the <span className="text-white font-bold">ESA Spatial Authority</span> and the <span className="text-white font-bold">Regional Planning Bureau</span>. All decisions are subject to spectral verification.</p>
                </div>
              </section>
              <section className="space-y-4 pt-8 border-t border-border">
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Predictive Intelligence Layer</h4>
                <div className="p-6 border border-accent-primary/20 bg-accent-primary/5 rounded-sm">
                  <p className="text-xs text-accent-primary leading-relaxed font-mono">{intelligence.whyItMatters}</p>
                </div>
              </section>
            </>
          )}

          {/* REGIONS TAB — driven by selected marker */}
          {activeTab === 'REGIONS' && (
            <section className="space-y-3">
              {!selectedMarker ? (
                <div className="p-8 border border-border bg-white/5 rounded-sm text-center">
                  <Globe className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-[10px] font-mono text-slate-500">CLICK A MARKER ON THE MAP</p>
                  <p className="text-[9px] font-mono text-slate-600 mt-1">to view region-specific intelligence</p>
                </div>
              ) : (() => {
                const aoiId = selectedMarker.aoi_id;
                const regionName = selectedMarker.region_name || aoiId;
                const regionRecords = data?.metrics?.filter((m: any) => m.aoi_id === aoiId).sort((a: any, b: any) => a.year - b.year) || [];
                const currentRecord = regionRecords.find((r: any) => r.year === selectedYear) || selectedMarker;
                const latestRecord = regionRecords[regionRecords.length - 1];
                const baselineRecord = regionRecords[0];
                const growthDelta = latestRecord && baselineRecord ? (latestRecord.built_up_area_sqkm - baselineRecord.built_up_area_sqkm).toFixed(2) : '—';
                const popDelta = latestRecord && baselineRecord ? (latestRecord.population_density - baselineRecord.population_density).toFixed(0) : '—';

                // Find nearby regions of same land_use_type
                const sameTypeRegions = data?.metrics?.filter((m: any) => m.land_use_type === selectedMarker.land_use_type && m.year === selectedYear && m.aoi_id !== aoiId) || [];
                const nearbyUnique = [...new Map(sameTypeRegions.map((r: any) => [r.aoi_id, r])).values()].slice(0, 5);

                return (
                  <>
                    <h4 className="text-[10px] font-mono text-accent-primary font-bold uppercase tracking-widest">{regionName}</h4>
                    <p className="text-[9px] font-mono text-slate-500">AOI: {aoiId} // TYPE: {currentRecord.land_use_type} // SCENARIO: {currentRecord.scenario || '—'}</p>

                    {/* Current year stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 border border-border rounded-sm">
                        <p className="text-[8px] font-mono text-slate-500">BUILT-UP AREA</p>
                        <p className="text-lg font-bold text-accent-primary font-mono">{currentRecord.built_up_area_sqkm}<span className="text-[9px] text-slate-500 ml-1">km²</span></p>
                      </div>
                      <div className="p-3 bg-white/5 border border-border rounded-sm">
                        <p className="text-[8px] font-mono text-slate-500">POP. DENSITY</p>
                        <p className="text-lg font-bold text-accent-secondary font-mono">{currentRecord.population_density?.toFixed(0)}<span className="text-[9px] text-slate-500 ml-1">/km²</span></p>
                      </div>
                      <div className="p-3 bg-white/5 border border-border rounded-sm">
                        <p className="text-[8px] font-mono text-slate-500">GROWTH VELOCITY</p>
                        <p className={`text-lg font-bold font-mono ${(currentRecord.growth_velocity_pct || 0) > 15 ? 'text-red-400' : (currentRecord.growth_velocity_pct || 0) > 5 ? 'text-yellow-400' : 'text-green-400'}`}>{currentRecord.growth_velocity_pct?.toFixed(1)}%</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-border rounded-sm">
                        <p className="text-[8px] font-mono text-slate-500">INFRA INDEX</p>
                        <p className="text-lg font-bold text-white font-mono">{currentRecord.infrastructure_index?.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Historical delta */}
                    <div className="p-4 border border-accent-primary/20 bg-accent-primary/5 rounded-sm">
                      <p className="text-[9px] font-mono text-accent-primary mb-2">HISTORICAL DELTA ({baselineRecord?.year}→{latestRecord?.year})</p>
                      <div className="flex justify-between">
                        <span className="text-[9px] font-mono text-slate-400">Built-Up Δ: <span className="text-white font-bold">+{growthDelta} km²</span></span>
                        <span className="text-[9px] font-mono text-slate-400">Pop Δ: <span className="text-white font-bold">+{popDelta}/km²</span></span>
                      </div>
                    </div>

                    {/* Similar regions */}
                    {nearbyUnique.length > 0 && (
                      <>
                        <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-2">Similar {currentRecord.land_use_type} Regions</h4>
                        {nearbyUnique.map((r: any) => {
                          const severity = (r.growth_velocity_pct || 0) > 15 ? 'CRITICAL' : (r.growth_velocity_pct || 0) > 5 ? 'MODERATE' : 'LOW';
                          const color = severity === 'CRITICAL' ? 'text-red-400' : severity === 'MODERATE' ? 'text-yellow-400' : 'text-green-400';
                          return (
                            <div key={r.aoi_id} className="p-3 border border-border bg-white/5 rounded-sm flex justify-between items-center cursor-pointer hover:bg-white/10 transition-all"
                              onClick={() => handleMarkerClick(r)}>
                              <div>
                                <p className="text-[10px] font-mono text-white truncate max-w-[160px]">{r.region_name || r.aoi_id}</p>
                                <p className="text-[8px] font-mono text-slate-600">{r.built_up_area_sqkm} km²</p>
                              </div>
                              <p className={`text-xs font-mono font-bold ${color}`}>{r.growth_velocity_pct?.toFixed(1)}%</p>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </>
                );
              })()}
            </section>
          )}

          {/* TIMELINE TAB — driven by selected marker */}
          {activeTab === 'TIMELINE' && (
            <section className="space-y-4">
              {!selectedMarker ? (
                <div className="p-8 border border-border bg-white/5 rounded-sm text-center">
                  <Activity className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-[10px] font-mono text-slate-500">CLICK A MARKER ON THE MAP</p>
                  <p className="text-[9px] font-mono text-slate-600 mt-1">to view its temporal growth trajectory</p>
                </div>
              ) : (() => {
                const aoiId = selectedMarker.aoi_id;
                const regionName = selectedMarker.region_name || aoiId;
                const regionRecords = data?.metrics?.filter((m: any) => m.aoi_id === aoiId).sort((a: any, b: any) => a.year - b.year) || [];
                const maxGrowth = Math.max(...regionRecords.map((r: any) => r.growth_velocity_pct || 0), 1);

                return (
                  <>
                    <h4 className="text-[10px] font-mono text-accent-primary font-bold uppercase tracking-widest">{regionName} — Timeline</h4>
                    <p className="text-[9px] font-mono text-slate-500">{regionRecords.length} records // {regionRecords[0]?.year}–{regionRecords[regionRecords.length - 1]?.year}</p>

                    <div className="space-y-1.5">
                      {regionRecords.map((r: any) => {
                        const isSelected = r.year === selectedYear;
                        const barWidth = Math.min(100, ((r.growth_velocity_pct || 0) / maxGrowth) * 100);
                        const barColor = (r.growth_velocity_pct || 0) > 15 ? '#f87171' : (r.growth_velocity_pct || 0) > 5 ? '#fbbf24' : 'var(--accent-primary)';
                        return (
                          <div key={r.year} onClick={() => setSelectedYear(r.year)}
                            className={`p-2.5 border rounded-sm cursor-pointer transition-all ${isSelected ? 'border-accent-primary bg-accent-primary/10' : 'border-border bg-white/5 hover:bg-white/10'}`}>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold font-mono min-w-[40px]" style={{ color: isSelected ? 'var(--accent-primary)' : '#94a3b8' }}>{r.year}</span>
                              <div className="flex-1">
                                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, background: barColor }} />
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-white min-w-[45px] text-right">{r.growth_velocity_pct?.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between mt-1.5 px-[52px]">
                              <span className="text-[8px] font-mono text-slate-600">AREA: {r.built_up_area_sqkm} km²</span>
                              <span className="text-[8px] font-mono text-slate-600">POP: {r.population_density?.toFixed(0)}/km²</span>
                              <span className="text-[8px] font-mono text-slate-600">INFRA: {r.infrastructure_index?.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </section>
          )}

          {/* LIBRARY TAB — driven by selected marker */}
          {activeTab === 'LIBRARY' && (
            <section className="space-y-4">
              {!selectedMarker ? (
                <div className="p-8 border border-border bg-white/5 rounded-sm text-center">
                  <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-[10px] font-mono text-slate-500">CLICK A MARKER ON THE MAP</p>
                  <p className="text-[9px] font-mono text-slate-600 mt-1">to view and export its full data profile</p>
                </div>
              ) : (() => {
                const aoiId = selectedMarker.aoi_id;
                const regionName = selectedMarker.region_name || aoiId;
                const regionRecords = data?.metrics?.filter((m: any) => m.aoi_id === aoiId).sort((a: any, b: any) => a.year - b.year) || [];
                const currentRecord = regionRecords.find((r: any) => r.year === selectedYear) || selectedMarker;

                const handleRegionExport = () => {
                  const blob = new Blob([JSON.stringify(regionRecords, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${aoiId}_full_data.json`;
                  link.click();
                };

                return (
                  <>
                    <h4 className="text-[10px] font-mono text-accent-primary font-bold uppercase tracking-widest">{regionName} — Data Profile</h4>

                    {/* Export button */}
                    <div onClick={handleRegionExport} className="p-4 border border-border bg-white/5 rounded-sm cursor-pointer hover:bg-white/10 hover:border-accent-primary/50 transition-all flex items-center gap-3">
                      <Download className="w-4 h-4 text-accent-primary" />
                      <div>
                        <p className="text-[10px] font-mono text-white font-bold">EXPORT {aoiId}</p>
                        <p className="text-[9px] font-mono text-slate-500">{regionRecords.length} records across all years</p>
                      </div>
                    </div>

                    {/* Full data card for selected year */}
                    <div className="p-4 border border-border bg-white/5 rounded-sm">
                      <p className="text-[10px] font-mono text-white font-bold mb-3">NODE DATA // {selectedYear}</p>
                      <div className="space-y-2">
                        {[
                          { label: 'AOI_ID', value: currentRecord.aoi_id },
                          { label: 'REGION', value: regionName },
                          { label: 'YEAR', value: currentRecord.year },
                          { label: 'LAT / LNG', value: `${currentRecord.latitude?.toFixed(4)}, ${currentRecord.longitude?.toFixed(4)}` },
                          { label: 'BUILT_UP_AREA', value: `${currentRecord.built_up_area_sqkm} km²` },
                          { label: 'POP_DENSITY', value: `${currentRecord.population_density?.toFixed(2)} /km²` },
                          { label: 'GROWTH_VELOCITY', value: `${currentRecord.growth_velocity_pct?.toFixed(2)}%` },
                          { label: 'INFRA_INDEX', value: currentRecord.infrastructure_index?.toFixed(3) },
                          { label: 'CAPITAL_INVEST', value: `$${currentRecord.capital_investment_m_usd?.toFixed(2)}M` },
                          { label: 'LAND_USE_TYPE', value: currentRecord.land_use_type },
                          { label: 'CONFIDENCE', value: currentRecord.confidence_score?.toFixed(2) || '—' },
                          { label: 'SCENARIO', value: currentRecord.scenario || '—' },
                        ].map((row) => (
                          <div key={row.label} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                            <span className="text-[8px] font-mono text-slate-500">{row.label}</span>
                            <span className="text-[10px] font-mono text-white font-bold">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Year-over-year summary */}
                    <div className="p-4 border border-border bg-white/5 rounded-sm">
                      <p className="text-[10px] font-mono text-white font-bold mb-2">COVERAGE SUMMARY</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-black/30 rounded">
                          <p className="text-[8px] font-mono text-slate-500">TOTAL RECORDS</p>
                          <p className="text-lg font-bold text-accent-primary font-mono">{regionRecords.length}</p>
                        </div>
                        <div className="p-3 bg-black/30 rounded">
                          <p className="text-[8px] font-mono text-slate-500">TIME SPAN</p>
                          <p className="text-lg font-bold text-accent-secondary font-mono">{regionRecords.length > 0 ? `${regionRecords[regionRecords.length - 1].year - regionRecords[0].year}yr` : '—'}</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </section>
          )}
        </div>

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
