'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface HeaderProps {
  onInfoClick: () => void;
}

export default function Header({ onInfoClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-[800] h-16 flex items-center justify-between px-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
      <div className="flex items-center space-x-4 pointer-events-auto">
        <div className="w-8 h-8 border border-accent-primary/40 flex items-center justify-center">
          <div className="w-4 h-4 bg-accent-primary animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-[10px] font-mono tracking-[0.4em] text-accent-primary uppercase opacity-60 leading-none">Intelligence Framework v2.0 // ANANTHU ANIL</h1>
          <h2 className="text-xl font-bold text-white tracking-tighter mt-1">Urban Growth <span className="text-accent-primary">Time Machine</span></h2>
        </div>
      </div>

      <button 
        id="info-trigger"
        onClick={onInfoClick}
        className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-black/20 hover:bg-white/10 hover:border-accent-primary transition-all group"
      >
        <Info className="w-5 h-5 text-slate-400 group-hover:text-accent-primary transition-colors" />
      </button>
    </header>
  );
}
