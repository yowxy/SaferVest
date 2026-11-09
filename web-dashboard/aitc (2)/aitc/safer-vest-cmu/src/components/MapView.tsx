import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Responder } from '../types';
import 'leaflet/dist/leaflet.css';
import { Activity, Battery, Radio, MapPin, Heart, ExternalLink } from 'lucide-react';

// Fix Leaflet default icon URL issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  responders: Responder[];
  onResponderClick?: (responderId: string) => void;
  className?: string;
}

// Custom SVG marker icons with dynamic glowing status rings
const createCustomIcon = (status: string, responderId: string) => {
  const colors = {
    NORMAL: '#10b981', // emerald
    WARNING: '#f59e0b', // amber
    EMERGENCY: '#f43f5e', // rose
    OFFLINE: '#64748b' // slate
  };

  const color = colors[status as keyof typeof colors] || '#64748b';
  const isEmergency = status === 'EMERGENCY';

  return L.divIcon({
    className: 'custom-marker-wrapper',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        ${isEmergency ? `
          <div style="position: absolute; inset: -10px; border-radius: 50%; background-color: rgba(244, 63, 94, 0.4); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; inset: -6px; border-radius: 50%; background-color: rgba(244, 63, 94, 0.6); animation: pulse 1.5s ease-in-out infinite;"></div>
        ` : ''}
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${color}, #0f172a);
          border: 2.5px solid #ffffff;
          box-shadow: 0 0 15px ${color}80, 0 4px 10px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 10px;
          font-family: monospace;
        ">
          ${responderId.replace('RESP-', '')}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Component to fit map bounds to active markers
function FitBounds({ responders }: { responders: Responder[] }) {
  const map = useMap();

  useEffect(() => {
    if (responders.length > 0) {
      const activeResponders = responders.filter(r => r.status !== 'OFFLINE');
      const targetList = activeResponders.length > 0 ? activeResponders : responders;
      const bounds = L.latLngBounds(
        targetList.map(r => [r.gps.latitude, r.gps.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [responders, map]);

  return null;
}

export default function MapView({ responders, onResponderClick, className = '' }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Default center (Surabaya, Indonesia)
  const defaultCenter: [number, number] = [-7.2756, 112.7947];

  const getStatusColor = (status: string) => {
    const colors = {
      NORMAL: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      WARNING: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      EMERGENCY: 'text-rose-400 bg-rose-500/20 border-rose-500/50 animate-pulse',
      OFFLINE: 'text-slate-400 bg-slate-800 border-slate-700'
    };
    return colors[status as keyof typeof colors] || 'text-slate-400 bg-slate-800 border-slate-700';
  };

  return (
    <div className={`relative h-full w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={14}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds responders={responders} />

        {responders.map((responder) => (
          <Marker
            key={responder.id}
            position={[responder.gps.latitude, responder.gps.longitude]}
            icon={createCustomIcon(responder.status, responder.id)}
            eventHandlers={{
              click: () => onResponderClick?.(responder.id)
            }}
          >
            <Popup>
              <div className="min-w-[240px] p-1 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700/80">
                  <div>
                    <div className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                      <span>{responder.id}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium">{responder.name}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusColor(responder.status)}`}>
                    {responder.status}
                  </span>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Heart size={14} className="text-rose-400" /> Heart Rate:
                    </span>
                    <span className="font-bold text-white font-mono">
                      {responder.heartRate.current > 0 ? `${Math.round(responder.heartRate.current)} BPM` : '--'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Activity size={14} className="text-amber-400" /> Activity:
                    </span>
                    <span className="font-semibold text-slate-200">
                      {responder.imu.activity.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Battery size={14} className="text-emerald-400" /> Battery:
                    </span>
                    <span className="font-bold text-white font-mono">
                      {responder.battery.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Radio size={14} className="text-sky-400" /> RSSI Signal:
                    </span>
                    <span className="font-bold text-sky-300 font-mono">
                      {responder.lora.rssi !== null ? `${responder.lora.rssi.toFixed(0)} dBm` : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <MapPin size={14} className="text-cyan-400" /> GPS Coords:
                    </span>
                    <span className="font-mono text-[11px] text-cyan-300">
                      {responder.gps.latitude.toFixed(4)}, {responder.gps.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* View Details Action Button */}
                <button
                  onClick={() => onResponderClick?.(responder.id)}
                  className="w-full mt-3 py-2 px-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Select Responder</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Status Legend */}
      <div className="absolute bottom-4 right-4 z-[400] glass-panel border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl">
        <div className="text-xs font-extrabold text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          GPS Radar Legend
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className="text-slate-300 font-medium">Normal</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <span className="text-slate-300 font-medium">Warning</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-slate-300 font-medium">Emergency</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
            <span className="text-slate-300 font-medium">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
