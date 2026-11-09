import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Users,
  AlertTriangle,
  ScrollText,
  Activity,
  Settings,
  Menu,
  X,
  Radio,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Tracking', path: '/tracking', icon: <Map size={20} /> },
    { name: 'Responders', path: '/responders', icon: <Users size={20} /> },
    { name: 'Emergency Center', path: '/emergency', icon: <AlertTriangle size={20} /> },
    { name: 'Event Logs', path: '/logs', icon: <ScrollText size={20} /> },
    { name: 'System Status', path: '/system', icon: <Activity size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 glass-panel rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all shadow-xl border border-slate-700"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          ${className}
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:static inset-y-0 left-0 z-40
          bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80
          transition-all duration-300 ease-in-out
          flex flex-col
          shadow-2xl shadow-black/80
        `}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/40 ring-2 ring-rose-400/30">
                    <Radio className="text-white animate-pulse" size={24} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full ring-2 ring-slate-950"></div>
                </div>
                <div>
                  <h1 className="text-white font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    SAFER-Vest
                  </h1>
                  <p className="text-cyan-400 text-[11px] font-bold tracking-widest uppercase">
                    Command Unit
                  </p>
                </div>
              </div>
            )}
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all hover:scale-105"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  group flex items-center space-x-3.5 px-4 py-3.5 rounded-xl
                  transition-all duration-200 relative overflow-hidden
                  ${
                    active
                      ? 'bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white font-bold shadow-lg shadow-rose-950/60 glow-rose'
                      : 'text-slate-400 hover:bg-slate-900/90 hover:text-white font-medium'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="text-sm tracking-wide flex-1 truncate">
                    {item.name}
                  </span>
                )}

                {/* Subtle active left accent bar */}
                {active && !isCollapsed && (
                  <span className="w-1.5 h-5 bg-white rounded-full shadow-sm"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center space-x-2.5">
                <div className="relative flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-emerald-300 font-bold text-xs tracking-wider uppercase">
                  MONITOR ACTIVE
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                v2.4
              </span>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
