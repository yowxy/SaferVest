import { useState } from 'react';
import { Filter, Search, AlertOctagon, AlertTriangle, Info, Radio, CheckCircle, Clock } from 'lucide-react';
import type { EventLog as EventLogType, EventType } from '../types';

interface EventLogProps {
  logs: EventLogType[];
  className?: string;
}

export default function EventLog({ logs, className = '' }: EventLogProps) {
  const [filter, setFilter] = useState<EventType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getEventIcon = (type: EventType) => {
    const icons = {
      EMERGENCY: <AlertOctagon size={18} className="text-rose-400 animate-pulse" />,
      WARNING: <AlertTriangle size={18} className="text-amber-400" />,
      SYSTEM: <Radio size={18} className="text-sky-400" />,
      COMMUNICATION: <Radio size={18} className="text-cyan-400" />,
      INFO: <Info size={18} className="text-slate-400" />
    };
    return icons[type] || <CheckCircle size={18} className="text-slate-400" />;
  };

  const getEventStyle = (type: EventType) => {
    const styles = {
      EMERGENCY: 'border-l-4 border-rose-500 bg-rose-950/20 text-rose-200',
      WARNING: 'border-l-4 border-amber-500 bg-amber-950/20 text-amber-200',
      SYSTEM: 'border-l-4 border-sky-500 bg-sky-950/20 text-sky-200',
      COMMUNICATION: 'border-l-4 border-cyan-500 bg-cyan-950/20 text-cyan-200',
      INFO: 'border-l-4 border-slate-700 bg-slate-900/50 text-slate-300'
    };
    return styles[type] || 'border-l-4 border-slate-700 bg-slate-900/50 text-slate-300';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'ALL' || log.type === filter;
    const matchesSearch = searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.responderId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions: Array<{ value: EventType | 'ALL'; label: string; activeBg: string }> = [
    { value: 'ALL', label: 'All Events', activeBg: 'bg-slate-700 text-white' },
    { value: 'EMERGENCY', label: 'Emergency', activeBg: 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' },
    { value: 'WARNING', label: 'Warning', activeBg: 'bg-amber-600 text-white shadow-lg shadow-amber-900/50' },
    { value: 'SYSTEM', label: 'System', activeBg: 'bg-sky-600 text-white shadow-lg shadow-sky-900/50' },
    { value: 'COMMUNICATION', label: 'Comm', activeBg: 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50' }
  ];

  return (
    <div className={`glass-card border border-slate-800/80 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
            <Filter size={18} className="text-cyan-400" />
            <span>Event Stream Log</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-full font-bold">
            {filteredLogs.length} Events
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`
                px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200
                ${filter === option.value
                  ? option.activeBg
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search events by message or unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {/* Log Feed */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Info size={40} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">No matching event logs found</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`
                p-3.5 transition-colors hover:bg-slate-800/40
                ${getEventStyle(log.type)}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getEventIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium leading-relaxed">{log.message}</p>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 flex-shrink-0 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                      <Clock size={10} className="text-slate-500" />
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                  {log.responderId && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-950/80 rounded border border-slate-800 text-[10px] font-bold text-cyan-400 font-mono">
                      {log.responderId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
