import React from 'react';
import { 
  KeyRound, 
  Cpu, 
  Activity, 
  FileWarning, 
  Dices, 
  Send, 
  RotateCcw, 
  Play, 
  Pause, 
  FastForward,
  Sparkles
} from 'lucide-react';
import { translations } from '../utils/translations';

interface ThreatSimulatorBarProps {
  lang: 'en' | 'hi';
  onSimulateFailedLogins: () => void;
  onSimulateUnknownDevice: () => void;
  onSimulateTrafficSpike: () => void;
  onSimulateRansomware: () => void;
  onSimulateRandomThreat: () => void;
  onInjectBenignTraffic: () => void;
  onResetBaseline: () => void;
  simulationSpeed: number;
  onSetSpeed: (speed: number) => void;
}

export const ThreatSimulatorBar: React.FC<ThreatSimulatorBarProps> = ({
  lang,
  onSimulateFailedLogins,
  onSimulateUnknownDevice,
  onSimulateTrafficSpike,
  onSimulateRansomware,
  onSimulateRandomThreat,
  onInjectBenignTraffic,
  onResetBaseline,
  simulationSpeed,
  onSetSpeed
}) => {
  const t = translations[lang];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>{t.simBarTitle}</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                Interactive Testing
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {t.simBarDesc}
            </p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center space-x-2 self-start lg:self-auto bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 px-2">
            {t.simSpeed}:
          </span>
          <button
            onClick={() => onSetSpeed(0)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors ${
              simulationSpeed === 0 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pause className="w-3 h-3" />
            <span>{t.simPaused}</span>
          </button>
          <button
            onClick={() => onSetSpeed(1)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors ${
              simulationSpeed === 1 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>{t.simNormal}</span>
          </button>
          <button
            onClick={() => onSetSpeed(3)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors ${
              simulationSpeed === 3 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FastForward className="w-3 h-3" />
            <span>{t.simFast}</span>
          </button>
        </div>
      </div>

      {/* Simulator Trigger Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {/* Failed Logins */}
        <button
          onClick={onSimulateFailedLogins}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/60 hover:bg-amber-950/40 border border-slate-700/70 hover:border-amber-500/60 text-slate-200 hover:text-amber-200 transition-all text-center group cursor-pointer"
        >
          <KeyRound className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold">{t.btnBruteForce}</span>
          <span className="text-[9px] text-slate-400 group-hover:text-amber-300/80">HMI Port 443</span>
        </button>

        {/* Rogue Device */}
        <button
          onClick={onSimulateUnknownDevice}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 border border-slate-700/70 hover:border-rose-500/60 text-slate-200 hover:text-rose-200 transition-all text-center group cursor-pointer"
        >
          <Cpu className="w-5 h-5 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold">{t.btnRogueDevice}</span>
          <span className="text-[9px] text-slate-400 group-hover:text-rose-300/80">Rogue Pi / ARP</span>
        </button>

        {/* Traffic Spike */}
        <button
          onClick={onSimulateTrafficSpike}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 border border-slate-700/70 hover:border-rose-500/60 text-slate-200 hover:text-rose-200 transition-all text-center group cursor-pointer"
        >
          <Activity className="w-5 h-5 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold">{t.btnTrafficSpike}</span>
          <span className="text-[9px] text-slate-400 group-hover:text-rose-300/80">Modbus Port 502</span>
        </button>

        {/* Ransomware */}
        <button
          onClick={onSimulateRansomware}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 border border-slate-700/70 hover:border-rose-500/60 text-slate-200 hover:text-rose-200 transition-all text-center group cursor-pointer"
        >
          <FileWarning className="w-5 h-5 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold">{t.btnRansomware}</span>
          <span className="text-[9px] text-slate-400 group-hover:text-rose-300/80">SCADA DB .locked</span>
        </button>

        {/* Random Threat */}
        <button
          onClick={onSimulateRandomThreat}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/60 hover:bg-purple-950/40 border border-slate-700/70 hover:border-purple-500/60 text-slate-200 hover:text-purple-200 transition-all text-center group cursor-pointer"
        >
          <Dices className="w-5 h-5 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold">{t.btnRandomThreat}</span>
          <span className="text-[9px] text-slate-400 group-hover:text-purple-300/80">Auto Select</span>
        </button>

        {/* Inject Benign Traffic */}
        <button
          onClick={onInjectBenignTraffic}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/60 hover:bg-emerald-950/40 border border-slate-700/70 hover:border-emerald-500/60 text-slate-200 hover:text-emerald-200 transition-all text-center group cursor-pointer"
        >
          <Send className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold">{t.btnBenignTraffic}</span>
          <span className="text-[9px] text-slate-400 group-hover:text-emerald-300/80">Modbus/OPC UA</span>
        </button>

        {/* Reset All Baseline */}
        <button
          onClick={onResetBaseline}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/70 hover:border-slate-500 text-slate-300 hover:text-white transition-all text-center group cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-rose-400 mb-1 group-hover:-rotate-90 transition-transform" />
          <span className="text-[11px] font-bold">{t.btnResetAll}</span>
          <span className="text-[9px] text-slate-400">Clear Alarms</span>
        </button>
      </div>
    </div>
  );
};
