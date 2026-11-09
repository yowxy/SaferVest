import { useEffect, useState } from 'react';
import { Bell, Radio, Users, AlertTriangle } from 'lucide-react';
import { DashboardSummary } from '../types';

interface HeaderProps {
  title: string;
  summary: DashboardSummary;
  hasEmergency: boolean;
  loraStatus: 'CONNECTED' | 'DISCONNECTED';
  onNotificationClick: () => void;
}

export const Header = ({
  title,
  summary,
  hasEmergency,
  loraStatus,
  onNotificationClick,
}: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-dark-900 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title and Emergency Alert */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {hasEmergency && (
            <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500 px-3 py-1.5 rounded-lg animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-500">
                EMERGENCY ACTIVE
              </span>
            </div>
          )}
        </div>

        {/* Right: Status and Time */}
        <div className="flex items-center space-x-6">
          {/* System Status */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-400">SYSTEM ONLINE</span>
          </div>

          {/* LoRa Gateway Status */}
          <div className="flex items-center space-x-2 text-sm">
            <Radio
              className={`w-4 h-4 ${
                loraStatus === 'CONNECTED' ? 'text-green-500' : 'text-red-500'
              }`}
            />
            <span className="text-gray-400">
              LoRa Gateway: {loraStatus}
            </span>
          </div>

          {/* Responders Online */}
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="text-gray-400">
              {summary.online} Responders Online
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-dark-700"></div>

          {/* Time and Date */}
          <div className="text-right">
            <div className="text-2xl font-bold text-white tabular-nums">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-gray-400">{formatDate(currentTime)}</div>
          </div>

          {/* Notification Button */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-dark-800 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            {hasEmergency && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Operator Avatar */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-white">Operator</div>
              <div className="text-xs text-gray-400">Command Center</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">OP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
