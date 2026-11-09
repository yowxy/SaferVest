// SAFER-Vest Command Monitoring Unit - Type Definitions

export type ResponderStatus = 'NORMAL' | 'WARNING' | 'EMERGENCY' | 'OFFLINE';
export type ActivityStatus = 'MOVING' | 'IDLE' | 'NO_MOTION' | 'FALL_DETECTED' | 'UNKNOWN';
export type HeartRateStatus = 'NORMAL' | 'ELEVATED' | 'CRITICAL';
export type CommunicationStatus = 'CONNECTED' | 'WEAK' | 'DISCONNECTED';
export type SystemStatus = 'OPERATIONAL' | 'WARNING' | 'OFFLINE';
export type EventType = 'EMERGENCY' | 'WARNING' | 'SYSTEM' | 'COMMUNICATION' | 'INFO';
export type EmergencyTrigger = 'MANUAL_SOS' | 'NO_MOTION' | 'ABNORMAL_HEART_RATE' | 'FALL_DETECTION' | 'COMMUNICATION_LOST';

export interface GPSData {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: string;
}

export interface HeartRateData {
  current: number;
  average: number;
  min: number;
  max: number;
  status: HeartRateStatus;
  history: { time: string; bpm: number }[];
}

export interface IMUData {
  activity: ActivityStatus;
  acceleration?: { x: number; y: number; z: number };
  motionState: 'ACTIVE' | 'STATIONARY';
  lastMovement: string;
  motionDuration: number; // in seconds
}

export interface LoRaData {
  rssi: number | null; // Signal strength in dBm
  snr: number | null; // Signal-to-noise ratio
  packetLoss: number; // Percentage
  lastPacket: string;
  latency: number; // in milliseconds
  status: CommunicationStatus;
}

export interface BatteryData {
  percentage: number;
  voltage: number;
  estimatedRemaining: string; // e.g., "2h 15m"
}

export interface Responder {
  id: string; // e.g., "RESP-001"
  name: string;
  status: ResponderStatus;
  gps: GPSData;
  heartRate: HeartRateData;
  imu: IMUData;
  lora: LoRaData;
  battery: BatteryData;
  sosActive: boolean;
  lastUpdate: string;
  connectionDuration: string;
  lastSOS?: string;
}

export interface EmergencyEvent {
  id: string;
  responderId: string;
  responderName: string;
  type: 'ACTIVE' | 'WARNING' | 'RESOLVED';
  trigger: EmergencyTrigger;
  timestamp: string;
  location: GPSData;
  heartRate: number;
  activity: ActivityStatus;
  acknowledged: boolean;
  resolvedAt?: string;
  notes?: string;
}

export interface SystemHealth {
  loraGateway: SystemStatus;
  esp32Gateway: SystemStatus;
  gpsService: SystemStatus;
  dataStream: SystemStatus;
  dashboard: SystemStatus;
}

export interface EventLog {
  id: string;
  timestamp: string;
  type: EventType;
  message: string;
  responderId?: string;
  icon: string;
}

export interface DashboardStats {
  totalResponders: number;
  onlineResponders: number;
  normalCount: number;
  warningCount: number;
  emergencyCount: number;
  offlineCount: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  trigger: () => void;
}

export interface NotificationItem {
  id: string;
  type: EventType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  responderId?: string;
}

export interface DashboardSummary {
  total: number;
  online: number;
  normal: number;
  warning: number;
  emergency: number;
  offline: number;
}

