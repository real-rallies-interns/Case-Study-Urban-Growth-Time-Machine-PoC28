'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface HeaderProps {
  onInfoClick: () => void;
}

export default function Header({ onInfoClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-[800] h-16 flex items-center justify-between px-8 bg-gradient-to-b from-background/80 to-transparent pointer-events-none">
      <div className="flex items-center space-x-4 pointer-events-auto">
        <div className="w-8 h-8 border border-accent-primary/40 flex items-center justify-center">
          <div className="w-4 h-4 bg-accent-primary animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
        </div>
        <div>
          <h1 className="text-[10px] font-mono tracking-[0.4em] text-accent-primary uppercase opacity-60 leading-none">Intelligence Framework v2.0 // ANANTHU ANIL</h1>
          <h2 className="text-xl font-bold text-white tracking-tighter mt-1 italic">Real <span className="text-accent-primary">Rails</span></h2>
        </div>
      </div>

      <button 
        id="info-trigger"
        onClick={onInfoClick}
        className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full border border-border bg-surface/20 hover:bg-surface/40 hover:border-accent-primary transition-all group"
      >
        <Info className="w-5 h-5 text-slate-400 group-hover:text-accent-primary transition-colors" />
      </button>
    </header>
  );
}
