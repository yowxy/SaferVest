import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  AlertTriangle,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  systemStatus: 'ONLINE' | 'OFFLINE';
}

export const Sidebar = ({ systemStatus }: SidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/live-tracking', icon: MapPin, label: 'Live Tracking' },
    { path: '/responders', icon: Users, label: 'Responder Monitoring' },
    { path: '/emergency', icon: AlertTriangle, label: 'Emergency Center' },
    { path: '/logs', icon: FileText, label: 'Event Logs' },
    { path: '/system', icon: Activity, label: 'System Status' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      className={`bg-dark-900 border-r border-dark-700 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-dark-700">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SV</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">SAFER-Vest</h1>
              <p className="text-gray-400 text-xs">Command Monitoring</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-dark-800 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-dark-800 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-dark-700">
        <div
          className={`flex items-center space-x-3 px-3 py-2.5 bg-dark-800 rounded-lg ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              systemStatus === 'ONLINE'
                ? 'bg-green-500 animate-pulse'
                : 'bg-red-500'
            }`}
          ></div>
          {!collapsed && (
            <span className="text-sm font-medium text-gray-300">
              SYSTEM {systemStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
