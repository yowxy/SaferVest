# SAFER-Vest Layout Components

Dark command center themed layout components for the SAFER-Vest dashboard.

## Components

### Layout
Main wrapper component that combines Sidebar and Header with a content area.

### Sidebar
Navigation sidebar with:
- SAFER-Vest branding with gradient logo
- Navigation menu items with active state highlighting
- System status indicator at bottom
- Collapse/expand functionality (desktop)
- Mobile responsive with overlay and hamburger menu
- Dark theme with high contrast colors

### Header
Top header bar with:
- Page title
- Real-time system status indicators
- Live clock and date
- Notification bell with badge counter
- Emergency alert indicator
- Responsive design

## Usage

### Basic Usage

```tsx
import { Layout } from './components/layout';

function App() {
  return (
    <Layout
      title="Dashboard"
      systemStatus="ONLINE"
      loraConnected={true}
      respondersOnline={12}
      hasEmergency={false}
      notificationCount={3}
      onNotificationClick={() => console.log('Notifications clicked')}
    >
      {/* Your page content here */}
      <div className="p-6">
        <h2>Dashboard Content</h2>
      </div>
    </Layout>
  );
}
```

### Individual Component Usage

```tsx
import { Sidebar, Header } from './components/layout';

function CustomLayout() {
  return (
    <div className="flex h-screen bg-dark-950">
      <Sidebar systemStatus="ONLINE" />
      
      <div className="flex-1 flex flex-col">
        <Header
          title="Live Tracking"
          systemOnline={true}
          loraConnected={true}
          respondersOnline={8}
          hasEmergency={true}
          notificationCount={5}
          onNotificationClick={() => {}}
        />
        
        <main className="flex-1 overflow-auto">
          {/* Content */}
        </main>
      </div>
    </div>
  );
}
```

### With React Router

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';

function App() {
  const [systemData, setSystemData] = useState({
    systemStatus: 'ONLINE',
    loraConnected: true,
    respondersOnline: 12,
    hasEmergency: false,
    notificationCount: 0,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout title="Dashboard" {...systemData}>
            <DashboardPage />
          </Layout>
        } />
        <Route path="/live-tracking" element={
          <Layout title="Live Tracking" {...systemData}>
            <LiveTrackingPage />
          </Layout>
        } />
        <Route path="/responders" element={
          <Layout title="Responder Monitoring" {...systemData}>
            <RespondersPage />
          </Layout>
        } />
        {/* More routes... */}
      </Routes>
    </BrowserRouter>
  );
}
```

## Props

### Layout Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Page content |
| `title` | `string` | required | Page title displayed in header |
| `systemStatus` | `'ONLINE' \| 'OFFLINE'` | `'ONLINE'` | System status indicator |
| `loraConnected` | `boolean` | `true` | LoRa gateway connection status |
| `respondersOnline` | `number` | `0` | Number of active responders |
| `hasEmergency` | `boolean` | `false` | Show emergency alert indicator |
| `notificationCount` | `number` | `0` | Notification badge count |
| `onNotificationClick` | `() => void` | `undefined` | Notification bell click handler |

### Sidebar Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `systemStatus` | `'ONLINE' \| 'OFFLINE'` | required | System status for bottom indicator |

### Header Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Page title |
| `systemOnline` | `boolean` | `true` | System online status |
| `loraConnected` | `boolean` | `true` | LoRa connection status |
| `respondersOnline` | `number` | `0` | Online responder count |
| `hasEmergency` | `boolean` | `false` | Emergency alert state |
| `notificationCount` | `number` | `0` | Notification count |
| `onNotificationClick` | `() => void` | `undefined` | Notification handler |

## Features

### Responsive Design
- **Desktop**: Full sidebar with collapse/expand
- **Tablet**: Sidebar remains accessible
- **Mobile**: Hamburger menu with overlay

### Dark Theme
- Background: `dark-950`, `dark-900`, `dark-800`
- Borders: `dark-700`
- Text: High contrast white and gray shades
- Accent: Red-orange gradient for branding
- Primary: Customizable primary color for highlights

### Navigation
- Active route highlighting with gradient background
- Hover effects with smooth transitions
- Icon-based navigation (lucide-react)
- Route integration with React Router

### Status Indicators
- Real-time clock with seconds
- Animated pulse effects for online status
- Color-coded status (green = good, red = error)
- Emergency alert with animated border

## Dependencies

Required packages:
- `react`
- `react-router-dom`
- `lucide-react`
- `tailwindcss`

## Tailwind Configuration

Ensure your `tailwind.config.js` includes these dark colors:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0a0f',
          900: '#0f0f1a',
          800: '#1a1a2e',
          700: '#2a2a3e',
        },
        primary: {
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
};
```
