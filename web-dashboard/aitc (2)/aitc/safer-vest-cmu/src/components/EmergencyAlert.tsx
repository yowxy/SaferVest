import { AlertOctagon, MapPin, Eye, Check, X, ExternalLink, Heart } from 'lucide-react';
import type { EmergencyEvent } from '../types';

interface EmergencyAlertProps {
  events: EmergencyEvent[];
  onAcknowledge?: (eventId: string) => void;
  onView?: (eventId: string) => void;
  onClose?: (eventId: string) => void;
  className?: string;
}

export default function EmergencyAlert({
  events,
  onAcknowledge,
  onView,
  onClose,
  className = ''
}: EmergencyAlertProps) {
  const activeEmergencies = events.filter(e => e.type === 'ACTIVE');

  if (activeEmergencies.length === 0) return null;

  const getTriggerText = (trigger: string) => {
    const triggers: Record<string, string> = {
      MANUAL_SOS: '🚨 Manual SOS Emergency Button Pressed',
      NO_MOTION: '⚠️ Prolonged Motion Inactivity Detected (3+ mins)',
      ABNORMAL_HEART_RATE: '💓 Critical Tachycardia / Abnormal BPM',
      FALL_DETECTION: '🔻 High-Impact Fall Event Detected',
      COMMUNICATION_LOST: '📡 LoRa Telemetry Connection Lost'
    };
    return triggers[trigger] || trigger;
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

  return (
    <div className={`space-y-4 ${className}`}>
      {activeEmergencies.map((event) => (
        <div
          key={event.id}
          className="relative overflow-hidden bg-rose-950/40 border-2 border-rose-500/80 rounded-2xl p-5 glow-rose shadow-2xl shadow-rose-950/80 animate-pulse backdrop-blur-xl"
        >
          {/* Top Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-rose-500 rounded-2xl animate-ping opacity-75"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/60 ring-2 ring-rose-400">
                  <AlertOctagon size={26} className="text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">
                    CRITICAL EMERGENCY ALERT
                  </h3>
                  <span className="px-2.5 py-0.5 bg-rose-600 text-white rounded-md font-mono font-extrabold text-xs">
                    {event.id}
                  </span>
                </div>
                <p className="text-rose-200 text-sm font-semibold mt-0.5">
                  {getTriggerText(event.trigger)}
                </p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={() => onClose(event.id)}
                className="p-2 hover:bg-rose-900/60 rounded-xl text-rose-300 hover:text-white transition-colors"
                title="Dismiss"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Responder Details Box */}
          <div className="bg-slate-950/80 border border-rose-900/50 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Responder Unit
                </div>
                <div className="text-white font-extrabold text-base font-mono">
                  {event.responderId}
                </div>
                <div className="text-slate-300 text-xs font-medium">{event.responderName}</div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Alert Timestamp
                </div>
                <div className="text-rose-300 font-extrabold text-base font-mono">
                  {formatTime(event.timestamp)}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Vital Heart Rate
                </div>
                <div className="text-white font-extrabold text-base font-mono flex items-center space-x-1.5">
                  <Heart size={16} className="text-rose-400" />
                  <span>{event.heartRate > 0 ? `${Math.round(event.heartRate)} BPM` : '--'}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  GPS Coordinates
                </div>
                <div className="text-cyan-300 font-mono text-xs flex items-center space-x-1">
                  <MapPin size={14} className="text-cyan-400" />
                  <span>{event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {!event.acknowledged && onAcknowledge && (
              <button
                onClick={() => onAcknowledge(event.id)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-bold text-xs transition-all shadow-lg shadow-emerald-950/60 cursor-pointer"
              >
                <Check size={18} />
                <span>ACKNOWLEDGE DISPATCH</span>
              </button>
            )}

            {event.acknowledged && (
              <div className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-emerald-300 font-bold text-xs">
                <Check size={18} />
                <span>ACKNOWLEDGED BY OPERATOR</span>
              </div>
            )}

            {onView && (
              <button
                onClick={() => onView(event.id)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 rounded-xl text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
              >
                <Eye size={16} />
                <span>Focus Map Marker</span>
              </button>
            )}

            <button
              onClick={() => window.open(`https://www.google.com/maps?q=${event.location.latitude},${event.location.longitude}`, '_blank')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
            >
              <span>External Google Maps</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
