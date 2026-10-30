import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Lock, 
  ShieldBan, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  Terminal, 
  FileText, 
  Flame, 
  Activity,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ThreatAlert } from '../types';
import { translations } from '../utils/translations';

interface ThreatInvestigationModalProps {
  alert: ThreatAlert | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'hi';
  onIsolateDevice: (deviceId: string) => void;
  onBlockIp: (ipAddress: string) => void;
  onResetCredentials: (deviceId: string) => void;
  onRestoreBackup: (deviceId: string) => void;
  onMarkFalsePositive: (alertId: string) => void;
}

export const ThreatInvestigationModal: React.FC<ThreatInvestigationModalProps> = ({
  alert,
  isOpen,
  onClose,
  lang,
  onIsolateDevice,
  onBlockIp,
  onResetCredentials,
  onRestoreBackup,
  onMarkFalsePositive
}) => {
  if (!isOpen || !alert) return null;
  const t = translations[lang];

  const titleText = lang === 'hi' ? alert.titleHi : alert.title;
  const explanationText = lang === 'hi' ? alert.simpleExplanationHi : alert.simpleExplanation;
  const riskText = lang === 'hi' ? alert.riskAssessmentHi : alert.riskAssessment;
  const recText = lang === 'hi' ? alert.recommendedActionHi : alert.recommendedAction;
  const isCritical = alert.severity === 'critical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isCritical 
            ? 'bg-rose-950/40 border-rose-800/60 text-rose-200' 
            : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {isCritical ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                  INCIDENT ID: {alert.id}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {alert.timestamp}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                {titleText}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Metrics & Severity Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Affected Asset</span>
              <span className="text-slate-200 font-bold text-sm block mt-0.5 truncate">{alert.deviceName}</span>
              <span className="font-mono text-cyan-400 text-[11px]">{alert.targetIp}:{alert.port}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Threat Source</span>
              <span className="text-rose-400 font-bold text-sm font-mono block mt-0.5">{alert.sourceIp}</span>
              <span className="text-slate-400 text-[11px]">{alert.protocol}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">{t.blastRadius}</span>
              <span className={`text-sm font-bold block mt-0.5 ${
                alert.blastRadius === 'Catastrophic' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {alert.blastRadius} Impact
              </span>
              <span className="text-slate-400 text-[11px]">Purdue Level 0-2</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">{t.mitreAttack}</span>
              <span className="text-indigo-400 font-bold text-sm font-mono block mt-0.5">{alert.mitreAttackId}</span>
              <span className="text-slate-300 text-[11px] truncate block">{alert.mitreAttackName}</span>
            </div>
          </div>

          {/* Plain English/Hindi SME Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center space-x-1.5">
                <FileText className="w-4 h-4" />
                <span>{t.whatHappened}</span>
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {explanationText}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Technical Diagnostic: </span>
                <span>{alert.description}</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center space-x-1.5">
                <Flame className="w-4 h-4" />
                <span>{t.riskToFactory}</span>
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {riskText}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-amber-300/90 font-medium">
                <span>Recommended Operator Action: </span>
                <span className="text-slate-200">{recText}</span>
              </div>
            </div>
          </div>

          {/* Packet Forensics & Technical Evidence Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center space-x-1.5">
              <Terminal className="w-4 h-4" />
              <span>{t.technicalEvidence}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {alert.evidenceData.map((ev, i) => (
                <div key={i} className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 font-medium">{ev.label}:</span>
                  <span className="text-slate-200 font-mono font-semibold">{ev.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Step Standard Response Playbook with Real Triggers */}
          <div className="border border-cyan-800/40 bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-950 rounded-xl p-5 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                {t.remediationPlaybook}
              </h3>
              <span className="text-[11px] text-cyan-300 bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-700/50">
                1-Click Execution
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Step 1: Containment */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                    {t.playbookStep1}
                  </span>
                  <p className="text-xs text-slate-400 mb-3">
                    Instantly quarantine affected controller to halt lateral propagation.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onIsolateDevice(alert.deviceId);
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.btnIsolate}</span>
                </button>
              </div>

              {/* Step 2: Source Elimination */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                    {t.playbookStep2}
                  </span>
                  <p className="text-xs text-slate-400 mb-3">
                    Add {alert.sourceIp} to Moxa industrial firewall permanent drop list.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onBlockIp(alert.sourceIp);
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ShieldBan className="w-3.5 h-3.5" />
                  <span>{t.btnBlockIp}</span>
                </button>
              </div>

              {/* Step 3: Integrity Restoration */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                    {t.playbookStep3}
                  </span>
                  <p className="text-xs text-slate-400 mb-3">
                    Reset credentials or restore clean verified golden image snapshot.
                  </p>
                </div>
                {alert.type === 'FAILED_LOGINS' ? (
                  <button
                    onClick={() => {
                      onResetCredentials(alert.deviceId);
                      onClose();
                    }}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.btnResetCreds}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onRestoreBackup(alert.deviceId);
                      onClose();
                    }}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.btnRestoreBackup}</span>
                  </button>
                )}
              </div>

              {/* Step 4: Verification & Dismissal */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                    {t.playbookStep4}
                  </span>
                  <p className="text-xs text-slate-400 mb-3">
                    Mark as authorized maintenance or log incident resolution report.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onMarkFalsePositive(alert.id);
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.btnDismiss}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            FactoryShield Incident Response Engine • Certified IEC 62443 Playbook
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close Room
          </button>
        </div>

      </div>
    </div>
  );
};
