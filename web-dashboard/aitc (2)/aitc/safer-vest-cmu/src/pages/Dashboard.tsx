import { useState } from 'react';
import Layout from '../components/layout/Layout';
import StatsCards from '../components/StatsCards';
import MapView from '../components/MapView';
import ResponderPanel from '../components/ResponderPanel';
import HeartRateChart from '../components/HeartRateChart';
import EventLog from '../components/EventLog';
import SystemHealth from '../components/SystemHealth';
import SimulationControls from '../components/SimulationControls';
import EmergencyAlert from '../components/EmergencyAlert';
import { useSimulation } from '../hooks/useSimulation';
import { Map, Users, Heart } from 'lucide-react';

export default function Dashboard() {
  const { responders, emergencyEvents, eventLogs, systemHealth, stats, simulationService } = useSimulation();
  const [selectedResponderId, setSelectedResponderId] = useState<string | null>(null);

  const selectedResponder = selectedResponderId
    ? responders.find(r => r.id === selectedResponderId)
    : responders.find(r => r.status === 'EMERGENCY') || responders[0];

  const handleAcknowledge = (eventId: string) => {
    simulationService.acknowledgeEmergency(eventId);
  };

  return (
    <Layout
      title="Command Monitoring Unit"
      onlineCount={stats.onlineResponders}
      emergencyCount={stats.emergencyCount}
      loraConnected={systemHealth.loraGateway === 'OPERATIONAL'}
      unreadNotifications={0}
    >
      {/* High-priority Emergency Alerts Banner */}
      {stats.emergencyCount > 0 && (
        <EmergencyAlert
          events={emergencyEvents}
          onAcknowledge={handleAcknowledge}
          onView={(eventId) => {
            const event = emergencyEvents.find(e => e.id === eventId);
            if (event) setSelectedResponderId(event.responderId);
          }}
          className="mb-6"
        />
      )}

      {/* Simulation Controls Test Bench Bar */}
      <SimulationControls responders={responders} className="mb-6" />

      {/* Key Metric Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid: Map (2 cols) & System Diagnostics / Log (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Live GPS Radar Map Container */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="glass-card border border-slate-800/80 rounded-2xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Map size={18} />
                </div>
                <span>Live GPS Tracking Radar</span>
              </h3>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Surabaya Sector 1</span>
              </div>
            </div>

            <div className="h-[520px] w-full rounded-xl overflow-hidden">
              <MapView
                responders={responders}
                onResponderClick={setSelectedResponderId}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* System Diagnostics & Real-time Event Feed */}
        <div className="lg:col-span-1 space-y-6">
          <SystemHealth health={systemHealth} />
          <EventLog logs={eventLogs} />
        </div>
      </div>

      {/* Responders Status Fleet Panel */}
      <div className="mb-6">
        <div className="glass-card border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Users size={18} />
              </div>
              <span>Responder Fleet Telemetry Status</span>
            </h3>

            <span className="text-xs text-slate-400 font-mono">
              Click unit card to inspect physiological vitals
            </span>
          </div>

          <ResponderPanel
            responders={responders}
            onResponderClick={setSelectedResponderId}
          />
        </div>
      </div>

      {/* Selected Responder Physiological Vitals Chart */}
      {selectedResponder && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-sm font-extrabold text-slate-300 flex items-center space-x-2 uppercase tracking-wider">
              <Heart size={16} className="text-rose-400" />
              <span>Selected Unit: {selectedResponder.id} ({selectedResponder.name})</span>
            </h4>
          </div>
          
          <HeartRateChart
            data={selectedResponder.heartRate}
            responderId={selectedResponder.id}
          />
        </div>
      )}
    </Layout>
  );
}
