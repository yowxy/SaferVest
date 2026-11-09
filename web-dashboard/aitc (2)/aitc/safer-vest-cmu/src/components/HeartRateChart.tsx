import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Zap } from 'lucide-react';
import type { HeartRateData } from '../types';

interface HeartRateChartProps {
  data: HeartRateData;
  responderId?: string;
  className?: string;
}

export default function HeartRateChart({ data, responderId, className = '' }: HeartRateChartProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      NORMAL: 'text-emerald-400',
      ELEVATED: 'text-amber-400',
      CRITICAL: 'text-rose-400 animate-pulse'
    };
    return colors[status as keyof typeof colors] || 'text-slate-400';
  };

  const getLineColor = (status: string) => {
    const colors = {
      NORMAL: '#10b981',
      ELEVATED: '#f59e0b',
      CRITICAL: '#f43f5e'
    };
    return colors[status as keyof typeof colors] || '#64748b';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const chartData = data.history.map(item => ({
    time: formatTime(item.time),
    bpm: item.bpm
  }));

  return (
    <div className={`glass-card border border-slate-800/80 rounded-2xl p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center">
            <Heart size={20} className="text-rose-400 animate-heartbeat" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Physiological Heart Rate Telemetry
            </h3>
            <p className="text-xs text-slate-400">MAX30102 Wearable Sensor Real-time Stream</p>
          </div>
        </div>

        {responderId && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs font-bold text-slate-400">UNIT:</span>
            <span className="text-sm font-extrabold font-mono text-cyan-400">{responderId}</span>
          </div>
        )}
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-xs font-medium text-slate-400 mb-1">Current HR</div>
          <div className={`text-3xl font-extrabold font-mono ${getStatusColor(data.status)}`}>
            {data.current > 0 ? Math.round(data.current) : '--'}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">BPM</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-xs font-medium text-slate-400 mb-1">Average HR</div>
          <div className="text-3xl font-extrabold font-mono text-sky-400">
            {Math.round(data.average)}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">BPM</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-xs font-medium text-slate-400 mb-1">Minimum HR</div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {data.min}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">BPM</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-xs font-medium text-slate-400 mb-1">Peak HR</div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">
            {data.max}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">BPM</div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-xl mb-5">
        <div className="flex items-center space-x-2.5">
          <div className={`w-3 h-3 rounded-full ${data.status === 'CRITICAL' ? 'bg-rose-500 animate-ping' : data.status === 'ELEVATED' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
          <span className={`font-bold text-xs uppercase tracking-wider ${getStatusColor(data.status)}`}>
            VITAL STATUS: {data.status}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Sampling Rate: 100 Hz
        </span>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              domain={[50, 180]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#f8fafc',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke={getLineColor(data.status)}
              strokeWidth={3}
              dot={{ r: 3, fill: getLineColor(data.status) }}
              activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sensor Note */}
      <div className="mt-4 p-3 bg-sky-950/30 border border-sky-800/50 rounded-xl flex items-start space-x-2.5">
        <Zap size={16} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sky-300/90 leading-relaxed">
          <strong>Telemetry Note:</strong> Physiological data is transmitted via ESP32 LoRa module from MAX30102 PPG sensor. High BPM triggers automated alerts to Emergency Center.
        </p>
      </div>
    </div>
  );
}
