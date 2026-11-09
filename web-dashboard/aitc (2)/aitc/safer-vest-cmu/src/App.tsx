import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EmergencyCenter from './pages/EmergencyCenter';
import Layout from './components/layout/Layout';
import MapView from './components/MapView';
import ResponderPanel from './components/ResponderPanel';
import EventLog from './components/EventLog';
import SystemHealth from './components/SystemHealth';
import { useSimulation } from './hooks/useSimulation';
import './index.css';
import { Map, Users, Radio, Sliders } from 'lucide-react';

function LiveTrackingPage() {
  const { responders, systemHealth, stats } = useSimulation();
  const [selectedResponderId, setSelectedResponderId] = useState<string | null>(null);

  const selectedResponder = responders.find(r => r.id === selectedResponderId);

  return (
    <Layout
      title="Live GPS Tracking Radar"
      onlineCount={stats.onlineResponders}
      emergencyCount={stats.emergencyCount}
      loraConnected={systemHealth.loraGateway === 'OPERATIONAL'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
        {/* Map View - Takes 3 Columns */}
        <div className="lg:col-span-3 h-full glass-card border border-slate-800/80 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Map size={20} className="text-cyan-400" />
              <h2 className="text-base font-extrabold text-white">Full-Screen Tactical Radar</h2>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-400">Tracked Units: <strong className="text-white">{responders.length}</strong></span>
              <span className="text-slate-400">Active Radar: <strong className="text-emerald-400">ONLINE</strong></span>
            </div>
          </div>
          <div className="flex-1 w-full rounded-xl overflow-hidden">
            <MapView responders={responders} onResponderClick={setSelectedResponderId} className="h-full" />
          </div>
        </div>

        {/* Sidebar Diagnostics - Takes 1 Column */}
        <div className="lg:col-span-1 h-full overflow-y-auto space-y-4 pr-1">
          <div className="glass-card border border-slate-800/80 rounded-2xl p-4">
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center space-x-2">
              <Users size={16} className="text-cyan-400" />
              <span>Responders Radar Directory</span>
            </h3>
            <div className="space-y-2">
              {responders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedResponderId(r.id)}
                  className={`
                    p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between
                    ${selectedResponderId === r.id
                      ? 'border-cyan-400 bg-cyan-950/40'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }
                  `}
                >
                  <div>
                    <div className="font-extrabold text-xs text-white font-mono">{r.id}</div>
                    <div className="text-[11px] text-slate-400">{r.name}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    r.status === 'EMERGENCY' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                    r.status === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    r.status === 'NORMAL' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {selectedResponder && (
            <div className="glass-card border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Focused Telemetry</h3>
              <div className="text-lg font-extrabold text-white font-mono">{selectedResponder.id}</div>
              <div className="text-xs text-slate-300">{selectedResponder.name}</div>
              <div className="space-y-2 text-xs font-mono pt-2 border-t border-slate-800">
                <div className="flex justify-between text-slate-400">
                  <span>Heart Rate:</span>
                  <span className="text-rose-400 font-bold">{selectedResponder.heartRate.current} BPM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Battery:</span>
                  <span className="text-emerald-400 font-bold">{selectedResponder.battery.percentage}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>LoRa RSSI:</span>
                  <span className="text-sky-400 font-bold">{selectedResponder.lora.rssi ?? 'N/A'} dBm</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GPS Lat/Lng:</span>
                  <span className="text-cyan-300">{selectedResponder.gps.latitude.toFixed(4)}, {selectedResponder.gps.longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function RespondersPage() {
  const { responders, systemHealth, stats } = useSimulation();

  return (
    <Layout
      title="Responder Units Fleet Monitoring"
      onlineCount={stats.onlineResponders}
      emergencyCount={stats.emergencyCount}
      loraConnected={systemHealth.loraGateway === 'OPERATIONAL'}
    >
      <div className="mb-6">
        <div className="glass-card border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Users size={20} className="text-cyan-400" />
                <span>Active Field Responders Fleet</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Real-time status, PPG vitals, IMU motion, and LoRa link quality</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full font-bold">
              {responders.length} Units Active
            </span>
          </div>

          <ResponderPanel responders={responders} />
        </div>
      </div>
    </Layout>
  );
}

function EventLogsPage() {
  const { eventLogs, systemHealth, stats } = useSimulation();

  return (
    <Layout
      title="System & Telemetry Event Logs"
      onlineCount={stats.onlineResponders}
      emergencyCount={stats.emergencyCount}
      loraConnected={systemHealth.loraGateway === 'OPERATIONAL'}
    >
      <div className="max-w-5xl mx-auto">
        <EventLog logs={eventLogs} />
      </div>
    </Layout>
  );
}

function SystemStatusPage() {
  const { systemHealth, stats } = useSimulation();

  return (
    <Layout
      title="Gateway & Infrastructure Diagnostics"
      onlineCount={stats.onlineResponders}
      emergencyCount={stats.emergencyCount}
      loraConnected={systemHealth.loraGateway === 'OPERATIONAL'}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <SystemHealth health={systemHealth} />

        <div className="glass-card border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-base font-extrabold text-white mb-4 flex items-center space-x-2">
            <Radio size={20} className="text-sky-400" />
            <span>LoRa 868/915 MHz Gateway Topology</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 mb-1">Frequency Channel</div>
              <div className="text-white font-bold text-base">915.00 MHz</div>
              <div className="text-emerald-400 text-[10px] mt-1">Bandwidth: 125 kHz</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 mb-1">Packet Delivery Rate</div>
              <div className="text-emerald-400 font-bold text-base">99.4%</div>
              <div className="text-slate-400 text-[10px] mt-1">Avg Loss: 0.6%</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 mb-1">ESP32 Gateways</div>
              <div className="text-cyan-400 font-bold text-base">2 Active Node Gateways</div>
              <div className="text-slate-400 text-[10px] mt-1">Uptime: 48h 12m</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SettingsPage() {
  const { systemHealth, stats } = useSimulation();

  return (
    <Layout
      title="System Configuration & Preferences"
      onlineCount={stats.onlineResponders}
      emergencyCount={stats.emergencyCount}
      loraConnected={systemHealth.loraGateway === 'OPERATIONAL'}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-card border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sliders size={22} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Threshold & Alarm Parameters</h2>
              <p className="text-xs text-slate-400">Configure automated trigger limits for emergency dispatch</p>
            </div>
          </div>

          <div className="space-y-5 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">High Heart Rate Threshold (BPM)</label>
              <input type="number" defaultValue={140} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono" />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">No Motion Inactivity Timer (Seconds)</label>
              <input type="number" defaultValue={180} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono" />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">LoRa Signal Warning Threshold (RSSI dBm)</label>
              <input type="number" defaultValue={-95} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono" />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => alert('Settings saved successfully!')}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tracking" element={<LiveTrackingPage />} />
        <Route path="/responders" element={<RespondersPage />} />
        <Route path="/emergency" element={<EmergencyCenter />} />
        <Route path="/logs" element={<EventLogsPage />} />
        <Route path="/system" element={<SystemStatusPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
