import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title: string;
  onlineCount: number;
  emergencyCount: number;
  loraConnected: boolean;
  onNotificationClick?: () => void;
  unreadNotifications?: number;
}

export default function Layout({
  children,
  title,
  onlineCount,
  emergencyCount,
  loraConnected,
  onNotificationClick,
  unreadNotifications
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          onlineCount={onlineCount}
          emergencyCount={emergencyCount}
          loraConnected={loraConnected}
          onNotificationClick={onNotificationClick}
          unreadNotifications={unreadNotifications}
        />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="p-6 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
