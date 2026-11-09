import { useState } from 'react';
import { Play, AlertOctagon, Activity, Heart, UserX, Wifi, WifiOff, RotateCcw, Zap, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { simulationService } from '../services/simulationService';
import type { Responder } from '../types';

interface SimulationControlsProps {
  responders: Responder[];
  className?: string;
}

export default function SimulationControls({ responders, className = '' }: SimulationControlsProps) {
  const [selectedResponder, setSelectedResponder] = useState<string>('RESP-001');
  const [isExpanded, setIsExpanded] = useState(false);

  const scenarios = [
    {
      name: 'Normal Reset',
      icon: <Play size={16} />,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40',
      action: () => simulationService.simulateNormal(selectedResponder)
    },
    {
      name: 'Warning State',
      icon: <Zap size={16} />,
      color: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40',
      action: () => simulationService.simulateWarning(selectedResponder)
    },
    {
      name: 'Manual SOS',
      icon: <AlertOctagon size={16} />,
      color: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse',
      action: () => simulationService.simulateSOS(selectedResponder)
    },
    {
      name: 'No Motion (3m)',
      icon: <UserX size={16} />,
      color: 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/40',
      action: () => simulationService.simulateNoMotion(selectedResponder)
    },
    {
      name: 'High BPM (155)',
      icon: <Heart size={16} />,
      color: 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-900/40',
      action: () => simulationService.simulateHighHeartRate(selectedResponder)
    },
    {
      name: 'Fall Detected',
      icon: <Activity size={16} />,
      color: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40',
      action: () => simulationService.simulateFallDetection(selectedResponder)
    },
    {
      name: 'Weak RSSI',
      icon: <Wifi size={16} />,
      color: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/40',
      action: () => simulationService.simulateWeakSignal(selectedResponder)
    },
    {
      name: 'Signal Loss',
      icon: <WifiOff size={16} />,
      color: 'bg-slate-700 hover:bg-slate-600 text-white shadow-slate-900/40',
      action: () => simulationService.simulateCommunicationLost(selectedResponder)
    }
  ];

  return (
    <div className={`glass-card border border-slate-800/80 rounded-2xl overflow-hidden ${className}`}>
      {/* Interactive Banner Header */}
      <div
        className="p-4 cursor-pointer hover:bg-slate-800/40 transition-colors flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 ring-2 ring-indigo-500/30">
            <Cpu size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-white">Emergency Simulation Engine</h3>
              <span className="text-[10px] font-extrabold font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded-full">
                TEST BENCH
              </span>
            </div>
            <p className="text-xs text-slate-400">Inject real-time emergency events for testing</p>
          </div>
        </div>

        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expanded Scenario Drawer */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 animate-fadeIn">
          {/* Target Unit Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Target Responder Unit
            </label>
            <select
              value={selectedResponder}
              onChange={(e) => setSelectedResponder(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all cursor-pointer"
            >
              {responders.map((responder) => (
                <option key={responder.id} value={responder.id}>
                  {responder.id} - {responder.name} [{responder.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Scenario Action Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Trigger Telemetry Event
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {scenarios.map((scenario, index) => (
                <button
                  key={index}
                  onClick={scenario.action}
                  className={`
                    ${scenario.color}
                    flex items-center justify-center space-x-2
                    px-3.5 py-2.5 rounded-xl font-bold text-xs
                    transition-all duration-200 shadow-md hover:scale-[1.02]
                    active:scale-95 cursor-pointer
                  `}
                >
                  {scenario.icon}
                  <span>{scenario.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset All Simulation Data */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm('Reset all simulation telemetry to initial state?')) {
                  simulationService.resetSimulation();
                }
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw size={16} className="text-cyan-400" />
              <span>Reset Full Telemetry Engine</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
