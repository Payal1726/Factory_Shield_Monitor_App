import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  ShieldBan, 
  RefreshCw, 
  CheckCircle2, 
  Search,
  ExternalLink
} from 'lucide-react';
import { ThreatAlert } from '../types';
import { translations } from '../utils/translations';

interface ActiveThreatsAlertsProps {
  alerts: ThreatAlert[];
  lang: 'en' | 'hi';
  onInvestigate: (alert: ThreatAlert) => void;
  onIsolateDevice: (deviceId: string) => void;
  onBlockIp: (ipAddress: string) => void;
  onResetCredentials: (deviceId: string) => void;
  onRestoreBackup: (deviceId: string) => void;
  onMarkFalsePositive: (alertId: string) => void;
}

export const ActiveThreatsAlerts: React.FC<ActiveThreatsAlertsProps> = ({
  alerts,
  lang,
  onInvestigate,
  onIsolateDevice,
  onBlockIp,
  onResetCredentials,
  onRestoreBackup,
  onMarkFalsePositive
}) => {
  const t = translations[lang];

  if (alerts.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-100 mb-1">
          {t.normalStatus}
        </h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          {t.noActiveThreats}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
          <span>{t.activeAlertsTitle}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold">
            {alerts.length}
          </span>
        </h3>
        <span className="text-xs text-rose-400 font-medium animate-pulse hidden sm:inline">
          Action Required to Secure Factory
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const titleText = lang === 'hi' ? alert.titleHi : alert.title;
          const explanationText = lang === 'hi' ? alert.simpleExplanationHi : alert.simpleExplanation;
          const riskText = lang === 'hi' ? alert.riskAssessmentHi : alert.riskAssessment;
          const recText = lang === 'hi' ? alert.recommendedActionHi : alert.recommendedAction;

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-5 shadow-xl transition-all ${
                isCritical
                  ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-600/60 radar-glow-red'
                  : 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-600/50 radar-glow-amber'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-1.5 rounded-lg ${
                    isCritical 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {isCritical ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      {titleText}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono text-cyan-400 font-semibold">{alert.deviceName}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">{alert.targetIp}:{alert.port}</span>
                      <span>•</span>
                      <span className="text-slate-400 font-mono text-[11px]">{alert.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    isCritical 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  }`}>
                    {isCritical ? t.severityCritical : t.severityHigh}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {alert.mitreAttackId}
                  </span>
                </div>
              </div>

              {/* Explanations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
                {/* What Happened */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    {t.whatHappened}
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {explanationText}
                  </p>
                </div>

                {/* Factory Risk */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                  <span className="text-amber-400/90 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    {t.riskToFactory}
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {riskText}
                  </p>
                </div>

                {/* Recommended Response */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                  <span className="text-cyan-400/90 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    {t.recommendedAction}
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {recText}
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Primary context-sensitive mitigation button */}
                  {alert.type === 'UNKNOWN_DEVICE' && (
                    <button
                      onClick={() => onIsolateDevice(alert.deviceId)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t.btnIsolate}</span>
                    </button>
                  )}

                  {alert.type === 'TRAFFIC_SPIKE' && (
                    <button
                      onClick={() => onBlockIp(alert.sourceIp)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <ShieldBan className="w-3.5 h-3.5" />
                      <span>{t.btnBlockIp}</span>
                    </button>
                  )}

                  {alert.type === 'FAILED_LOGINS' && (
                    <button
                      onClick={() => onResetCredentials(alert.deviceId)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t.btnResetCreds}</span>
                    </button>
                  )}

                  {alert.type === 'RANSOMWARE' && (
                    <button
                      onClick={() => onRestoreBackup(alert.deviceId)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t.btnRestoreBackup}</span>
                    </button>
                  )}

                  {/* General Secondary Actions */}
                  <button
                    onClick={() => onIsolateDevice(alert.deviceId)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>{t.btnIsolate}</span>
                  </button>

                  <button
                    onClick={() => onBlockIp(alert.sourceIp)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <ShieldBan className="w-3 h-3 text-rose-400" />
                    <span>{t.btnBlockIp}</span>
                  </button>

                  <button
                    onClick={() => onMarkFalsePositive(alert.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {t.btnDismiss}
                  </button>
                </div>

                {/* Open full investigation room */}
                <button
                  onClick={() => onInvestigate(alert)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.btnInvestigate}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
