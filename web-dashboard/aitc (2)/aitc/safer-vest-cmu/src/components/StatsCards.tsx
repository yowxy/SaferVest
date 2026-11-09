import { Users, UserCheck, CheckCircle, AlertTriangle, AlertOctagon, UserX } from 'lucide-react';
import type { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'TOTAL UNITS',
      value: stats.totalResponders,
      icon: <Users size={24} />,
      gradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      iconBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      valueColor: 'text-blue-300',
      glow: 'glow-cyan'
    },
    {
      label: 'ONLINE',
      value: stats.onlineResponders,
      icon: <UserCheck size={24} />,
      gradient: 'from-cyan-600/20 via-teal-600/10 to-transparent',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      valueColor: 'text-cyan-300',
      glow: 'glow-cyan'
    },
    {
      label: 'NORMAL',
      value: stats.normalCount,
      icon: <CheckCircle size={24} />,
      gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      valueColor: 'text-emerald-300',
      glow: 'glow-emerald'
    },
    {
      label: 'WARNING',
      value: stats.warningCount,
      icon: <AlertTriangle size={24} />,
      gradient: 'from-amber-600/20 via-yellow-600/10 to-transparent',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      valueColor: 'text-amber-300',
      glow: 'glow-amber'
    },
    {
      label: 'EMERGENCY',
      value: stats.emergencyCount,
      icon: <AlertOctagon size={24} />,
      gradient: 'from-rose-600/25 via-red-600/15 to-transparent',
      borderColor: stats.emergencyCount > 0 ? 'border-rose-500 shadow-lg shadow-rose-900/50' : 'border-rose-500/30 hover:border-rose-400',
      iconBg: stats.emergencyCount > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      valueColor: 'text-rose-300',
      glow: 'glow-rose',
      pulse: stats.emergencyCount > 0
    },
    {
      label: 'OFFLINE',
      value: stats.offlineCount,
      icon: <UserX size={24} />,
      gradient: 'from-slate-600/20 via-slate-700/10 to-transparent',
      borderColor: 'border-slate-700 hover:border-slate-600',
      iconBg: 'bg-slate-800 text-slate-400 border border-slate-700',
      valueColor: 'text-slate-400',
      glow: ''
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            relative overflow-hidden glass-card rounded-2xl p-4
            border ${card.borderColor} transition-all duration-300
            hover:scale-[1.02] hover:-translate-y-1 cursor-default group
            ${card.pulse ? 'ring-2 ring-rose-500/50' : ''}
          `}
        >
          {/* Subtle background glow overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg} transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className={`text-3xl lg:text-4xl font-extrabold font-mono tracking-tight ${card.valueColor}`}>
                {String(card.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">UNITS</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
