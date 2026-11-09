import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { Responder } from '../types';
import 'leaflet/dist/leaflet.css';

interface LiveMapProps {
  responders: Responder[];
  onResponderClick: (responderId: string) => void;
}

// Custom marker icons
const createMarkerIcon = (status: Responder['status']) => {
  let color = '#6b7280'; // gray for offline
  
  switch (status) {
    case 'NORMAL':
      color = '#22c55e'; // green
      break;
    case 'WARNING':
      color = '#eab308'; // yellow
      break;
    case 'EMERGENCY':
      color = '#ef4444'; // red
      break;
    case 'OFFLINE':
      color = '#6b7280'; // gray
      break;
  }

  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
      ${status === 'EMERGENCY' ? `
        <circle cx="16" cy="16" r="18" fill="none" stroke="${color}" stroke-width="2" opacity="0.5">
          <animate attributeName="r" from="14" to="24" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      ` : ''}
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to fit bounds when responders change
const FitBounds = ({ responders }: { responders: Responder[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (responders.length > 0) {
      const onlineResponders = responders.filter(r => r.status !== 'OFFLINE');
      if (onlineResponders.length > 0) {
        const bounds = new LatLngBounds(
          onlineResponders.map(r => [r.gps.latitude, r.gps.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [responders, map]);

  return null;
};

export const LiveMap = ({ responders, onResponderClick }: LiveMapProps) => {
  const mapRef = useRef(null);

  // Default center (Surabaya, Indonesia)
  const defaultCenter: [number, number] = [-7.2756, 112.7947];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-dark-700">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        className="h-full w-full"
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
            icon={createMarkerIcon(responder.status)}
            eventHandlers={{
              click: () => onResponderClick(responder.id),
            }}
          >
            <Popup>
              <div className="text-sm space-y-2 min-w-[200px]">
                <div className="font-bold text-base border-b pb-2">
                  {responder.id}
                </div>
                <div>
                  <span className="font-semibold">Name:</span> {responder.name}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={`font-bold ${
                      responder.status === 'NORMAL'
                        ? 'text-green-600'
                        : responder.status === 'WARNING'
                        ? 'text-yellow-600'
                        : responder.status === 'EMERGENCY'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {responder.status}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Location:</span>
                  <br />
                  Lat: {responder.gps.latitude.toFixed(5)}
                  <br />
                  Lng: {responder.gps.longitude.toFixed(5)}
                </div>
                <div>
                  <span className="font-semibold">Heart Rate:</span>{' '}
                  {responder.heartRate.current > 0
                    ? `${Math.round(responder.heartRate.current)} BPM`
                    : '--'}
                </div>
                <div>
                  <span className="font-semibold">Activity:</span>{' '}
                  {responder.imu.activity.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-semibold">Battery:</span>{' '}
                  {responder.battery.percentage.toFixed(0)}%
                </div>
                <div>
                  <span className="font-semibold">LoRa RSSI:</span>{' '}
                  {responder.lora.rssi !== null && responder.lora.rssi !== 0 ? `${responder.lora.rssi.toFixed(0)} dBm` : '--'}
                </div>
                <button
                  onClick={() => onResponderClick(responder.id)}
                  className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
