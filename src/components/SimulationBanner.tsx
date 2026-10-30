import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { translations } from '../utils/translations';

interface SimulationBannerProps {
  lang: 'en' | 'hi';
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border-b border-cyan-800/40 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-cyan-300 font-medium">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-wide uppercase text-[11px] bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded border border-cyan-500/30">
            {t.simulationBadge}
          </span>
          <span className="text-slate-300 hidden md:inline">
            {t.safeModeNotice}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Green: Secure</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>Amber: Suspicious</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
            <span>Red: Critical Threat</span>
          </span>
        </div>
      </div>
    </div>
  );
};
