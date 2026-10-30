import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Monitor, 
  Radio, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Search, 
  Activity,
  Layers,
  MapPin,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { IndustrialDevice, DeviceType } from '../types';
import { translations } from '../utils/translations';

interface DeviceFloorGridProps {
  devices: IndustrialDevice[];
  lang: 'en' | 'hi';
  onInspectDevice: (device: IndustrialDevice) => void;
  onIsolateDevice: (deviceId: string) => void;
  onUnquarantineDevice: (deviceId: string) => void;
}

export const DeviceFloorGrid: React.FC<DeviceFloorGridProps> = ({
  devices,
  lang,
  onInspectDevice,
  onIsolateDevice,
  onUnquarantineDevice
}) => {
  const t = translations[lang];
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDevices = devices.filter(device => {
    const matchesType = selectedType === 'ALL' || device.type === selectedType;
    const matchesSearch = 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ip.includes(searchQuery) ||
      device.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.protocol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'PLC':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'SCADA':
        return <Server className="w-4 h-4 text-indigo-400" />;
      case 'HMI':
        return <Monitor className="w-4 h-4 text-emerald-400" />;
      case 'IIoT':
        return <Radio className="w-4 h-4 text-amber-400" />;
      case 'GATEWAY':
        return <Layers className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.filterAll} ({devices.length})
          </button>
          <button
            onClick={() => setSelectedType('PLC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'PLC'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.filterPLC}
          </button>
          <button
            onClick={() => setSelectedType('SCADA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'SCADA'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.filterSCADA}
          </button>
          <button
            onClick={() => setSelectedType('HMI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'HMI'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.filterHMI}
          </button>
          <button
            onClick={() => setSelectedType('IIoT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'IIoT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.filterIIoT}
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search IP, vendor, protocol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Industrial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map(device => {
          const isQuarantined = device.networkStatus === 'quarantined';
          const isCritical = device.securityStatus === 'critical';
          const isWarning = device.securityStatus === 'warning';

          // Visual status indicator styling
          let borderGlow = 'border-slate-800 hover:border-slate-700 bg-slate-900/70';
          let indicatorBadge = (
            <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{t.statusNormal}</span>
            </span>
          );

          if (isQuarantined) {
            borderGlow = 'border-amber-700/60 bg-amber-950/20';
            indicatorBadge = (
              <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/60 px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5 text-amber-400" />
                <span>Quarantined</span>
              </span>
            );
          } else if (isCritical) {
            borderGlow = 'border-rose-500/70 bg-rose-950/20 radar-glow-red animate-pulse';
            indicatorBadge = (
              <span className="flex items-center space-x-1 text-[10px] font-bold text-rose-300 bg-rose-950/80 border border-rose-500 px-2 py-0.5 rounded-full animate-bounce">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>{t.statusCritical}</span>
              </span>
            );
          } else if (isWarning) {
            borderGlow = 'border-amber-500/60 bg-amber-950/20 radar-glow-amber';
            indicatorBadge = (
              <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/60 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{t.statusWarning}</span>
              </span>
            );
          }

          return (
            <div
              key={device.id}
              className={`rounded-xl border p-4 shadow-lg transition-all flex flex-col justify-between ${borderGlow}`}
            >
              <div>
                {/* Header: Type icon, name, status pill */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700/80">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 leading-tight">
                        {device.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {device.vendor} • {device.model}
                      </span>
                    </div>
                  </div>
                  <div>
                    {indicatorBadge}
                  </div>
                </div>

                {/* Technical Parameters */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-slate-800/80 my-2.5">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">IP Address</span>
                    <span className="font-mono text-cyan-300 font-medium">{device.ip}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Protocol / Port</span>
                    <span className="font-mono text-indigo-300 font-medium">{device.protocol} : {device.port}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Purdue Zone</span>
                    <span className="text-slate-300 text-[11px] truncate block">{device.zone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Live Traffic</span>
                    <span className="font-mono text-emerald-400 text-[11px] flex items-center space-x-1">
                      <Activity className="w-3 h-3 text-emerald-400" />
                      <span>{device.packetRate} pkts/s</span>
                    </span>
                  </div>
                </div>

                {/* Physical Location */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-3">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{device.location}</span>
                </div>

                {/* CPU bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Controller Load</span>
                    <span className="font-mono">{device.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        device.cpuUsage > 85 ? 'bg-rose-500' : device.cpuUsage > 60 ? 'bg-amber-400' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${device.cpuUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/60">
                {isQuarantined ? (
                  <button
                    onClick={() => onUnquarantineDevice(device.id)}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>{t.btnRestore}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onIsolateDevice(device.id)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-950/50 hover:border-amber-600/60 border border-slate-700 text-slate-300 hover:text-amber-200 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.btnIsolate}</span>
                  </button>
                )}

                <button
                  onClick={() => onInspectDevice(device)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.btnInspect}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
