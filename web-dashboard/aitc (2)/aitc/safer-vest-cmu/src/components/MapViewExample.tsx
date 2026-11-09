import React, { useEffect, useState } from 'react';
import MapView from './MapView';
import { simulationService } from '../services/simulationService';
import type { Responder } from '../types';

/**
 * Example usage of MapView component with simulationService
 * This demonstrates real-time GPS tracking with live updates
 */
const MapViewExample: React.FC = () => {
  const [responders, setResponders] = useState<Responder[]>([]);

  useEffect(() => {
    // Initial load
    setResponders(simulationService.getResponders());

    // Subscribe to updates
    const unsubscribe = simulationService.subscribe(() => {
      setResponders(simulationService.getResponders());
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-dark-950">
      {/* Header */}
      <div className="h-16 bg-dark-900 border-b border-dark-700 flex items-center px-6">
        <h1 className="text-xl font-bold text-white">Live GPS Tracking</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Responders: <span className="text-white font-semibold">{responders.length}</span>
          </div>
          <div className="text-sm text-gray-400">
            Online: <span className="text-green-400 font-semibold">
              {responders.filter(r => r.status !== 'OFFLINE').length}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Emergencies: <span className="text-red-400 font-semibold">
              {responders.filter(r => r.status === 'EMERGENCY').length}
            </span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[calc(100vh-4rem)]">
        <MapView responders={responders} />
      </div>
    </div>
  );
};

export default MapViewExample;
