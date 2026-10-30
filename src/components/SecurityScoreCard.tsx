import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Server, 
  Lock, 
  Activity, 
  Filter
} from 'lucide-react';
import { translations } from '../utils/translations';

interface SecurityScoreCardProps {
  score: number;
  activeThreatsCount: number;
  criticalCount: number;
  warningCount: number;
  monitoredDevicesCount: number;
  quarantinedCount: number;
  totalPacketsPerSec: number;
  firewallRulesCount: number;
  lang: 'en' | 'hi';
}

export const SecurityScoreCard: React.FC<SecurityScoreCardProps> = ({
  score,
  activeThreatsCount,
  criticalCount,
  warningCount,
  monitoredDevicesCount,
  quarantinedCount,
  totalPacketsPerSec,
  firewallRulesCount,
  lang
}) => {
  const t = translations[lang];

  // Determine status color and text based on score and active threats
  let statusColor = 'text-emerald-400';
  let badgeBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
  let statusText = t.normalStatus;
  let progressColor = 'bg-emerald-500';

  if (criticalCount > 0 || score < 60) {
    statusColor = 'text-rose-400';
    badgeBg = 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse';
    statusText = t.criticalStatus;
    progressColor = 'bg-rose-500';
  } else if (warningCount > 0 || score < 85) {
    statusColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/20 border-amber-500/40 text-amber-300';
    statusText = t.warningStatus;
    progressColor = 'bg-amber-500';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Primary Security Score Gauge */}
      <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.overallSecurityScore}
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono ${statusColor}`}>
                {score}
              </span>
              <span className="text-slate-500 text-sm font-semibold">/ 100</span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center space-x-1.5 ${badgeBg}`}>
            {criticalCount > 0 ? (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            ) : warningCount > 0 ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
            <span>{statusText}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Indicators breakdown */}
        <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>{t.statusNormal}: {monitoredDevicesCount - criticalCount - warningCount}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>{t.statusWarning}: {warningCount}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>{t.statusCritical}: {criticalCount}</span>
          </span>
        </div>
      </div>

      {/* 4 Key OT Operational KPI tiles */}
      <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Active Threats */}
        <div className={`p-4 rounded-xl border transition-all ${
          activeThreatsCount > 0
            ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
            : 'bg-slate-900/80 border-slate-800 text-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.activeThreats}</span>
            <ShieldAlert className={`w-4 h-4 ${activeThreatsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="text-2xl font-bold font-mono">
            {activeThreatsCount}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {activeThreatsCount > 0 ? 'Requires Response' : 'Zero Active Alarms'}
          </span>
        </div>

        {/* Monitored Devices */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.monitoredDevices}</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono">
            {monitoredDevicesCount}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            PLCs, SCADA & IIoT
          </span>
        </div>

        {/* Quarantined Devices */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.quarantinedDevices}</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl font-bold font-mono ${quarantinedCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
            {quarantinedCount}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {quarantinedCount > 0 ? 'Network Blocked' : 'All Online'}
          </span>
        </div>

        {/* Packet Rate */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.packetsPerSec}</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {totalPacketsPerSec} <span className="text-xs font-sans text-slate-400">/s</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Live Modbus/CIP
          </span>
        </div>
      </div>
    </div>
  );
};
