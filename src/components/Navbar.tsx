import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Languages, 
  Sliders, 
  RotateCcw,
  Radio,
  Server
} from 'lucide-react';
import { FactoryProfile, ActiveTab } from '../types';
import { translations } from '../utils/translations';
import { soundAndVoice } from '../utils/soundAndVoice';

interface NavbarProps {
  profile: FactoryProfile;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeThreatsCount: number;
  securityScore: number;
  onOpenWizard: () => void;
  onResetBaseline: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  lang,
  onToggleLang,
  activeTab,
  onTabChange,
  activeThreatsCount,
  securityScore,
  onOpenWizard,
  onResetBaseline,
  voiceEnabled,
  onToggleVoice
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Factory Identity */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg border ${
              activeThreatsCount > 0 
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-400 radar-glow-red animate-pulse' 
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
            }`}>
              {activeThreatsCount > 0 ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  {t.appTitle}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-800/80 border border-slate-700 text-slate-400">
                  OT-DEFENSE v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center space-x-1.5 truncate max-w-xs sm:max-w-md">
                <span className="text-slate-200 font-semibold">{profile.name}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-mono text-[11px]">{profile.otSubnet}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 font-medium text-sm">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {t.navDashboard}
            </button>
            <button
              onClick={() => onTabChange('devices')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'devices'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>{t.navDevices}</span>
            </button>
            <button
              onClick={() => onTabChange('investigation')}
              className={`px-3 py-1.5 rounded-md transition-all relative flex items-center space-x-1.5 ${
                activeTab === 'investigation'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{t.navInvestigation}</span>
              {activeThreatsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-bounce">
                  {activeThreatsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('incidents')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'incidents'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {t.navIncidents}
            </button>
            <button
              onClick={() => onTabChange('traffic')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'traffic'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{t.navTraffic}</span>
            </button>
          </nav>

          {/* Quick Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Voice Alert Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={onToggleVoice}
                title={voiceEnabled ? t.voiceAlertsOn : t.voiceAlertsOff}
                className={`p-1.5 rounded transition-colors ${
                  voiceEnabled 
                    ? 'text-cyan-400 hover:bg-slate-800 bg-cyan-950/60' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              {voiceEnabled && (
                <button
                  onClick={() => soundAndVoice.testVoice()}
                  className="px-2 py-0.5 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 border-l border-slate-800 hover:bg-slate-800/50 rounded-r"
                >
                  {t.testVoiceBtn}
                </button>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold"
              title="Toggle English / Hindi"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Setup Wizard */}
            <button
              onClick={onOpenWizard}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 text-xs font-medium"
              title="Factory Setup Wizard"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{t.navWizard}</span>
            </button>

            {/* Reset Baseline */}
            <button
              onClick={onResetBaseline}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
              title={t.btnResetAll}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60 text-xs font-medium">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-2 py-1 rounded ${activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            {t.navDashboard}
          </button>
          <button
            onClick={() => onTabChange('devices')}
            className={`px-2 py-1 rounded ${activeTab === 'devices' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            {t.navDevices}
          </button>
          <button
            onClick={() => onTabChange('investigation')}
            className={`px-2 py-1 rounded relative ${activeTab === 'investigation' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            <span>{t.navInvestigation}</span>
            {activeThreatsCount > 0 && (
              <span className="ml-1 px-1 py-0.2 text-[9px] rounded-full bg-rose-500 text-white font-bold">
                {activeThreatsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('incidents')}
            className={`px-2 py-1 rounded ${activeTab === 'incidents' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            {t.navIncidents}
          </button>
          <button
            onClick={() => onTabChange('traffic')}
            className={`px-2 py-1 rounded ${activeTab === 'traffic' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            {t.navTraffic}
          </button>
        </div>

      </div>
    </header>
  );
};
