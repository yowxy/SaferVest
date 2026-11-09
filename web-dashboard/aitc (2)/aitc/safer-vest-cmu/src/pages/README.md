# Dashboard Components

Dashboard page components for SAFER-Vest Command Monitoring Unit with real-time statistics and responder monitoring.

## Components

### StatsCards.tsx

Summary statistics cards component that displays key metrics in a responsive grid layout.

**Location:** `src/components/StatsCards.tsx`

**Features:**
- 6 stat cards: Total Responders, Online Responders, Normal, Warning, Emergency, Offline
- Color-coded status indicators
- Lucide-react icons
- Responsive grid layout (1-6 columns)
- Hover effects
- Dark theme styling

**Props:**
```typescript
interface StatsCardsProps {
  stats: DashboardStats;
}

interface DashboardStats {
  totalResponders: number;
  onlineResponders: number;
  normalCount: number;
  warningCount: number;
  emergencyCount: number;
  offlineCount: number;
}
```

**Usage:**
```tsx
import StatsCards from '../components/StatsCards';

const stats = {
  totalResponders: 5,
  onlineResponders: 4,
  normalCount: 2,
  warningCount: 1,
  emergencyCount: 0,
  offlineCount: 1,
};

<StatsCards stats={stats} />
```

**Color Scheme:**
- Total Responders: Blue (text-blue-400, bg-blue-500/10)
- Online Responders: Green (text-green-400, bg-green-500/10)
- Normal: Emerald (text-emerald-400, bg-emerald-500/10)
- Warning: Yellow (text-yellow-400, bg-yellow-500/10)
- Emergency: Red (text-red-400, bg-red-500/10)
- Offline: Gray (text-gray-400, bg-gray-500/10)

---

### Dashboard.tsx

Main dashboard page component with layout wrapper, stats cards, GPS map placeholder, and responder status panel.

**Location:** `src/pages/Dashboard.tsx`

**Features:**
- Layout wrapper integration
- Real-time statistics calculation
- SimulationService subscription for live updates
- GPS map placeholder (ready for map integration)
- Responder status panel with detailed information
- Responsive grid layout
- Auto-cleanup on unmount

**Data Flow:**
1. Subscribes to `simulationService` on mount
2. Receives responder updates every 3 seconds
3. Calculates statistics from responder data
4. Updates UI with new stats and responder info
5. Unsubscribes on unmount

**Statistics Calculation:**
```typescript
const calculateStats = (responderList: Responder[]): DashboardStats => {
  const total = responderList.length;
  const offline = responderList.filter(r => r.status === 'OFFLINE').length;
  const online = total - offline;
  const normal = responderList.filter(r => r.status === 'NORMAL').length;
  const warning = responderList.filter(r => r.status === 'WARNING').length;
  const emergency = responderList.filter(r => r.status === 'EMERGENCY').length;

  return {
    totalResponders: total,
    onlineResponders: online,
    normalCount: normal,
    warningCount: warning,
    emergencyCount: emergency,
    offlineCount: offline,
  };
};
```

**Layout Sections:**
1. **Stats Cards Row** - 6 summary statistics cards
2. **Main Grid** - Two-column layout (2/3 + 1/3 on large screens)
   - **GPS Map Section** (lg:col-span-2)
     - Header with MapPin icon and online count
     - Map placeholder with grid overlay effect
     - Sample GPS coordinates display
   - **Responder Status Panel** (lg:col-span-1)
     - List of all responders with status badges
     - ID, heart rate, battery, signal status
     - Color-coded status indicators

**Usage:**
```tsx
import { Dashboard } from './pages';

// In App.tsx or routing
<Route path="/dashboard" element={<Dashboard />} />
```

**Real-time Updates:**
```tsx
useEffect(() => {
  // Initial load
  const initialResponders = simulationService.getResponders();
  setResponders(initialResponders);
  setStats(calculateStats(initialResponders));

  // Subscribe to updates
  const unsubscribe = simulationService.subscribe(() => {
    const updatedResponders = simulationService.getResponders();
    setResponders(updatedResponders);
    setStats(calculateStats(updatedResponders));
  });

  // Cleanup
  return () => {
    unsubscribe();
  };
}, []);
```

---

## Integration

### App Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── index.ts
│   └── StatsCards.tsx
├── pages/
│   ├── Dashboard.tsx
│   └── index.ts
├── services/
│   └── SimulationService.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.ts
```

### Main Entry Point (main.ts)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Router Setup (App.tsx)

```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
```

---

## Responsive Design

### StatsCards Grid Breakpoints:
- **Mobile (default):** 1 column
- **sm (640px+):** 2 columns
- **lg (1024px+):** 3 columns
- **xl (1280px+):** 6 columns

### Dashboard Layout Breakpoints:
- **Mobile (default):** Single column, stacked layout
- **lg (1024px+):** 3-column grid
  - GPS Map: 2 columns (66%)
  - Status Panel: 1 column (33%)

---

## Placeholders

### GPS Map
Currently displays a placeholder with:
- Grid overlay visual effect
- Sample GPS coordinates for first 3 responders
- Ready for integration with Leaflet/React-Leaflet
- Height: 500px
- Background: dark-900 with dark-700 border

**Future Integration:**
```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Replace placeholder div with:
<MapContainer center={[centerLat, centerLng]} zoom={13} style={{ height: '500px' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {responders.map(responder => (
    <Marker key={responder.id} position={[responder.gps.latitude, responder.gps.longitude]}>
      <Popup>{responder.name}</Popup>
    </Marker>
  ))}
</MapContainer>
```

### Responder Status Panel
Currently displays:
- All responders with live status
- Detailed metrics (ID, HR, battery, signal)
- Ready for expansion with click interactions
- Hover effects for better UX

---

## Dependencies

Required packages (already in package.json):
```json
{
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-router-dom": "^7.18.2",
  "lucide-react": "^1.28.0",
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0"
}
```

---

## Styling

Uses Tailwind CSS with custom dark theme colors:
- dark-950: Darkest background
- dark-900: Panel backgrounds
- dark-800: Card backgrounds
- dark-700: Borders
- dark-600: Hover borders

All components follow the existing dark command center theme with:
- High contrast text
- Subtle hover effects
- Consistent border radius (rounded-lg)
- Status color coding
- Responsive spacing

---

## Testing the Dashboard

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Dashboard:**
   Open browser to `http://localhost:5173/dashboard`

3. **Observe Real-time Updates:**
   - Stats cards update every 3 seconds
   - Responder statuses change dynamically
   - Heart rates fluctuate
   - GPS coordinates update for moving responders

4. **Test Simulation Scenarios:**
   Open browser console and try:
   ```javascript
   import { simulationService } from './services/SimulationService';
   
   // Trigger SOS
   simulationService.simulateSOS('RESP-001');
   
   // Trigger Warning
   simulationService.simulateWarning('RESP-002');
   
   // Reset to Normal
   simulationService.simulateNormal('RESP-001');
   ```

---

## Next Steps

1. **Integrate Real Map:**
   - Add Leaflet map component
   - Plot responder markers with status colors
   - Add clustering for multiple responders
   - Real-time marker updates

2. **Enhance Responder Panel:**
   - Click to view detailed responder info
   - Quick action buttons (acknowledge, contact)
   - Filtering by status
   - Search functionality

3. **Add Charts:**
   - Heart rate trends using Recharts
   - Battery levels over time
   - Signal strength graphs

4. **Notifications:**
   - Toast notifications for emergencies
   - Sound alerts
   - Browser notifications

5. **Additional Pages:**
   - Live Tracking (dedicated map view)
   - Responder Monitoring (detailed list)
   - Emergency Center
   - Event Logs
   - System Status
   - Settings

---

## Component Export Structure

```typescript
// Components
export { default as StatsCards } from '../components/StatsCards';

// Pages
export { Dashboard } from '../pages';
export { default as Dashboard } from '../pages/Dashboard';

// Layout (from previous stage)
export { Layout, Sidebar, Header } from '../components/layout';
```

---

## Notes

- **Performance:** Uses React hooks (useState, useEffect) efficiently
- **Memory Management:** Properly unsubscribes from simulationService on unmount
- **Type Safety:** Full TypeScript support with interfaces
- **Accessibility:** Proper semantic HTML and ARIA attributes
- **Mobile-First:** Responsive design works on all screen sizes
- **Real-time:** Live updates every 3 seconds via subscription pattern

**Emergency Detection:**
The dashboard automatically detects emergencies through the stats calculation:
```tsx
hasEmergency={stats.emergencyCount > 0}
```
This triggers the emergency alert indicator in the Header component.
