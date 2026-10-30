import React, { useState } from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { NetworkPacket } from '../types';
import { translations } from '../utils/translations';

interface LivePacketStreamProps {
  packets: NetworkPacket[];
  lang: 'en' | 'hi';
  isPaused: boolean;
  onTogglePause: () => void;
  totalPackets: number;
}

export const LivePacketStream: React.FC<LivePacketStreamProps> = ({
  packets,
  lang,
  isPaused,
  onTogglePause,
  totalPackets
}) => {
  const t = translations[lang];
  const [protocolFilter, setProtocolFilter] = useState<string>('ALL');
  const [onlySuspicious, setOnlySuspicious] = useState<boolean>(false);

  const filteredPackets = packets.filter(pkt => {
    const matchesProto = protocolFilter === 'ALL' || pkt.protocol.includes(protocolFilter);
    const matchesSuspicious = !onlySuspicious || pkt.isSuspicious;
    return matchesProto && matchesSuspicious;
  });

  const getProtocolColor = (proto: string) => {
    if (proto.includes('Modbus')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (proto.includes('OPC UA')) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    if (proto.includes('EtherNet/IP')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (proto.includes('S7Comm')) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (proto.includes('MQTT')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    return 'bg-slate-700 text-slate-300 border-slate-600';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <span>{t.navTraffic}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                TOTAL MONITORED: {totalPackets.toLocaleString()} PKTS
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time deep packet inspection (DPI) of shop-floor industrial control networks.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Pause / Resume Button */}
          <button
            onClick={onTogglePause}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              isPaused
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume Sniffer' : 'Freeze Stream'}</span>
          </button>

          {/* Suspicious Only Toggle */}
          <button
            onClick={() => setOnlySuspicious(!onlySuspicious)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              onlySuspicious
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/60'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Only Anomalies</span>
          </button>
        </div>
      </div>

      {/* Protocol filter tags */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[11px] font-semibold mr-1">PROTOCOL:</span>
        {['ALL', 'Modbus', 'OPC UA', 'EtherNet/IP', 'S7Comm', 'MQTT'].map(proto => (
          <button
            key={proto}
            onClick={() => setProtocolFilter(proto)}
            className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
              protocolFilter === proto
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
            }`}
          >
            {proto}
          </button>
        ))}
      </div>

      {/* Packet stream table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto border border-slate-800/80 rounded-lg">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead className="sticky top-0 bg-slate-950 z-10 border-b border-slate-800 text-[10px] uppercase font-semibold text-slate-500">
            <tr>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Protocol</th>
              <th className="py-2 px-3">Source (Sender)</th>
              <th className="py-2 px-3">Destination</th>
              <th className="py-2 px-3">Port</th>
              <th className="py-2 px-3">Function / Command</th>
              <th className="py-2 px-3">DPI Payload Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
            {filteredPackets.map(pkt => {
              return (
                <tr 
                  key={pkt.id} 
                  className={`transition-colors ${
                    pkt.isSuspicious 
                      ? 'bg-rose-950/40 text-rose-200 border-l-2 border-l-rose-500 font-bold' 
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                    {pkt.timestamp}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold border ${getProtocolColor(pkt.protocol)}`}>
                      {pkt.protocol}
                    </span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className="text-cyan-300">{pkt.sourceIp}</span>
                    {pkt.sourceName && <span className="text-slate-500 text-[10px] ml-1 font-sans">({pkt.sourceName})</span>}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className="text-indigo-300">{pkt.destIp}</span>
                    {pkt.destName && <span className="text-slate-500 text-[10px] ml-1 font-sans">({pkt.destName})</span>}
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {pkt.port}
                  </td>
                  <td className="py-2 px-3 text-slate-200 whitespace-nowrap">
                    {pkt.functionCode || 'RAW_CIP'}
                  </td>
                  <td className="py-2 px-3 font-sans text-xs max-w-sm truncate" title={pkt.payloadSummary}>
                    {pkt.isSuspicious ? (
                      <span className="text-rose-400 font-bold flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 inline text-rose-400 shrink-0" />
                        <span>{pkt.payloadSummary}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">{pkt.payloadSummary}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
