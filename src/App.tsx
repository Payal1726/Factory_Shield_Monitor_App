/**
 * FactoryShield Monitor App
 * Industrial Cybersecurity Monitoring Prototype for Small & Medium Factories
 */

import React, { useState, useEffect } from 'react';
import { 
  simulationStore 
} from './services/simulationState';
import { 
  IndustrialDevice, 
  ThreatAlert, 
  NetworkPacket, 
  IncidentHistoryItem, 
  FactoryProfile, 
  ActiveTab 
} from './types';
import { translations } from './utils/translations';
import { soundAndVoice } from './utils/soundAndVoice';

// Components
import { Navbar } from './components/Navbar';
import { SimulationBanner } from './components/SimulationBanner';
import { ThreatSimulatorBar } from './components/ThreatSimulatorBar';
import { SecurityScoreCard } from './components/SecurityScoreCard';
import { ActiveThreatsAlerts } from './components/ActiveThreatsAlerts';
import { DeviceFloorGrid } from './components/DeviceFloorGrid';
import { ThreatInvestigationModal } from './components/ThreatInvestigationModal';
import { IncidentHistoryView } from './components/IncidentHistoryView';
import { LivePacketStream } from './components/LivePacketStream';
import { FactorySetupWizard } from './components/FactorySetupWizard';
import { DeviceDetailModal } from './components/DeviceDetailModal';

export default function App() {
  // Application State
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Store Subscribed State
  const [devices, setDevices] = useState<IndustrialDevice[]>(simulationStore.getDevices());
  const [alerts, setAlerts] = useState<ThreatAlert[]>(simulationStore.getAlerts());
  const [activeAlerts, setActiveAlerts] = useState<ThreatAlert[]>(simulationStore.getActiveAlerts());
  const [incidentHistory, setIncidentHistory] = useState<IncidentHistoryItem[]>(simulationStore.getIncidentHistory());
  const [packets, setPackets] = useState<NetworkPacket[]>(simulationStore.getPackets());
  const [factoryProfile, setFactoryProfile] = useState<FactoryProfile>(simulationStore.getFactoryProfile());
  const [securityScore, setSecurityScore] = useState<number>(simulationStore.getSecurityScore());
  const [simulationSpeed, setSimulationSpeed] = useState<number>(simulationStore.getSimulationSpeed());
  const [totalPackets, setTotalPackets] = useState<number>(simulationStore.getTotalPacketsProcessed());

  // Modal States
  const [investigatingAlert, setInvestigatingAlert] = useState<ThreatAlert | null>(null);
  const [inspectingDevice, setInspectingDevice] = useState<IndustrialDevice | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = simulationStore.subscribe(() => {
      setDevices([...simulationStore.getDevices()]);
      setAlerts([...simulationStore.getAlerts()]);
      setActiveAlerts([...simulationStore.getActiveAlerts()]);
      setIncidentHistory([...simulationStore.getIncidentHistory()]);
      setPackets([...simulationStore.getPackets()]);
      setFactoryProfile({ ...simulationStore.getFactoryProfile() });
      setSecurityScore(simulationStore.getSecurityScore());
      setSimulationSpeed(simulationStore.getSimulationSpeed());
      setTotalPackets(simulationStore.getTotalPacketsProcessed());
    });
    return unsubscribe;
  }, []);

  // Sync language with sound & voice
  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    soundAndVoice.setLanguage(nextLang);
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    soundAndVoice.setVoiceEnabled(next);
  };

  // Metrics calculation
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = activeAlerts.filter(a => a.severity === 'high' || a.severity === 'medium').length;
  const quarantinedCount = devices.filter(d => d.networkStatus === 'quarantined').length;
  const totalPacketsPerSec = devices.reduce((sum, d) => sum + (d.networkStatus === 'online' ? d.packetRate : 0), 0);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans bg-grid-pattern selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        profile={factoryProfile}
        lang={lang}
        onToggleLang={handleToggleLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeThreatsCount={activeAlerts.length}
        securityScore={securityScore}
        onOpenWizard={() => setIsWizardOpen(true)}
        onResetBaseline={() => simulationStore.resetAllBaseline()}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
      />

      {/* Prominent Simulated Environment Banner */}
      <SimulationBanner lang={lang} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Always Accessible Threat Simulator Demonstration Bar */}
        <ThreatSimulatorBar
          lang={lang}
          onSimulateFailedLogins={() => simulationStore.triggerFailedLogins()}
          onSimulateUnknownDevice={() => simulationStore.triggerUnknownDevice()}
          onSimulateTrafficSpike={() => simulationStore.triggerTrafficSpike()}
          onSimulateRansomware={() => simulationStore.triggerRansomware()}
          onSimulateRandomThreat={() => simulationStore.triggerRandomThreat()}
          onInjectBenignTraffic={() => simulationStore.setSimulationSpeed(simulationSpeed === 0 ? 1 : simulationSpeed)}
          onResetBaseline={() => simulationStore.resetAllBaseline()}
          simulationSpeed={simulationSpeed}
          onSetSpeed={(speed) => simulationStore.setSimulationSpeed(speed)}
        />

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* OT Cyber Health Score & Key Operational Metrics */}
            <SecurityScoreCard
              score={securityScore}
              activeThreatsCount={activeAlerts.length}
              criticalCount={criticalCount}
              warningCount={warningCount}
              monitoredDevicesCount={devices.length}
              quarantinedCount={quarantinedCount}
              totalPacketsPerSec={totalPacketsPerSec}
              firewallRulesCount={simulationStore.getFirewallBlocklist().length}
              lang={lang}
            />

            {/* Active Cyber Threat Alerts (Requires Action) */}
            <ActiveThreatsAlerts
              alerts={activeAlerts}
              lang={lang}
              onInvestigate={(alert) => setInvestigatingAlert(alert)}
              onIsolateDevice={(deviceId) => simulationStore.isolateDevice(deviceId)}
              onBlockIp={(ip) => simulationStore.blockIpAddress(ip)}
              onResetCredentials={(deviceId) => simulationStore.resetCredentials(deviceId)}
              onRestoreBackup={(deviceId) => simulationStore.restoreSafeBackup(deviceId)}
              onMarkFalsePositive={(alertId) => simulationStore.markFalsePositive(alertId)}
            />

            {/* Shop-Floor Device Status Grid */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                  <span>{t.navDevices}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({devices.length} Controllers & Edge Nodes)
                  </span>
                </h3>
                <button
                  onClick={() => setActiveTab('devices')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                >
                  View All Equipment →
                </button>
              </div>
              <DeviceFloorGrid
                devices={devices.slice(0, 6)}
                lang={lang}
                onInspectDevice={(dev) => setInspectingDevice(dev)}
                onIsolateDevice={(id) => simulationStore.isolateDevice(id)}
                onUnquarantineDevice={(id) => simulationStore.unquarantineDevice(id)}
              />
            </div>

            {/* Live Industrial Packet Stream (Sniffer Preview) */}
            <div className="pt-2">
              <LivePacketStream
                packets={packets.slice(0, 30)}
                lang={lang}
                isPaused={simulationSpeed === 0}
                onTogglePause={() => simulationStore.setSimulationSpeed(simulationSpeed === 0 ? 1 : 0)}
                totalPackets={totalPackets}
              />
            </div>
          </div>
        )}

        {/* TAB 2: EQUIPMENT INVENTORY */}
        {activeTab === 'devices' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  {t.navDevices}
                </h2>
                <p className="text-xs text-slate-400">
                  Connected PLCs, SCADA Servers, HMIs, and IIoT gateways partitioned across Purdue model zones.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                  Subnet: {factoryProfile.otSubnet}
                </span>
              </div>
            </div>

            <DeviceFloorGrid
              devices={devices}
              lang={lang}
              onInspectDevice={(dev) => setInspectingDevice(dev)}
              onIsolateDevice={(id) => simulationStore.isolateDevice(id)}
              onUnquarantineDevice={(id) => simulationStore.unquarantineDevice(id)}
            />
          </div>
        )}

        {/* TAB 3: THREAT INVESTIGATION & RESPONSE CENTER */}
        {activeTab === 'investigation' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  {t.investigationTitle}
                </h2>
                <p className="text-xs text-slate-400">
                  Deep forensics, MITRE ATT&CK for ICS mapping, and standard operating remediation workflows.
                </p>
              </div>
            </div>

            {activeAlerts.length > 0 ? (
              <ActiveThreatsAlerts
                alerts={activeAlerts}
                lang={lang}
                onInvestigate={(alert) => setInvestigatingAlert(alert)}
                onIsolateDevice={(deviceId) => simulationStore.isolateDevice(deviceId)}
                onBlockIp={(ip) => simulationStore.blockIpAddress(ip)}
                onResetCredentials={(deviceId) => simulationStore.resetCredentials(deviceId)}
                onRestoreBackup={(deviceId) => simulationStore.restoreSafeBackup(deviceId)}
                onMarkFalsePositive={(alertId) => simulationStore.markFalsePositive(alertId)}
              />
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  All Industrial Controllers Operating Within Safe Limits
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No active security breaches or abnormal telemetry detected. Use the Threat Simulator panel above to test incident response workflows.
                </p>
              </div>
            )}

            {/* Also show recent incident playbook logs */}
            <IncidentHistoryView
              history={incidentHistory}
              lang={lang}
            />
          </div>
        )}

        {/* TAB 4: INCIDENT HISTORY */}
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            <IncidentHistoryView
              history={incidentHistory}
              lang={lang}
            />
          </div>
        )}

        {/* TAB 5: LIVE NETWORK SNIFFER */}
        {activeTab === 'traffic' && (
          <div className="space-y-4">
            <LivePacketStream
              packets={packets}
              lang={lang}
              isPaused={simulationSpeed === 0}
              onTogglePause={() => simulationStore.setSimulationSpeed(simulationSpeed === 0 ? 1 : 0)}
              totalPackets={totalPackets}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            FactoryShield Monitor App • Operational Technology (OT) Cyber Defense Prototype
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Certified for IEC 62443 / NIST CSF Industrial Guidelines • Simulated Safe Testbed
          </span>
        </div>
      </footer>

      {/* Threat Investigation Modal */}
      <ThreatInvestigationModal
        alert={investigatingAlert}
        isOpen={investigatingAlert !== null}
        onClose={() => setInvestigatingAlert(null)}
        lang={lang}
        onIsolateDevice={(id) => simulationStore.isolateDevice(id)}
        onBlockIp={(ip) => simulationStore.blockIpAddress(ip)}
        onResetCredentials={(id) => simulationStore.resetCredentials(id)}
        onRestoreBackup={(id) => simulationStore.restoreSafeBackup(id)}
        onMarkFalsePositive={(id) => simulationStore.markFalsePositive(id)}
      />

      {/* Device Hardware Inspector Modal */}
      <DeviceDetailModal
        device={inspectingDevice}
        isOpen={inspectingDevice !== null}
        onClose={() => setInspectingDevice(null)}
        lang={lang}
        onIsolateDevice={(id) => simulationStore.isolateDevice(id)}
        onUnquarantineDevice={(id) => simulationStore.unquarantineDevice(id)}
      />

      {/* Factory Setup Wizard Modal */}
      <FactorySetupWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        currentProfile={factoryProfile}
        lang={lang}
        onSaveProfile={(profile) => simulationStore.updateFactoryProfile(profile)}
      />

    </div>
  );
}
