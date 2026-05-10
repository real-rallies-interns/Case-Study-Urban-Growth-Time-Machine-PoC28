'use client';

import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-[#040705] border border-accent-primary/20 p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="pb-4 border-b border-white/5">
            <h3 className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.3em] mb-2">Architect Signature</h3>
            <p id="developer-name" className="text-2xl font-bold text-white">Ananthu Anil</p>
            <p className="text-xs text-slate-400 mt-1">Batch 2 Interns — Real Rails Protocol</p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Full Stack Configuration</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Next.js 16', 'FastAPI', 'Tailwind CSS 4', 'Leaflet', 'Deck.gl', 'TypeScript'].map(tech => (
                  <div key={tech} className="bg-white/5 border border-white/5 px-3 py-1.5 rounded text-[10px] font-mono text-slate-300">
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-accent-primary/5 border border-accent-primary/10 rounded">
              <p className="text-[10px] font-mono text-accent-primary leading-relaxed">
                SYSTEM_ACCESS: GRANTED<br/>
                RAIL_TYPE: URBAN_GROWTH_SPATIOTEMPORAL<br/>
                SECURITY_LEVEL: LEVEL_2_CINEMATIC
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[8px] font-mono text-slate-700 pt-4 border-t border-white/5">
            <span>TIMESTAMP: {new Date().toISOString()}</span>
            <span>v2.0.4_BETA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
