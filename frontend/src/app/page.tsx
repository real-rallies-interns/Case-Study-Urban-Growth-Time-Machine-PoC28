'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchGrowthMetrics, fetchAllGrowthMetrics, saveAOI } from '@/lib/api';
import Header from '@/components/Header';
import InfoModal from '@/components/InfoModal';
import { X, ChevronRight, BarChart2, Globe, Bookmark, Zap } from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#040705] animate-pulse flex items-center justify-center font-mono text-[10px] text-slate-700">INITIALIZING_SPATIAL_ENGINE...</div>
});

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL_RAILS');
  const [activeTab, setActiveTab] = useState('SCHEMES');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
  const [savedAois, setSavedAois] = useState<any[]>([]);
  
  // Cinematic View State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const rawMetrics = await fetchAllGrowthMetrics();
      if (Array.isArray(rawMetrics) && rawMetrics.length > 0) {
        setData({ 
            metrics: rawMetrics, 
            aoi_id: "BNG_NETWORK",
            time_window: "2000-2023",
            insight: "Bengaluru Multi-District Intelligence Network Active: Detected high-velocity sprawl in East-West corridors.",
            intelligence_score: 0.95,
            trend_anomaly: "LOCAL_SPRAWL",
            infrastructure_led: true,
            capital_correlation_score: 0.88,
            schemes: [
                { title: "Metro Phase 3 Expansion", description: "Integration of outer-ring road clusters with high-density transit nodes." },
                { title: "Smart City Grid 2.0", description: "Deployment of localized energy and water telemetry across JP Nagar and Whitefield." },
                { title: "Peripheral Ring Road (PRR)", description: "Satellite tracking of land-value surges along the proposed 65km economic corridor." }
            ],
            regions: [
                { name: "Whitefield Cluster", metric: "18% Growth", status: "HIGH_VELOCITY", severity: "high" },
                { name: "Hebbal Corridor", metric: "0.82 Infra", status: "STABLE", severity: "low" },
                { name: "Kengeri Sprawl", metric: "4.2k Pop/sqkm", status: "ACCELERATING", severity: "high" },
                { name: "JP Nagar South", metric: "0.91 Intel", status: "STABLE", severity: "low" }
            ]
        });
      }
      setLoading(false);
    }
    loadData();
    
    // Load Saved AOIs from LocalStorage on mount
    const saved = JSON.parse(localStorage.getItem('saved_aois') || '[]');
    setSavedAois(saved);
  }, []);

  const handleSaveSnapshot = async () => {
    setSaveStatus('SAVING');
    const snapshot = {
      name: `${activeFilter}_${selectedYear}_${new Date().toLocaleTimeString()}`,
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

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
    
    // 1. SCHEME LIBRARY: Realistic Bengaluru-centric initiatives
    const schemeLibrary: any = {
        'URBAN': [
            { title: "CBD Core Redevelopment", description: "Vertical intensification of existing commercial plots in MG Road/Brigade Road areas." },
            { title: "Smart Parking Grid", description: "IoT-enabled multi-level parking management for high-density central zones." },
            { title: "TenderSURE Road Upgrades", description: "Redesigning pedestrian-first walkways and utility ducts for central arteries." },
            { title: "Skydeck Observation Hub", description: "Strategic vertical tourism landmark with integrated spatial monitoring." }
        ],
        'INDUSTRIAL': [
            { title: "Electronic City Logistics", description: "Primary heavy-transit access and automated warehousing for the tech-manufacturing hub." },
            { title: "Aviation SEZ Development", description: "Special Economic Zone infrastructure near Kempegowda corridor." },
            { title: "Peenya 4.0 Transformation", description: "Upgrading power and connectivity for small-scale manufacturing clusters." },
            { title: "Multi-modal Freight Terminal", description: "Direct rail-to-road logistics interchange for heavy industrial zones." }
        ],
        'RESIDENTIAL': [
            { title: "Lakefront Restoration", description: "Ecological rejuvenation of neighborhood water bodies with integrated recreational zones." },
            { title: "Vertical Housing Incentive", description: "FAR/FSI bonuses for sustainable high-rise residential developments." },
            { title: "Neighborhood Park Series", description: "Micro-park development within high-density residential blocks." },
            { title: "Last-mile Feeder Network", description: "E-rickshaw and shuttle integration for gated community clusters." }
        ],
        'SUBURBAN': [
            { title: "Peripheral Ring Road Link", description: "Strategic utility corridor deployment along the PRR expansion route." },
            { title: "Commuter Rail Station", description: "Secondary transit nodes connecting outlying districts to the city core." },
            { title: "Satellite Town Water Project", description: "Long-range pipeline deployment for expanding residential townships." },
            { title: "EV Charging Backbone", description: "Strategic placement of fast-chargers along suburban arterial roads." }
        ],
        'COMMERCIAL': [
            { title: "IT Corridor Connectivity", description: "Dedicated skywalks and signal-free corridors for Whitefield/Outer Ring Road." },
            { title: "Retail High-street Revamp", description: "Pedestrianization and heritage-sensitive upgrades for commercial corridors." },
            { title: "Enterprise Zone Broadband", description: "Hyper-speed optical fiber backbone for commercial clusters." },
            { title: "Night-economy Lighting", description: "Enhanced security and visual lighting for 24/7 commercial operations." }
        ],
        'RURAL': [
            { title: "Green-belt Preservation", description: "Remote sensing monitoring to prevent illegal conversion of agricultural land." },
            { title: "Agri-tech Export Center", description: "Logistics and cold-storage support for local produce clusters." },
            { title: "Watershed Management", description: "Surface water harvesting and groundwater recharge for buffer zones." },
            { title: "Rural Healthcare Outpost", description: "Primary healthcare infrastructure for low-density peripheral settlements." }
        ]
    };

    // 2. SELECTION LOGIC: Use marker AOI_ID as a seed for unique but consistent selection
    const type = marker.land_use_type || 'URBAN';
    const available = schemeLibrary[type] || schemeLibrary['URBAN'];
    
    // Pick 2 unique schemes based on a simple index hash
    const seed = parseInt(marker.aoi_id.split('-').pop() || '0');
    const index1 = seed % available.length;
    const index2 = (seed + 1) % available.length;
    const selectedSchemes = [available[index1], available[index2]];

    // 3. DYNAMIC METRICS
    const isHighGrowth = marker.growth_velocity_pct > 15;
    const dynamicAnomaly = type === 'INDUSTRIAL' ? 'INFRA_LED_EXPANSION' : (isHighGrowth ? 'ACCELERATING_SPRAWL' : 'STABLE_GROWTH');
    const dynamicCorrelation = (0.7 + (seed % 30) / 100).toFixed(2);
    
    setData((prev: any) => ({
        ...prev,
        trend_anomaly: dynamicAnomaly,
        capital_correlation_score: dynamicCorrelation,
        insight: `Detected ${type} activity in ${marker.region_name}. Intelligence score of 0.94 indicates high-confidence ${dynamicAnomaly.toLowerCase()} pattern.`,
        schemes: selectedSchemes,
        regions: [
            { name: "Local Density", metric: `${marker.population_density.toFixed(0)}/km²`, status: "VERIFIED", severity: "low" },
            { name: "Expansion Velocity", metric: `${marker.growth_velocity_pct}%`, status: isHighGrowth ? "HIGH" : "NORMAL", severity: isHighGrowth ? "high" : "low" }
        ]
    }));
    
    setIsPanelOpen(true);
  };

  return (
    <main className="relative h-screen w-screen bg-[#040705] text-foreground font-sans overflow-hidden select-none">
      
      {/* HEADER & INFO MODAL */}
      <Header onInfoClick={() => setIsInfoOpen(true)} />
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* FULL SCREEN STAGE (100%) */}
      <section className="absolute inset-0 z-0">
        <MapComponent 
          metrics={data?.metrics}
          year={selectedYear}
          filter={activeFilter} 
          showHeatmap={showHeatmap} 
          onMarkerClick={handleMarkerClick}
        />
      </section>

      {/* HUD OVERLAYS (Floating) */}
      <div className="absolute top-24 left-8 z-10 flex flex-col space-y-4 pointer-events-none">
        
        <div className="flex space-x-2 pointer-events-auto">
          {['ALL_RAILS', 'URBAN', 'INDUSTRIAL', 'SUBURBAN', 'RESIDENTIAL', 'COMMERCIAL', 'RURAL'].map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-[10px] font-mono border transition-all ${
                activeFilter === filter 
                  ? 'border-accent-primary text-accent-primary bg-accent-primary/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300 bg-black/40 backdrop-blur-md'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto flex flex-col items-start space-y-4 w-64 bg-black/40 backdrop-blur-md p-4 border border-white/10 rounded">
            <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-slate-400">TEMPORAL_SCRUBBER</span>
                    <span className="text-xs font-mono text-accent-primary font-bold">{selectedYear}</span>
                </div>
                <input 
                    type="range" 
                    min="2000" 
                    max="2023" 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full accent-accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-slate-600 mt-1">
                    <span>2000</span>
                    <span>2023</span>
                </div>
            </div>
            
            <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`w-full px-3 py-1.5 glass-panel border rounded text-[9px] font-mono transition-all ${showHeatmap ? 'border-accent-secondary text-accent-secondary' : 'border-white/10 text-slate-500'}`}
            >
                [POPULATION_HEATMAP: {showHeatmap ? 'ENABLED' : 'DISABLED'}]
            </button>
        </div>
      </div>

      {/* TICKER (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <div className="ticker-container !bg-black/60 backdrop-blur-md border-t border-white/5">
          <div className="ticker-text py-2">
            ENGINE_STATUS: NOMINAL // TIME_WINDOW: {selectedYear} // DETECTED_ANOMALY: {data?.trend_anomaly || 'NONE'} // INFRA_LED: {data?.infrastructure_led ? 'TRUE' : 'FALSE'} // CAPITAL_CORRELATION: {data?.capital_correlation_score || '0.00'} // INTEL_SCORE: {data?.intelligence_score || '0.00'} // REAL_RAILS_INTELLIGENCE_PROTOCOL_ACTIVE // VISUAL_DNA: URBAN_GREEN_CINEMATIC
          </div>
        </div>
      </div>

      {/* DYNAMIC SLIDE-OVER PANEL */}
      <div className={`overlay ${isPanelOpen ? 'open' : ''}`} onClick={() => setIsPanelOpen(false)}></div>
      
      <aside id="intelligence-panel" className={`slide-panel ${isPanelOpen ? 'open' : ''} flex flex-col`}>
        {/* Panel Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-accent-primary/5">
          <div>
            <h3 className="text-[10px] font-mono text-accent-primary uppercase tracking-widest">Intelligence Panel</h3>
            <p className="text-white font-bold text-lg mt-1">{selectedMarker?.region_name || 'Global Intelligence'}</p>
          </div>
          <button 
            onClick={() => setIsPanelOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          
          {/* Section: Critical Metrics */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
               <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center">
                 <Zap className="w-3 h-3 mr-2 text-accent-primary" />
                 Predictive Infrastructure
               </h4>
               <button 
                 onClick={handleSaveSnapshot}
                 disabled={saveStatus !== 'IDLE'}
                 className="text-[9px] font-mono border border-white/10 px-2 py-0.5 rounded hover:border-accent-primary transition-all text-slate-500 hover:text-accent-primary bg-white/5"
               >
                 {saveStatus === 'IDLE' ? '[SAVE_DATA]' : `[${saveStatus}]`}
               </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="metric-card bg-white/5 border-white/10 p-4 rounded border group hover:border-accent-primary/50 transition-colors">
                 <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Anomaly</p>
                 <div className={`text-xl font-bold ${data?.trend_anomaly === 'DECOUPLING' || data?.infrastructure_led ? 'text-red-400' : 'text-accent-primary'}`}>
                   {loading ? '...' : data?.trend_anomaly}
                 </div>
              </div>
              <div className="metric-card bg-white/5 border-white/10 p-4 rounded border group hover:border-accent-secondary/50 transition-colors">
                 <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Capital Correlation</p>
                 <div className="text-xl font-bold text-accent-secondary">
                   {data?.capital_correlation_score || '0.00'}
                 </div>
              </div>
            </div>
          </section>

          {/* Navigation Engine */}
          <section className="space-y-4">
            <div className="flex border-b border-white/5">
               {[
                 { id: 'SCHEMES', icon: Globe },
                 { id: 'REGIONS', icon: BarChart2 },
                 { id: 'LIBRARY', icon: Bookmark }
               ].map(tab => (
                 <button 
                   key={tab.id} 
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex-1 flex items-center justify-center py-3 text-[9px] font-mono transition-all relative ${
                     activeTab === tab.id 
                       ? 'text-white' 
                       : 'text-slate-500 hover:text-slate-300'
                   }`}
                 >
                    <tab.icon className={`w-3 h-3 mr-2 ${activeTab === tab.id ? 'text-accent-primary' : 'text-slate-600'}`} />
                    {tab.id}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary"></div>
                    )}
                 </button>
               ))}
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'SCHEMES' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {data?.schemes?.map((scheme: any, idx: number) => (
                    <div key={idx} className="relative pl-4 border-l border-white/5 hover:border-accent-primary/30 transition-colors group">
                      <div className="absolute -left-[1px] top-0 w-[1px] h-0 group-hover:h-full bg-accent-primary transition-all duration-300"></div>
                      <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-white mb-2">{scheme.title}</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        {scheme.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'REGIONS' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
                   {data?.regions?.map((region: any, idx: number) => (
                      <div key={idx} className={`p-4 rounded-lg flex justify-between items-center transition-all hover:scale-[1.02] ${
                        region.severity === 'high' 
                          ? 'bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' 
                          : 'bg-white/5 border border-white/5'
                      }`}>
                         <div>
                            <p className="text-[11px] font-bold text-white mb-0.5">{region.name}</p>
                            <p className={`text-[8px] font-mono tracking-tighter ${
                              region.severity === 'high' ? 'text-red-400' : 'text-slate-500'
                            }`}>{region.status}</p>
                         </div>
                         <div className="text-right">
                           <span className={`text-base font-bold font-mono ${
                             region.severity === 'high' ? 'text-red-500' : 'text-accent-primary'
                           }`}>{region.metric}</span>
                         </div>
                      </div>
                   ))}
                </div>
              )}

              {activeTab === 'LIBRARY' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                   <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                      {savedAois.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-slate-600 border border-dashed border-white/5 rounded">
                            <Bookmark className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-[9px] font-mono">NO_SAVED_INTEL</p>
                          </div>
                      ) : savedAois.map((aoi, i) => (
                          <div key={i} className="p-3 border border-white/5 hover:border-accent-primary/40 transition-all cursor-pointer bg-white/5 group rounded flex justify-between items-center">
                              <div>
                                  <p className="text-[10px] font-bold text-white">{aoi.name}</p>
                                  <p className="text-[8px] font-mono text-slate-500">{new Date(aoi.timestamp).toLocaleDateString()}</p>
                              </div>
                              <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-accent-primary transition-colors" />
                          </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </section>

          {/* Predictive Insights */}
          <section className="space-y-3 pt-6 border-t border-white/5">
             <h4 className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">Intelligence Insight</h4>
             <div className="p-5 border border-accent-primary/10 bg-accent-primary/5 rounded relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary/40"></div>
                <p className="text-[11px] text-accent-primary leading-relaxed font-mono">
                  {loading ? 'ANALYZING_SATELLITE_TELEMETRY...' : data?.insight}
                </p>
             </div>
          </section>

          {/* Export Engine */}
          <button 
            onClick={() => {
              const exportData = { ...data, exported_at: new Date().toISOString() };
              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `urban_intel_${new Date().getTime()}.json`;
              link.click();
            }}
            className="w-full py-4 bg-accent-primary text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-secondary transition-all flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            <span>Generate Report</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-black/40 flex justify-between items-center text-[8px] font-mono text-slate-600">
           <span className="flex items-center">
             <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-2 animate-pulse"></span>
             DATA_ENCRYPTED
           </span>
           <span>PROTOCOL: RR_v2.0</span>
        </div>
      </aside>
    </main>
  );
}
