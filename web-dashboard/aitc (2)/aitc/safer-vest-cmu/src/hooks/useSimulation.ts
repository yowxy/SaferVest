import { useState, useEffect } from 'react';
import { simulationService } from '../services/simulationService';
import type { Responder, EmergencyEvent, EventLog, SystemHealth, NotificationItem, DashboardStats } from '../types';

export function useSimulation() {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>([]);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    loraGateway: 'OPERATIONAL',
    esp32Gateway: 'OPERATIONAL',
    gpsService: 'OPERATIONAL',
    dataStream: 'OPERATIONAL',
    dashboard: 'OPERATIONAL'
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const updateData = () => {
      setResponders(simulationService.getResponders());
      setEmergencyEvents(simulationService.getEmergencyEvents());
      setEventLogs(simulationService.getEventLogs());
      setSystemHealth(simulationService.getSystemHealth());
      setNotifications(simulationService.getNotifications());
    };

    // Initial load
    updateData();

    // Subscribe to changes
    const unsubscribe = simulationService.subscribe(updateData);

    return () => {
      unsubscribe();
    };
  }, []);

  const stats: DashboardStats = {
    totalResponders: responders.length,
    onlineResponders: responders.filter(r => r.status !== 'OFFLINE').length,
    normalCount: responders.filter(r => r.status === 'NORMAL').length,
    warningCount: responders.filter(r => r.status === 'WARNING').length,
    emergencyCount: responders.filter(r => r.status === 'EMERGENCY').length,
    offlineCount: responders.filter(r => r.status === 'OFFLINE').length
  };

  return {
    responders,
    emergencyEvents,
    eventLogs,
    systemHealth,
    notifications,
    stats,
    simulationService
  };
}
