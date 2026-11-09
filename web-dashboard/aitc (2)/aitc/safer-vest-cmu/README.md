# SAFER-Vest Command Monitoring Unit (CMU) Dashboard

**Smart Alert for Emergency Responder Vest - Command Monitoring System**

A professional, real-time monitoring dashboard for tracking and managing emergency responders during Search and Rescue (SAR) operations. This system provides command center operators with live GPS tracking, vital signs monitoring, emergency alerts, and communication status for multiple responders in the field.

![Dashboard Preview](https://img.shields.io/badge/Status-Demo-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 System Overview

### Architecture

```
Responder Tracking Unit (RTU)
├── GPS Module
├── IMU Sensor (Motion/Fall Detection)
├── MAX30102 (Heart Rate Sensor)
├── RTC (Real-Time Clock)
├── Battery Monitoring
├── SOS Button
├── ESP32 Microcontroller
└── LoRa Transceiver
      ↓
Command Monitoring Unit (CMU)
├── LoRa Gateway Receiver
├── ESP32 Gateway
└── Dashboard Web Application ← (This Project)
```

### Key Features

- ✅ **Live GPS Tracking** - Real-time location monitoring with interactive map
- ✅ **Vital Signs Monitoring** - Heart rate tracking and physiological status
- ✅ **Activity Detection** - Motion state, fall detection, no-motion alerts
- ✅ **Emergency Alert System** - SOS button, automatic emergency detection
- ✅ **Multi-Responder Support** - Monitor up to 5+ responders simultaneously
- ✅ **LoRa Communication Monitoring** - Signal strength, packet loss, latency
- ✅ **Event Logging** - Comprehensive timeline of all system events
- ✅ **Intelligent Status System** - Automatic condition evaluation
- ✅ **System Health Monitoring** - Gateway status, service availability
- ✅ **Simulation Mode** - Test emergency scenarios and system responses
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✅ **Dark Command Center Theme** - Professional emergency response UI

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Navigate to project directory
cd safer-vest-cmu

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
safer-vest-cmu/
├── src/
│   ├── components/           # React components
│   │   ├── layout/          # Sidebar, Header, Layout
│   │   ├── StatsCards.tsx   # Summary statistics cards
│   │   ├── MapView.tsx      # GPS tracking map
│   │   ├── ResponderPanel.tsx    # Responder status cards
│   │   ├── HeartRateChart.tsx    # Heart rate visualization
│   │   ├── EventLog.tsx     # Real-time event logging
│   │   ├── SystemHealth.tsx # System status panel
│   │   ├── SimulationControls.tsx  # Scenario testing
│   │   └── EmergencyAlert.tsx      # Emergency notifications
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Main dashboard page
│   │   └── EmergencyCenter.tsx     # Emergency management
│   ├── services/            # Business logic
│   │   └── SimulationService.ts    # Data simulation & management
│   ├── hooks/               # Custom React hooks
│   │   └── useSimulation.ts # Simulation state hook
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

---

## 🎮 Using the Dashboard

### Main Dashboard

The main dashboard provides an at-a-glance view of all responders:

1. **Summary Cards** - Quick stats: Total, Online, Normal, Warning, Emergency, Offline
2. **GPS Map** - Live location tracking with color-coded status markers
3. **Responder Cards** - Detailed status for each responder
4. **Heart Rate Chart** - Real-time physiological monitoring
5. **Event Log** - Chronological system events
6. **System Health** - Gateway and service status

### Emergency Center

Dedicated page for managing emergency events:

- View active emergencies, warnings, and resolved events
- Acknowledge alerts
- Resolve emergencies with notes
- Quick access to location and responder details
- Filter by event type and status

### Simulation Mode

Test the system with various emergency scenarios:

1. **Select a Responder** - Choose which responder to simulate
2. **Choose Scenario**:
   - **Normal** - Reset to normal operational state
   - **Warning** - Elevated heart rate + no motion
   - **SOS Emergency** - Manual emergency button pressed
   - **No Motion** - Responder has not moved for extended period
   - **High Heart Rate** - Abnormal heart rate detected
   - **Fall Detection** - Fall detected by IMU
   - **Weak Signal** - Poor LoRa communication
   - **Comm Lost** - Complete communication failure
3. **Observe Changes** - All dashboard components update in real-time
4. **Reset Simulation** - Restore to initial state

---

## 📊 Status Indicators

### Responder Status

| Status | Color | Condition |
|--------|-------|-----------|
| **NORMAL** | 🟢 Green | All parameters within normal range |
| **WARNING** | 🟡 Yellow | Elevated heart rate, weak signal, low battery |
| **EMERGENCY** | 🔴 Red | SOS active, fall detected, critical condition |
| **OFFLINE** | ⚫ Gray | Communication lost, disconnected |

### Communication Quality

| Signal | RSSI Range | Color |
|--------|------------|-------|
| **Excellent** | ≥ -70 dBm | 🟢 Green |
| **Good** | -70 to -85 dBm | 🔵 Blue |
| **Weak** | -85 to -95 dBm | 🟡 Yellow |
| **Poor** | < -95 dBm | 🔴 Red |

### Heart Rate Status

| Status | Condition | Color |
|--------|-----------|-------|
| **NORMAL** | 60-120 BPM at rest | 🟢 Green |
| **ELEVATED** | 120-150 BPM | 🟡 Yellow |
| **CRITICAL** | > 150 BPM | 🔴 Red |

> **Note**: Heart rate monitoring is for physiological indication only, not medical diagnosis.

---

## 🔧 Technology Stack

### Frontend Framework
- **React 18** - UI component library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Data Visualization
- **Recharts** - Heart rate and activity charts
- **Leaflet + React-Leaflet** - Interactive GPS mapping
- **OpenStreetMap** - Map tiles

### Routing & State
- **React Router DOM** - Client-side routing
- **Custom Hooks** - State management with React hooks

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🔌 Hardware Integration Guide

### Current State: Simulation Mode

This dashboard currently operates in **simulation mode** with generated dummy data. All data updates, scenarios, and events are simulated locally.

### Future: ESP32/LoRa Integration

The architecture is designed for easy integration with real hardware:

#### 1. Data Format

Responder units should send JSON data via LoRa:

```json
{
  "deviceId": "RESP-001",
  "timestamp": "2026-08-04T14:30:00Z",
  "gps": {
    "latitude": -7.27560,
    "longitude": 112.79470,
    "altitude": 12,
    "accuracy": 5
  },
  "heartRate": 82,
  "imu": {
    "activity": "MOVING",
    "acceleration": { "x": 0.2, "y": -0.1, "z": 9.8 }
  },
  "battery": {
    "percentage": 87,
    "voltage": 3.9
  },
  "lora": {
    "rssi": -72,
    "snr": 8
  },
  "sosActive": false
}
```

#### 2. Backend Options

Replace `SimulationService` with one of these backends:

**Option A: WebSocket Server**
```typescript
// Replace in useSimulation.ts
const ws = new WebSocket('ws://gateway-ip:8080');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateResponderData(data);
};
```

**Option B: MQTT Broker**
```typescript
import mqtt from 'mqtt';
const client = mqtt.connect('mqtt://broker-ip:1883');
client.subscribe('safer-vest/responders/#');
client.on('message', (topic, payload) => {
  const data = JSON.parse(payload.toString());
  updateResponderData(data);
});
```

**Option C: REST API Polling**
```typescript
setInterval(async () => {
  const response = await fetch('http://gateway-ip/api/responders');
  const data = await response.json();
  updateAllResponders(data);
}, 3000);
```

#### 3. Gateway Setup

**ESP32 Gateway Requirements:**
- LoRa receiver module (SX1276/SX1278)
- WiFi or Ethernet connection
- HTTP/WebSocket/MQTT server capability
- Data buffering for reliability

**Recommended ESP32 Libraries:**
- `LoRa.h` - LoRa communication
- `WiFi.h` or `ETH.h` - Network connectivity
- `AsyncWebSocket.h` or `PubSubClient.h` - Data transmission
- `ArduinoJson.h` - JSON serialization

#### 4. Integration Steps

1. **Deploy Dashboard** - Host on web server or local network
2. **Setup ESP32 Gateway** - Configure LoRa receiver and network
3. **Replace SimulationService** - Implement real data service
4. **Test Communication** - Verify data flow end-to-end
5. **Configure Thresholds** - Adjust alert thresholds for real environment
6. **Deploy to Field** - Full system operational testing

---

## ⚙️ Configuration

### Responder Thresholds

Edit `src/services/SimulationService.ts`:

```typescript
// Heart rate thresholds
const HR_NORMAL_MAX = 120;
const HR_ELEVATED_MAX = 150;

// Motion timeout (seconds)
const NO_MOTION_WARNING = 180;

// Battery warning level
const BATTERY_WARNING = 20;

// Signal quality thresholds (dBm)
const RSSI_EXCELLENT = -70;
const RSSI_GOOD = -85;
const RSSI_WEAK = -95;
```

### Map Configuration

Edit `src/components/MapView.tsx`:

```typescript
// Default map center
const defaultCenter: [number, number] = [-7.2756, 112.7947]; // Surabaya

// Map tile provider (can switch to satellite, dark mode, etc.)
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
```

---

## 🧪 Testing Scenarios

### Scenario 1: Normal Operation
- All responders showing NORMAL status
- Heart rates within 60-120 BPM range
- All moving or with recent activity
- Good LoRa signal strength
- Battery levels healthy

### Scenario 2: High Activity
- Responder showing elevated heart rate (120-150 BPM)
- Active movement status
- Should show WARNING if heart rate sustained

### Scenario 3: Emergency - Manual SOS
1. Select responder
2. Click "SOS Emergency"
3. **Expected**: Status → EMERGENCY, Alert appears, Map marker pulses red

### Scenario 4: Emergency - Fall Detection
1. Select responder
2. Click "Fall Detection"
3. **Expected**: Activity → FALL_DETECTED, Emergency event created

### Scenario 5: Warning - No Motion
1. Select responder
2. Click "No Motion"
3. **Expected**: Activity → NO_MOTION, Status → WARNING if heart rate elevated

### Scenario 6: Communication Issues
1. Select responder
2. Click "Comm Lost"
3. **Expected**: Status → OFFLINE, RSSI → null, Event logged

---

## 🛠️ Development

### Adding New Features

1. **New Component**:
   ```bash
   # Create in src/components/
   touch src/components/NewFeature.tsx
   ```

2. **New Page**:
   ```bash
   # Create in src/pages/
   touch src/pages/NewPage.tsx
   # Add route in App.tsx
   ```

3. **New Data Type**:
   ```typescript
   // Add to src/types/index.ts
   export interface NewDataType {
     // ...
   }
   ```

### Code Style

- Use TypeScript strict mode
- Follow React hooks best practices
- Use Tailwind utility classes
- Keep components modular and reusable
- Document complex logic with comments

---

## 🐛 Troubleshooting

### Map not displaying
- Check that Leaflet CSS is imported in MapView.tsx
- Verify internet connection (for map tiles)
- Check browser console for errors

### Data not updating
- Verify SimulationService interval is running
- Check React component is subscribed to updates
- Inspect useSimulation hook in component

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npx tsc --noEmit`

---

## 📄 License

MIT License - Free to use, modify, and distribute for research and commercial projects.

---

## 👥 Credits

**SAFER-Vest Project**
- System Architecture & Development
- Emergency Response UI/UX Design
- IoT Integration Planning

**Technologies Used**:
- React ecosystem
- Leaflet mapping library
- Recharts visualization
- Tailwind CSS framework

---

## 🔮 Future Enhancements

- [ ] Audio/Visual alarm for emergencies
- [ ] Multi-language support
- [ ] Historical data playback
- [ ] Route planning and waypoints
- [ ] Team/Group management
- [ ] Export reports (PDF, CSV)
- [ ] Mobile companion app
- [ ] Offline mode support
- [ ] Advanced analytics dashboard
- [ ] Integration with external emergency services

---

## 📞 Support

For questions, issues, or contributions:
- Open an issue on the repository
- Contact the development team
- Review the documentation

---

**Last Updated**: August 2026
**Version**: 1.0.0
**Status**: Simulation/Demo Mode (Ready for Hardware Integration)
