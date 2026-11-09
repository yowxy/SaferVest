import { Activity, Battery, Radio, Clock, Heart, ShieldAlert } from 'lucide-react';
import type { Responder } from '../types';

interface ResponderPanelProps {
  responders: Responder[];
  onResponderClick?: (responderId: string) => void;
  className?: string;
}

export default function ResponderPanel({ responders, onResponderClick, className = '' }: ResponderPanelProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'EMERGENCY':
        return 'border-rose-500/80 bg-rose-950/20 glow-rose animate-pulse ring-2 ring-rose-500/40';
      case 'WARNING':
        return 'border-amber-500/60 bg-amber-950/20 glow-amber';
      case 'NORMAL':
        return 'border-emerald-500/40 bg-slate-900/80 hover:border-emerald-400';
      default:
        return 'border-slate-800 bg-slate-950/60 opacity-70';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EMERGENCY':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'NORMAL':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getSignalStatus = (rssi: number | null) => {
    if (rssi === null) return { text: 'Disconnected', color: 'text-slate-400' };
    if (rssi >= -70) return { text: 'Excellent', color: 'text-emerald-400' };
    if (rssi >= -85) return { text: 'Good', color: 'text-sky-400' };
    if (rssi >= -95) return { text: 'Weak', color: 'text-amber-400' };
    return { text: 'Poor', color: 'text-rose-400' };
  };

  const formatLastUpdate = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {responders.map((responder) => {
        const signalStatus = getSignalStatus(responder.lora.rssi);
        const isEmergency = responder.status === 'EMERGENCY';
        
        return (
          <div
            key={responder.id}
            onClick={() => onResponderClick?.(responder.id)}
            className={`
              glass-card rounded-2xl p-4 border transition-all duration-300
              cursor-pointer hover:scale-[1.02] hover:-translate-y-1 group
              ${getStatusStyle(responder.status)}
            `}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-white tracking-tight font-mono">
                    {responder.id}
                  </span>
                  {isEmergency && (
                    <ShieldAlert size={18} className="text-rose-400 animate-pulse" />
                  )}
                </div>
                <div className="text-xs text-slate-300 font-medium">{responder.name}</div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(responder.status)}`}>
                  {responder.status}
                </span>
              </div>
            </div>

            {/* Vitals Telemetry Grid */}
            <div className="space-y-2.5">
              {/* Heart Rate */}
              <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Heart size={15} className={`text-rose-400 ${responder.heartRate.current > 0 ? 'animate-heartbeat' : ''}`} />
                  <span>Heart Rate:</span>
                </div>
                <span className={`font-extrabold font-mono text-sm ${
                  responder.heartRate.status === 'CRITICAL' ? 'text-rose-400' :
                  responder.heartRate.status === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {responder.heartRate.current > 0 ? `${Math.round(responder.heartRate.current)} BPM` : '--'}
                </span>
              </div>

              {/* Activity Status */}
              <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Activity size={15} className="text-amber-400" />
                  <span>Activity:</span>
                </div>
                <span className="text-white font-semibold uppercase text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {responder.imu.activity.replace('_', ' ')}
                </span>
              </div>

              {/* Battery Indicator */}
              <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Battery size={15} className="text-emerald-400" />
                  <span>Battery:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        responder.battery.percentage > 50 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                        responder.battery.percentage > 20 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-600 to-red-500'
                      }`}
                      style={{ width: `${responder.battery.percentage}%` }}
                    />
                  </div>
                  <span className="text-white font-bold font-mono text-xs w-9 text-right">
                    {responder.battery.percentage}%
                  </span>
                </div>
              </div>

              {/* LoRa Signal */}
              <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Radio size={15} className="text-sky-400" />
                  <span>LoRa RSSI:</span>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className={`font-semibold text-xs ${signalStatus.color}`}>
                    {signalStatus.text}
                  </span>
                  {responder.lora.rssi !== null && (
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                      {responder.lora.rssi.toFixed(0)} dBm
                    </span>
                  )}
                </div>
              </div>

              {/* Last Update */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-1.5">
                  <Clock size={13} className="text-cyan-400" />
                  <span>Telemetry Sync:</span>
                </div>
                <span className="font-mono text-slate-300">{formatLastUpdate(responder.lastUpdate)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
