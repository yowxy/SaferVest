import { useState, useEffect } from 'react';
import { Bell, Radio, Users, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface HeaderProps {
  title: string;
  onlineCount: number;
  emergencyCount: number;
  loraConnected: boolean;
  onNotificationClick?: () => void;
  unreadNotifications?: number;
}

export default function Header({
  title,
  onlineCount,
  emergencyCount,
  loraConnected,
  onNotificationClick,
  unreadNotifications = 0
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <header className="glass-panel sticky top-0 z-20 shadow-xl border-b border-slate-800/80">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title and Emergency Status */}
          <div className="flex items-center space-x-5">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            </div>

            {/* Emergency Indicator */}
            {emergencyCount > 0 && (
              <div className="flex items-center space-x-2.5 px-4 py-2 bg-rose-500/20 border border-rose-500/60 rounded-xl glow-rose animate-pulse">
                <div className="relative flex items-center justify-center">
                  <AlertTriangle className="text-rose-400" size={20} />
                  <div className="absolute inset-0 animate-ping">
                    <AlertTriangle className="text-rose-400" size={20} />
                  </div>
                </div>
                <span className="text-rose-300 font-bold text-xs lg:text-sm tracking-wider uppercase">
                  {emergencyCount} {emergencyCount === 1 ? 'EMERGENCY' : 'EMERGENCIES'} ACTIVE
                </span>
              </div>
            )}
          </div>

          {/* Right: Status Indicators, Time, Profile */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* System Status Indicators */}
            <div className="hidden md:flex items-center space-x-3">
              {/* System Online Badge */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <ShieldCheck size={15} className="text-emerald-400" />
                <span className="text-emerald-300 font-semibold text-xs tracking-wide">ONLINE</span>
              </div>

              {/* LoRa Gateway Status */}
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-colors ${
                loraConnected 
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <Radio size={15} className={loraConnected ? 'text-sky-400' : 'text-rose-400'} />
                <span className="font-semibold text-xs tracking-wide">
                  LoRa: {loraConnected ? 'READY' : 'FAULT'}
                </span>
              </div>

              {/* Online Responders Count */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <Users size={15} className="text-cyan-400" />
                <span className="text-cyan-300 font-semibold text-xs tracking-wide">
                  {onlineCount} Responders
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block h-8 w-px bg-slate-800" />

            {/* Real-time Clock */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              <Clock size={16} className="text-cyan-400" />
              <div className="text-right">
                <div className="text-sm font-bold text-white font-mono tracking-wider leading-tight">
                  {formatTime(currentTime)}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>

            {/* Notification Bell */}
            <button
              onClick={onNotificationClick}
              className="relative p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-slate-300 hover:text-white group"
              title="Notifications"
            >
              <Bell size={20} className="transition-transform group-hover:scale-110" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-rose-500 to-red-600 rounded-full text-white text-[11px] flex items-center justify-center font-extrabold shadow-lg shadow-rose-900/50 animate-pulse">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* Operator Profile */}
            <div className="flex items-center space-x-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all">
                  <span className="text-white font-extrabold text-xs">OP</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900"></div>
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight">Commander</div>
                <div className="text-[10px] text-cyan-400 font-medium">On Duty</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
