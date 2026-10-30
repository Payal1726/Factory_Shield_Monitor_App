import React, { useState } from 'react';
import { 
  History, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { IncidentHistoryItem, ThreatSeverity } from '../types';
import { translations } from '../utils/translations';

interface IncidentHistoryViewProps {
  history: IncidentHistoryItem[];
  lang: 'en' | 'hi';
}

export const IncidentHistoryView: React.FC<IncidentHistoryViewProps> = ({
  history,
  lang
}) => {
  const t = translations[lang];
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = history.filter(item => {
    const matchesSev = selectedSeverity === 'ALL' || item.severity === selectedSeverity;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.affectedDevice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.actionTaken.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const exportReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FactoryShield_Security_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>{t.historyTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.historyDesc}
          </p>
        </div>

        <button
          onClick={exportReport}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t.btnExportReport}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <button
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
              selectedSeverity === 'ALL'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
              selectedSeverity === 'critical'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setSelectedSeverity('high')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
              selectedSeverity === 'high'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incident log..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Incident List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 font-semibold bg-slate-950/40">
              <th className="py-2.5 px-3">{t.colSeverity}</th>
              <th className="py-2.5 px-3">{t.colAlert}</th>
              <th className="py-2.5 px-3">{t.colDevice}</th>
              <th className="py-2.5 px-3">{t.colDetected}</th>
              <th className="py-2.5 px-3">{t.colResolved}</th>
              <th className="py-2.5 px-3">{t.colAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.map(item => {
              const titleText = lang === 'hi' ? item.titleHi : item.title;
              const actionText = lang === 'hi' ? item.actionTakenHi : item.actionTaken;

              return (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                      item.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-100">
                    {titleText}
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-300">
                    {item.affectedDevice}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-mono text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.resolvedAt} ({item.resolutionTimeMinutes}m MTTR)</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate" title={actionText}>
                    {actionText}
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
