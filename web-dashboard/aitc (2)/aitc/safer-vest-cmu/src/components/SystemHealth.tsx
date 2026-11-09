import { Radio, Cpu, MapPin, Activity, Monitor, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import type { SystemHealth as SystemHealthType } from '../types';

interface SystemHealthProps {
  health: SystemHealthType;
  className?: string;
}

export default function SystemHealth({ health, className = '' }: SystemHealthProps) {
  const getStatusIcon = (status: string) => {
    if (status === 'OPERATIONAL') return <CheckCircle2 size={16} className="text-emerald-400" />;
    if (status === 'WARNING') return <AlertTriangle size={16} className="text-amber-400" />;
    return <XCircle size={16} className="text-rose-400" />;
  };

  const getStatusStyle = (status: string) => {
    if (status === 'OPERATIONAL') return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
    if (status === 'WARNING') return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-300 bg-rose-500/10 border-rose-500/30';
  };

  const components = [
    { name: 'LoRa SX1276 Gateway', status: health.loraGateway, icon: <Radio size={18} className="text-sky-400" /> },
    { name: 'ESP32 Nodes Hub', status: health.esp32Gateway, icon: <Cpu size={18} className="text-cyan-400" /> },
    { name: 'NEO-6M GPS Service', status: health.gpsService, icon: <MapPin size={18} className="text-amber-400" /> },
    { name: 'Telemetry Data Stream', status: health.dataStream, icon: <Activity size={18} className="text-purple-400" /> },
    { name: 'Command Dashboard', status: health.dashboard, icon: <Monitor size={18} className="text-emerald-400" /> }
  ];

  const overallStatus = Object.values(health).some(s => s === 'OFFLINE') ? 'OFFLINE' :
                         Object.values(health).some(s => s === 'WARNING') ? 'WARNING' : 'OPERATIONAL';

  return (
    <div className={`glass-card border border-slate-800/80 rounded-2xl p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck size={20} className="text-emerald-400" />
          <h3 className="text-base font-extrabold text-white">System Diagnostics</h3>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 border rounded-xl font-mono text-xs font-bold ${getStatusStyle(overallStatus)}`}>
          {getStatusIcon(overallStatus)}
          <span>{overallStatus}</span>
        </div>
      </div>

      {/* Components Health List */}
      <div className="space-y-2.5">
        {components.map((component, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 transition-all hover:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                {component.icon}
              </div>
              <span className="text-xs font-bold text-slate-200">{component.name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getStatusStyle(component.status)}`}>
                {component.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Latency & Timestamp Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Latency: <strong className="text-emerald-400">12ms</strong></span>
        <span>Synced: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
