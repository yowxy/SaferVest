// SAFER-Vest Simulation Service
// Generates realistic dummy data and simulates real-time changes

import type {
  Responder,
  ResponderStatus,
  EmergencyEvent,
  EventLog,
  SystemHealth,
  NotificationItem,
  EventType
} from '../types';

class SimulationService {
  private responders: Map<string, Responder> = new Map();
  private emergencyEvents: EmergencyEvent[] = [];
  private eventLogs: EventLog[] = [];
  private notifications: NotificationItem[] = [];
  private listeners: Set<() => void> = new Set();
  private intervalId: number | null = null;
  private eventIdCounter = 1;
  private logIdCounter = 1;
  private notificationIdCounter = 1;

  constructor() {
    this.initializeResponders();
    this.startSimulation();
  }

  private initializeResponders() {
    const initialData: Omit<Responder, 'id' | 'name'>[] = [
      {
        status: 'NORMAL',
        gps: { latitude: -7.27560, longitude: 112.79470, altitude: 12, accuracy: 5, timestamp: new Date().toISOString() },
        heartRate: { current: 82, average: 80, min: 72, max: 95, status: 'NORMAL', history: this.generateHeartRateHistory(82) },
        imu: { activity: 'MOVING', motionState: 'ACTIVE', lastMovement: new Date().toISOString(), motionDuration: 0 },
        lora: { rssi: -72, snr: 8, packetLoss: 0, lastPacket: new Date().toISOString(), latency: 45, status: 'CONNECTED' },
        battery: { percentage: 87, voltage: 3.9, estimatedRemaining: '4h 30m' },
        sosActive: false,
        lastUpdate: new Date().toISOString(),
        connectionDuration: '2h 15m'
      },
      {
        status: 'NORMAL',
        gps: { latitude: -7.27620, longitude: 112.79530, altitude: 15, accuracy: 4, timestamp: new Date().toISOString() },
        heartRate: { current: 96, average: 92, min: 78, max: 110, status: 'NORMAL', history: this.generateHeartRateHistory(96) },
        imu: { activity: 'MOVING', motionState: 'ACTIVE', lastMovement: new Date().toISOString(), motionDuration: 0 },
        lora: { rssi: -78, snr: 6, packetLoss: 1, lastPacket: new Date().toISOString(), latency: 52, status: 'CONNECTED' },
        battery: { percentage: 79, voltage: 3.8, estimatedRemaining: '3h 45m' },
        sosActive: false,
        lastUpdate: new Date().toISOString(),
        connectionDuration: '2h 10m'
      },
      {
        status: 'WARNING',
        gps: { latitude: -7.27680, longitude: 112.79600, altitude: 18, accuracy: 6, timestamp: new Date().toISOString() },
        heartRate: { current: 128, average: 115, min: 85, max: 135, status: 'ELEVATED', history: this.generateHeartRateHistory(128) },
        imu: { activity: 'NO_MOTION', motionState: 'STATIONARY', lastMovement: new Date(Date.now() - 120000).toISOString(), motionDuration: 120 },
        lora: { rssi: -87, snr: 4, packetLoss: 3, lastPacket: new Date().toISOString(), latency: 68, status: 'WEAK' },
        battery: { percentage: 72, voltage: 3.7, estimatedRemaining: '3h 10m' },
        sosActive: false,
        lastUpdate: new Date().toISOString(),
        connectionDuration: '1h 55m'
      },
      {
        status: 'NORMAL',
        gps: { latitude: -7.27740, longitude: 112.79670, altitude: 20, accuracy: 5, timestamp: new Date().toISOString() },
        heartRate: { current: 110, average: 105, min: 90, max: 125, status: 'NORMAL', history: this.generateHeartRateHistory(110) },
        imu: { activity: 'MOVING', motionState: 'ACTIVE', lastMovement: new Date().toISOString(), motionDuration: 0 },
        lora: { rssi: -91, snr: 3, packetLoss: 5, lastPacket: new Date().toISOString(), latency: 75, status: 'WEAK' },
        battery: { percentage: 64, voltage: 3.6, estimatedRemaining: '2h 40m' },
        sosActive: false,
        lastUpdate: new Date().toISOString(),
        connectionDuration: '1h 45m'
      },
      {
        status: 'OFFLINE',
        gps: { latitude: -7.27800, longitude: 112.79740, altitude: 22, accuracy: 10, timestamp: new Date(Date.now() - 300000).toISOString() },
        heartRate: { current: 0, average: 88, min: 75, max: 102, status: 'NORMAL', history: this.generateHeartRateHistory(0) },
        imu: { activity: 'UNKNOWN', motionState: 'STATIONARY', lastMovement: new Date(Date.now() - 300000).toISOString(), motionDuration: 300 },
        lora: { rssi: null, snr: null, packetLoss: 100, lastPacket: new Date(Date.now() - 300000).toISOString(), latency: 0, status: 'DISCONNECTED' },
        battery: { percentage: 45, voltage: 3.4, estimatedRemaining: '1h 50m' },
        sosActive: false,
        lastUpdate: new Date(Date.now() - 300000).toISOString(),
        connectionDuration: '1h 30m'
      }
    ];

    const names = ['Ahmad Syahputra', 'Budi Santoso', 'Citra Dewi', 'Dimas Pratama', 'Eka Wijaya'];

    initialData.forEach((data, index) => {
      const id = `RESP-${String(index + 1).padStart(3, '0')}`;
      this.responders.set(id, {
        id,
        name: names[index],
        ...data
      });
    });

    // Add initial event logs
    this.addEventLog('SYSTEM', 'System initialized successfully', 'system');
    this.addEventLog('INFO', 'All responder units connected', 'check-circle');
    this.addEventLog('WARNING', 'No motion detected on RESP-003', 'alert-triangle', 'RESP-003');
  }

  private generateHeartRateHistory(currentBpm: number): { time: string; bpm: number }[] {
    const history: { time: string; bpm: number }[] = [];
    const now = Date.now();
    
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now - i * 5000).toISOString();
      const variation = Math.random() * 10 - 5;
      const bpm = currentBpm > 0 ? Math.max(60, Math.min(180, currentBpm + variation)) : 0;
      history.push({ time, bpm });
    }
    
    return history;
  }

  private updateHeartRateHistory(responder: Responder) {
    const history = responder.heartRate.history;
    history.shift();
    history.push({
      time: new Date().toISOString(),
      bpm: responder.heartRate.current
    });
  }

  private startSimulation() {
    this.intervalId = window.setInterval(() => {
      this.updateResponderData();
      this.notifyListeners();
    }, 3000); // Update every 3 seconds
  }

  private updateResponderData() {
    this.responders.forEach((responder) => {
      if (responder.status === 'OFFLINE') return;

      // Update heart rate slightly
      const hrVariation = (Math.random() - 0.5) * 4;
      responder.heartRate.current = Math.max(60, Math.min(180, responder.heartRate.current + hrVariation));
      this.updateHeartRateHistory(responder);

      // Update GPS slightly (simulate movement)
      if (responder.imu.activity === 'MOVING') {
        responder.gps.latitude += (Math.random() - 0.5) * 0.0001;
        responder.gps.longitude += (Math.random() - 0.5) * 0.0001;
        responder.gps.timestamp = new Date().toISOString();
      }

      // Update battery
      if (Math.random() < 0.1) {
        responder.battery.percentage = Math.max(0, responder.battery.percentage - 1);
      }

      // Update RSSI
      if (responder.lora.rssi !== null) {
        responder.lora.rssi += (Math.random() - 0.5) * 2;
        responder.lora.rssi = Math.max(-120, Math.min(-50, responder.lora.rssi));
      }

      // Update last update timestamp
      responder.lastUpdate = new Date().toISOString();
      responder.lora.lastPacket = new Date().toISOString();

      // Update motion duration for stationary responders
      if (responder.imu.motionState === 'STATIONARY') {
        responder.imu.motionDuration += 3;
      }
    });
  }

  private calculateStatus(responder: Responder): ResponderStatus {
    if (responder.status === 'OFFLINE') return 'OFFLINE';
    if (responder.sosActive) return 'EMERGENCY';
    if (responder.imu.activity === 'FALL_DETECTED') return 'EMERGENCY';
    if (responder.imu.activity === 'NO_MOTION' && responder.heartRate.status === 'ELEVATED') return 'WARNING';
    if (responder.imu.activity === 'NO_MOTION' && responder.imu.motionDuration > 180) return 'WARNING';
    if (responder.heartRate.status === 'CRITICAL') return 'WARNING';
    if (responder.lora.status === 'WEAK') return 'WARNING';
    if (responder.battery.percentage < 20) return 'WARNING';
    return 'NORMAL';
  }

  private addEventLog(type: EventType, message: string, icon: string, responderId?: string) {
    const log: EventLog = {
      id: `LOG-${this.logIdCounter++}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      icon,
      responderId
    };
    this.eventLogs.unshift(log);
    if (this.eventLogs.length > 100) {
      this.eventLogs = this.eventLogs.slice(0, 100);
    }
  }

  private addNotification(type: EventType, title: string, message: string, responderId?: string) {
    const notification: NotificationItem = {
      id: `NOTIF-${this.notificationIdCounter++}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      responderId
    };
    this.notifications.unshift(notification);
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
  }

  // Public API
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  getResponders(): Responder[] {
    return Array.from(this.responders.values());
  }

  getResponder(id: string): Responder | undefined {
    return this.responders.get(id);
  }

  getEmergencyEvents(): EmergencyEvent[] {
    return this.emergencyEvents;
  }

  getEventLogs(): EventLog[] {
    return this.eventLogs;
  }

  getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  getSystemHealth(): SystemHealth {
    const offlineCount = Array.from(this.responders.values()).filter(r => r.status === 'OFFLINE').length;
    const totalCount = this.responders.size;
    
    return {
      loraGateway: offlineCount > totalCount / 2 ? 'WARNING' : 'OPERATIONAL',
      esp32Gateway: 'OPERATIONAL',
      gpsService: 'OPERATIONAL',
      dataStream: 'OPERATIONAL',
      dashboard: 'OPERATIONAL'
    };
  }

  markNotificationRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Simulation Scenarios
  simulateNormal(responderId: string) {
    const responder = this.responders.get(responderId);
    if (!responder) return;

    responder.status = 'NORMAL';
    responder.sosActive = false;
    responder.heartRate.current = 82;
    responder.heartRate.status = 'NORMAL';
    responder.imu.activity = 'MOVING';
    responder.imu.motionState = 'ACTIVE';
    responder.imu.lastMovement = new Date().toISOString();
    responder.imu.motionDuration = 0;
    responder.lora.status = 'CONNECTED';
    responder.lora.rssi = -72;

    this.addEventLog('INFO', `${responderId} status returned to normal`, 'check-circle', responderId);
    this.removeEmergencyEvent(responderId);
    this.notifyListeners();
  }

  simulateWarning(responderId: string) {
    const responder = this.responders.get(responderId);
    if (!responder) return;

    responder.status = 'WARNING';
    responder.heartRate.current = 128;
    responder.heartRate.status = 'ELEVATED';
    responder.imu.activity = 'NO_MOTION';
    responder.imu.motionState = 'STATIONARY';
    responder.imu.motionDuration = 120;

    this.addEventLog('WARNING', `${responderId} elevated heart rate detected`, 'alert-triangle', responderId);
    this.addNotification('WARNING', 'Warning Condition', `${responder.name} showing elevated heart rate`, responderId);
    this.notifyListeners();
  }

  simulateSOS(responderId: string) {
    const responder = this.responders.get(responderId);
    if (!responder) return;

    responder.sosActive = true;
    responder.status = 'EMERGENCY';
    responder.lastSOS = new Date().toISOString();

    const event: EmergencyEvent = {
      id: `EMG-${this.eventIdCounter++}`,
      responderId,
      responderName: responder.name,
      type: 'ACTIVE',
      trigger: 'MANUAL_SOS',
      timestamp: new Date().toISOString(),
      location: { ...responder.gps },
      heartRate: responder.heartRate.current,
      activity: responder.imu.activity,
      acknowledged: false
    };

    this.emergencyEvents.unshift(event);
    this.addEventLog('EMERGENCY', `🚨 SOS received from ${responderId}`, 'alert-octagon', responderId);
    this.addNotification('EMERGENCY', 'EMERGENCY ALERT', `${responder.name} requested assistance`, responderId);
    this.notifyListeners();
  }

  simulateNoMotion(responderId: string) {
    const responder = this.responders.get(responderId);
    if (!responder) return;

    responder.imu.activity = 'NO_MOTION';
    responder.imu.motionState = 'STATIONARY';
    responder.imu.motionDuration = 180;
    responder.status = this.calculateStatus(responder);

    this.addEventLog('WARNING', `No motion detected on ${responderId}`, 'alert-triangle', responderId);
    this.addNotification('WARNING', 'No Motion Detected', `${responder.name} has not moved for 3 minutes`, responderId);
    this.notifyListeners();
  }

  simulateHighHeartRate(responderId: string) {
    const responder = this.responders.get(responderId);
    if (!responder) return;

    responder.heartRate.current = 155;
    responder.heartRate.status = 'CRITICAL';
    responder.status = this.calculateStatus(responder);

    this.addEventLog('WARNING', `High heart rate detected on ${responderId}`, 'activity', responderId);
    this.addNotification('WARNING', 'High Heart Rate', `${responder.name} heart rate: ${responder.heartRate.current} BPM`, responderId);
    this.notifyListeners();
  }

  simulateFallDetection(responderId: string) {
    const responder = this.responders.get(responderId);
    if (!responder) return;

    responder.imu.activity = 'FALL_DETECTED';
    responder.imu.motionState = 'STATIONARY';
    responder.status = 'EMERGENCY';

    const event: EmergencyEvent = {
      id: `EMG-${this.eventIdCounter++}`,
      responderId,
      responderName: responder.name,
      type: 'ACTIVE',
      trigger: 'FALL_DETECTION',
      timestamp: new Date().toISOString(),
      location: { ...responder.gps },
      heartRate: responder.heartRate.current,
      activity: responder.imu.activity,
      acknowledged: false
    };

    this.emergencyEvents.unshift(event);
    this.addEventLog('EMERGENCY', `⚠ Fall detected on ${responderId}`, 'alert-octagon', responderId);
    this.addNotification('EMERGENCY', 'FALL DETECTED', `${responder.name} may have fallen`, responderId);
    this.notifyListeners();
  }

  simulateWeakSignal(responderId: string) {
    const responder = this.responders.get(responderId);
    if (!responder) return;

    responder.lora.rssi = -95;
    responder.lora.snr = 2;
    responder.lora.status = 'WEAK';
    responder.lora.packetLoss = 15;
    responder.status = this.calculateStatus(responder);

    this.addEventLog('WARNING', `Weak LoRa signal from ${responderId}`, 'wifi-off', responderId);
    this.notifyListeners();
  }

  simulateCommunicationLost(responderId: string) {
    const responder = this.responders.get(responderId);
    if (!responder) return;

    responder.status = 'OFFLINE';
    responder.lora.rssi = null;
    responder.lora.snr = null;
    responder.lora.status = 'DISCONNECTED';
    responder.lora.packetLoss = 100;

    const event: EmergencyEvent = {
      id: `EMG-${this.eventIdCounter++}`,
      responderId,
      responderName: responder.name,
      type: 'WARNING',
      trigger: 'COMMUNICATION_LOST',
      timestamp: new Date().toISOString(),
      location: { ...responder.gps },
      heartRate: responder.heartRate.current,
      activity: responder.imu.activity,
      acknowledged: false
    };

    this.emergencyEvents.unshift(event);
    this.addEventLog('WARNING', `Communication lost with ${responderId}`, 'wifi-off', responderId);
    this.addNotification('WARNING', 'Communication Lost', `Lost connection to ${responder.name}`, responderId);
    this.notifyListeners();
  }

  resetSimulation() {
    this.responders.clear();
    this.emergencyEvents = [];
    this.eventLogs = [];
    this.notifications = [];
    this.eventIdCounter = 1;
    this.logIdCounter = 1;
    this.notificationIdCounter = 1;
    this.initializeResponders();
    this.addEventLog('SYSTEM', 'Simulation reset completed', 'refresh-cw');
    this.notifyListeners();
  }

  acknowledgeEmergency(eventId: string) {
    const event = this.emergencyEvents.find(e => e.id === eventId);
    if (event) {
      event.acknowledged = true;
      this.addEventLog('SYSTEM', `Emergency ${eventId} acknowledged`, 'check', event.responderId);
      this.notifyListeners();
    }
  }

  resolveEmergency(eventId: string, notes?: string) {
    const event = this.emergencyEvents.find(e => e.id === eventId);
    if (event) {
      event.type = 'RESOLVED';
      event.resolvedAt = new Date().toISOString();
      event.notes = notes;
      
      const responder = this.responders.get(event.responderId);
      if (responder) {
        responder.sosActive = false;
        responder.status = 'NORMAL';
      }

      this.addEventLog('INFO', `Emergency ${eventId} resolved`, 'check-circle', event.responderId);
      this.notifyListeners();
    }
  }

  private removeEmergencyEvent(responderId: string) {
    this.emergencyEvents = this.emergencyEvents.filter(e => e.responderId !== responderId || e.type === 'RESOLVED');
  }

  destroy() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const simulationService = new SimulationService();
