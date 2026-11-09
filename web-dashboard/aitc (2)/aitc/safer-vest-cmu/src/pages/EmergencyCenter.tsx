import { useState } from 'react';
import { CheckCircle, MapPin, Clock, User, ExternalLink, Heart } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useSimulation } from '../hooks/useSimulation';
import type { EmergencyEvent } from '../types';

export default function EmergencyCenter() {
  const { emergencyEvents, systemHealth, stats, simulationService } = useSimulation();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'WARNING' | 'RESOLVED'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EmergencyEvent | null>(null);

  const filteredEvents = emergencyEvents.filter(event => {
    if (filter === 'ALL') return true;
    return event.type === filter;
  });

  const getTriggerColor = (trigger: string) => {
    const colors: Record<string, string> = {
      MANUAL_SOS: 'text-rose-400',
      FALL_DETECTION: 'text-orange-400',
      NO_MOTION: 'text-amber-400',
      ABNORMAL_HEART_RATE: 'text-pink-400',
      COMMUNICATION_LOST: 'text-slate-400'
    };
    return colors[trigger] || 'text-slate-400';
  };

  const getTriggerIcon = (trigger: string) => {
    const icons: Record<string, string> = {
      MANUAL_SOS: '🚨',
      FALL_DETECTION: '🔻',
      NO_MOTION: '⏸️',
      ABNORMAL_HEART_RATE: '💓',
      COMMUNICATION_LOST: '📡'
    };
    return icons[trigger] || '⚠️';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleAcknowledge = (eventId: string) => {
    simulationService.acknowledgeEmergency(eventId);
  };

  const handleResolve = (eventId: string) => {
    const notes = prompt('Enter emergency resolution dispatch notes (optional):');
    simulationService.resolveEmergency(eventId, notes || undefined);
    setSelectedEvent(null);
  };

  return (
    <Layout
      title="Emergency Triage & Response Center"
      onlineCount={stats.onlineResponders}
      emergencyCount={stats.emergencyCount}
      loraConnected={systemHealth.loraGateway === 'OPERATIONAL'}
      unreadNotifications={0}
    >
      {/* Filter Tabs Header */}
      <div className="flex flex-wrap items-center space-x-2 mb-6">
        {(['ALL', 'ACTIVE', 'WARNING', 'RESOLVED'] as const).map((tab) => {
          const count = emergencyEvents.filter(e => tab === 'ALL' || e.type === tab).length;
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`
                px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all duration-200 cursor-pointer flex items-center space-x-2.5
                ${isActive
                  ? tab === 'ACTIVE'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-950/60 glow-rose'
                    : tab === 'WARNING'
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-950/60 glow-amber'
                    : tab === 'RESOLVED'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 glow-emerald'
                    : 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-950/60 glow-cyan'
                  : 'glass-card border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }
              `}
            >
              <span>{tab}</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-slate-900 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Emergency Events List / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredEvents.length === 0 ? (
          <div className="col-span-2 glass-card border border-slate-800/80 rounded-2xl p-16 text-center">
            <CheckCircle size={64} className="mx-auto mb-4 text-emerald-400/60" />
            <h3 className="text-xl font-extrabold text-white mb-2">Zero Active Incidents</h3>
            <p className="text-sm text-slate-400">
              All responder units operating within normal safety limits. No active triage required.
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isSelected = selectedEvent?.id === event.id;
            return (
              <div
                key={event.id}
                className={`
                  glass-card border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 relative overflow-hidden
                  ${event.type === 'ACTIVE' ? 'border-rose-500/80 bg-rose-950/20 glow-rose animate-pulse' :
                    event.type === 'WARNING' ? 'border-amber-500/80 bg-amber-950/20 glow-amber' :
                    'border-emerald-500/60 bg-slate-900/60'
                  }
                  ${isSelected ? 'ring-2 ring-cyan-400' : ''}
                `}
                onClick={() => setSelectedEvent(event)}
              >
                {/* Event Top Bar */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3.5">
                    <span className="text-3xl p-2 rounded-xl bg-slate-950/80 border border-slate-800">{getTriggerIcon(event.trigger)}</span>
                    <div>
                      <div className={`font-extrabold uppercase text-sm tracking-tight ${getTriggerColor(event.trigger)}`}>
                        {event.trigger.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">INCIDENT ID: {event.id}</div>
                    </div>
                  </div>

                  <span className={`
                    px-3 py-1 rounded-full text-xs font-extrabold uppercase border
                    ${event.type === 'ACTIVE' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                      event.type === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }
                  `}>
                    {event.type}
                  </span>
                </div>

                {/* Responder Unit Identity */}
                <div className="flex items-center space-x-2.5 mb-4 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-white">
                  <User size={18} className="text-cyan-400" />
                  <span className="font-extrabold font-mono text-sm">{event.responderId}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-medium text-xs">{event.responderName}</span>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <div className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
                      <Clock size={11} className="text-sky-400" /> Timestamp
                    </div>
                    <div className="text-white font-mono text-xs">
                      {formatTime(event.timestamp)}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <div className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
                      <Heart size={11} className="text-rose-400" /> Heart Rate
                    </div>
                    <div className="text-white font-mono font-bold text-xs">
                      {event.heartRate > 0 ? `${event.heartRate} BPM` : '--'}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">IMU Activity</div>
                    <div className="text-white font-semibold text-xs">
                      {event.activity.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <div className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
                      <MapPin size={11} className="text-cyan-400" /> Location
                    </div>
                    <div className="text-cyan-300 font-mono text-[11px]">
                      {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Action Dispatch Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
                  {!event.acknowledged && event.type === 'ACTIVE' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcknowledge(event.id);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Acknowledge Incident
                    </button>
                  )}

                  {event.acknowledged && event.type !== 'RESOLVED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolve(event.id);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 rounded-xl text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Resolve Incident
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps?q=${event.location.latitude},${event.location.longitude}`, '_blank');
                    }}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Maps</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                {/* Resolution Audit Note */}
                {event.type === 'RESOLVED' && event.resolvedAt && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs bg-slate-950/60 p-2.5 rounded-xl">
                    <div className="text-emerald-400 font-bold mb-1">
                      ✓ Resolved at {formatTime(event.resolvedAt)}
                    </div>
                    {event.notes && (
                      <div className="text-slate-400 text-[11px]">
                        Resolution Log: {event.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
