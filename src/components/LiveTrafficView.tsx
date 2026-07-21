import React, { useState, useEffect } from 'react';
import { TrafficSnapshot } from '../types';
import { Activity, Gauge, Navigation, RefreshCw } from 'lucide-react';

export const LiveTrafficView: React.FC = () => {
  const [snapshots, setSnapshots] = useState<TrafficSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTraffic = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/traffic');
      const data = await res.json();
      setSnapshots(data);
    } catch (e) {
      console.error('Failed to fetch traffic snapshots:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
  }, []);

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <span>Live Traffic Corridors & Speed Metrics</span>
          </h2>
          <p className="text-xs text-slate-400">Real-time simulated Pune city arterial road telemetry</p>
        </div>

        <button
          onClick={fetchTraffic}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snapshots.map((snap) => {
          const isCritical = snap.congestion === 'CRITICAL';
          const isHigh = snap.congestion === 'HIGH';

          return (
            <div
              key={snap.snapshot_id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-slate-100">{snap.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isCritical
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : isHigh
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {snap.congestion} CONGESTION
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500">Avg Speed</div>
                  <div className="text-base font-bold text-slate-200">{snap.average_speed_kmh} km/h</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Est. Delay</div>
                  <div className="text-base font-bold text-amber-400">+{snap.estimated_delay_minutes} mins</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Capacity Used</span>
                  <span>{snap.capacity_used_pct}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      snap.capacity_used_pct > 85 ? 'bg-red-500' : snap.capacity_used_pct > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${snap.capacity_used_pct}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 truncate">
                Hotspots: {snap.nearby_hotspots.join(', ')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
