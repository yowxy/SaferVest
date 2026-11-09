# MapView Component

Interactive GPS tracking map component for SAFER-Vest Command Monitoring Unit using Leaflet and React-Leaflet.

## Features

✅ **Interactive Leaflet Map**
- Dark theme with CartoDB dark tiles
- OpenStreetMap data
- Smooth pan and zoom controls
- Auto-fit bounds to show all responders

✅ **Color-Coded Status Markers**
- 🟢 Green: NORMAL status
- 🟡 Yellow: WARNING status  
- 🔴 Red: EMERGENCY status (with pulse animation)
- ⚪ Gray: OFFLINE status

✅ **Rich Popup Information**
Each marker shows detailed responder data:
- Responder ID and Name
- GPS coordinates (Lat/Lng/Altitude)
- Heart Rate with status indicator
- Activity status
- Battery percentage
- Signal strength (RSSI)
- Last update timestamp
- SOS active indicator

✅ **Emergency Pulse Animation**
Emergency markers have CSS keyframe pulse animation for high visibility

✅ **Map Controls**
- Zoom in/out buttons
- Center all markers (fit bounds)
- Custom styled controls matching dark theme

✅ **Real-time Updates**
- Subscribe to simulationService for live data
- Automatic marker updates every 3 seconds
- Maintains map state during updates

✅ **Status Legend**
Visual legend showing all status colors and meanings

✅ **Active Responder Counter**
Badge showing online vs total responders

## Installation

The component uses these dependencies (already in package.json):

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "@types/leaflet": "^1.9.22",
    "react-leaflet": "^5.0.0"
  }
}
```

Leaflet CSS is imported directly in the component.

## Usage

### Basic Usage

```tsx
import MapView from './components/MapView';
import type { Responder } from './types';

function App() {
  const responders: Responder[] = [
    // Your responder data
  ];

  return (
    <div className="h-screen">
      <MapView responders={responders} />
    </div>
  );
}
```

### With simulationService (Recommended)

```tsx
import React, { useEffect, useState } from 'react';
import MapView from './components/MapView';
import { simulationService } from './services/simulationService';
import type { Responder } from './types';

function LiveTracking() {
  const [responders, setResponders] = useState<Responder[]>([]);

  useEffect(() => {
    // Load initial data
    setResponders(simulationService.getResponders());

    // Subscribe to real-time updates
    const unsubscribe = simulationService.subscribe(() => {
      setResponders(simulationService.getResponders());
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen">
      <MapView responders={responders} />
    </div>
  );
}
```

### With Layout Components

```tsx
import { Layout } from './components/layout';
import MapView from './components/MapView';
import { useResponders } from './hooks/useResponders';

function TrackingPage() {
  const responders = useResponders();

  return (
    <Layout
      pageTitle="Live GPS Tracking"
      systemOnline={true}
      loraOnline={true}
      respondersOnline={responders.filter(r => r.status !== 'OFFLINE').length}
      notificationCount={5}
      hasEmergency={responders.some(r => r.status === 'EMERGENCY')}
    >
      <div className="h-full">
        <MapView responders={responders} />
      </div>
    </Layout>
  );
}
```

## Props

### MapView

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `responders` | `Responder[]` | Yes | Array of responder objects with GPS data |

### Responder Type

```typescript
interface Responder {
  id: string;                    // e.g., "RESP-001"
  name: string;                  // Responder name
  status: ResponderStatus;       // NORMAL, WARNING, EMERGENCY, OFFLINE
  gps: GPSData;                  // Location data
  heartRate: HeartRateData;      // Heart rate info
  imu: IMUData;                  // Activity data
  lora: LoRaData;                // Communication status
  battery: BatteryData;          // Battery info
  sosActive: boolean;            // SOS button pressed
  lastUpdate: string;            // ISO timestamp
  connectionDuration: string;    // e.g., "2h 15m"
}
```

## Styling

The component uses:
- **Dark Theme**: Consistent with SAFER-Vest dark command center UI
- **Tailwind CSS**: For styling controls and overlays
- **Custom CSS**: For Leaflet popup theming and pulse animations
- **CartoDB Dark Tiles**: For dark map background

### Key Style Classes

```css
/* Emergency pulse animation */
@keyframes pulse-scale {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

/* Dark popup styling */
.leaflet-popup-content-wrapper {
  background-color: #1f2937 !important;
  color: white !important;
}
```

## Map Tiles

Uses CartoDB Dark theme with OpenStreetMap data:
```
https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```

Alternative dark tiles you can use:
- **Stamen Toner**: `https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png`
- **OpenStreetMap**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` (light theme)

## Features Breakdown

### Color-Coded Markers

Each responder status has a unique color:
```typescript
const getMarkerColor = (status: ResponderStatus): string => {
  switch (status) {
    case 'NORMAL': return '#10b981';      // Green
    case 'WARNING': return '#f59e0b';     // Yellow
    case 'EMERGENCY': return '#ef4444';   // Red
    case 'OFFLINE': return '#6b7280';     // Gray
  }
};
```

### Emergency Pulse Animation

Emergency markers pulse continuously:
```typescript
const isPulsing = responder.status === 'EMERGENCY' || responder.sosActive;
const icon = createCustomIcon(markerColor, isPulsing);
```

### Auto-Fit Bounds

On initial load, the map automatically fits all markers:
```typescript
const bounds = L.latLngBounds(
  responders.map(r => [r.gps.latitude, r.gps.longitude])
);
map.fitBounds(bounds, { padding: [50, 50] });
```

### Custom Controls

Three custom control buttons:
1. **Zoom In** (+)
2. **Zoom Out** (-)
3. **Fit All** (center all markers)

### Rich Popups

Clicking a marker shows:
- **Header**: Responder ID, Name, Status
- **Location**: Lat/Lng/Altitude with 5 decimal precision
- **Vitals**: Heart rate (color-coded) and activity
- **Communication**: Battery % and RSSI signal strength
- **Timestamp**: Last update time
- **SOS Alert**: Red banner if SOS is active

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (requires polyfills)

## Performance

- Updates every 3 seconds via simulationService
- Efficient marker re-rendering with React keys
- Lazy popup rendering (only when clicked)
- Optimized for 5-20 concurrent responders

## Troubleshooting

### Markers not showing

Ensure responders have valid GPS data:
```typescript
responder.gps.latitude && responder.gps.longitude
```

### Map not loading

Check that Leaflet CSS is imported:
```typescript
import 'leaflet/dist/leaflet.css';
```

### Icon not appearing

The component fixes Leaflet's bundler icon issue automatically. If icons still don't show, check network for:
```
https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png
```

### Dark theme not applied

Ensure CartoDB tiles URL is correct and network allows external tile requests.

## Example: Custom Hook

Create a custom hook for cleaner code:

```typescript
// hooks/useResponders.ts
import { useState, useEffect } from 'react';
import { simulationService } from '../services/simulationService';
import type { Responder } from '../types';

export const useResponders = (): Responder[] => {
  const [responders, setResponders] = useState<Responder[]>([]);

  useEffect(() => {
    setResponders(simulationService.getResponders());
    const unsubscribe = simulationService.subscribe(() => {
      setResponders(simulationService.getResponders());
    });
    return unsubscribe;
  }, []);

  return responders;
};
```

Usage:
```typescript
import { useResponders } from './hooks/useResponders';
import MapView from './components/MapView';

function App() {
  const responders = useResponders();
  return <MapView responders={responders} />;
}
```

## Future Enhancements

Potential features to add:
- [ ] Marker clustering for large datasets
- [ ] Route history/trails
- [ ] Heatmap overlay
- [ ] Custom map overlays (buildings, zones)
- [ ] Click-to-select responder
- [ ] Filter markers by status
- [ ] Search/locate specific responder
- [ ] Export map as image
- [ ] Geofencing zones

## Related Components

- **Layout Components**: Sidebar, Header for full dashboard
- **ResponderCard**: Detailed responder information panel
- **EmergencyAlert**: Alert system for emergencies

## License

Part of SAFER-Vest Command Monitoring Unit project.
