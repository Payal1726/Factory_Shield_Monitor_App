import React from 'react';
import { 
  X, 
  Cpu, 
  Server, 
  Monitor, 
  Radio, 
  Layers, 
  Lock, 
  Unlock, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert,
  MapPin,
  Clock,
  HardDrive
} from 'lucide-react';
import { IndustrialDevice, DeviceType } from '../types';
import { translations } from '../utils/translations';

interface DeviceDetailModalProps {
  device: IndustrialDevice | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'hi';
  onIsolateDevice: (deviceId: string) => void;
  onUnquarantineDevice: (deviceId: string) => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  device,
  isOpen,
  onClose,
  lang,
  onIsolateDevice,
  onUnquarantineDevice
}) => {
  if (!isOpen || !device) return null;
  const t = translations[lang];

  const isQuarantined = device.networkStatus === 'quarantined';
  const isCritical = device.securityStatus === 'critical';
  const isWarning = device.securityStatus === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                  {device.type} HARDWARE
                </span>
                <span className="text-xs font-mono text-cyan-400">{device.ip}</span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                {device.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Security & Network Status Pill Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-semibold block">Security Health Status</span>
              <span className="font-bold text-sm flex items-center space-x-1.5 mt-0.5">
                {isCritical ? (
                  <span className="text-rose-400 flex items-center space-x-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{t.statusCritical}</span>
                  </span>
                ) : isWarning ? (
                  <span className="text-amber-400 flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t.statusWarning}</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.statusNormal}</span>
                  </span>
                )}
              </span>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-semibold block">Network Connection</span>
              <span className="font-mono text-sm font-bold block mt-0.5">
                {isQuarantined ? (
                  <span className="text-amber-400">QUARANTINED (ISOLATED)</span>
                ) : (
                  <span className="text-emerald-400">ONLINE (TRANSMITTING)</span>
                )}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Functional Description</span>
            <p className="text-slate-200 leading-relaxed text-xs">
              {device.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block font-semibold">Vendor & Model</span>
              <span className="text-slate-200 font-medium">{device.vendor}</span>
              <span className="text-slate-400 text-[11px] block">{device.model}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block font-semibold">MAC Address</span>
              <span className="font-mono text-slate-200 text-[11px] block mt-0.5">{device.mac}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block font-semibold">Firmware OS</span>
              <span className="font-mono text-indigo-300 text-[11px] block mt-0.5">{device.firmware}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block font-semibold">Primary OT Protocol</span>
              <span className="font-mono text-cyan-300 font-bold block mt-0.5">{device.protocol} (Port {device.port})</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block font-semibold">Purdue Architecture</span>
              <span className="text-slate-200 text-[11px] block mt-0.5">{device.zone}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block font-semibold">Physical Location</span>
              <span className="text-slate-200 text-[11px] block mt-0.5 truncate">{device.location}</span>
            </div>
          </div>

          {/* Telemetry Load Bars */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>CPU / ASIC Utilization:</span>
                <span className="font-mono font-bold text-slate-200">{device.cpuUsage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${device.cpuUsage > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                  style={{ width: `${device.cpuUsage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Packet Transmission Rate:</span>
                <span className="font-mono font-bold text-cyan-400">{device.packetRate} pkts/s</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500"
                  style={{ width: `${Math.min(100, (device.packetRate / 200) * 100)}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer with Quarantine Action */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Node ID: {device.id}
          </span>
          <div className="flex items-center space-x-2">
            {isQuarantined ? (
              <button
                onClick={() => {
                  onUnquarantineDevice(device.id);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Restore to Network</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onIsolateDevice(device.id);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Isolate Controller</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
