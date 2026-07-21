import React, { useState, useEffect } from 'react';
import { EmergencyVehicle } from '../types';
import { Siren, Hospital, Clock, ShieldCheck, HeartPulse } from 'lucide-react';

export const EmergencyOpsView: React.FC = () => {
  const [vehicles, setVehicles] = useState<EmergencyVehicle[]>([]);

  useEffect(() => {
    fetch('/api/v1/emergency-vehicles')
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-4 select-none">
      <div>
        <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center space-x-2">
          <Siren className="w-5 h-5 text-indigo-400" />
          <span>Emergency Vehicle Priority Operations</span>
        </h2>
        <p className="text-xs text-slate-400">
          Live monitoring and automated green corridor routing for ambulances, fire tenders, and rescue units
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => (
          <div
            key={v.vehicle_id}
            className="bg-slate-900/90 border border-indigo-900/60 rounded-xl p-5 space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-5 h-5 text-indigo-400 animate-pulse" />
                <span className="font-mono font-bold text-sm text-slate-100">{v.unit_code}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                {v.priority} PRIORITY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-500">Origin / Current</div>
                <div className="font-semibold text-slate-200">{v.current_location}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Destination</div>
                <div className="font-semibold text-indigo-300">{v.destination}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Estimated ETA: <strong className="text-cyan-300">{v.eta_minutes} mins</strong></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Corridor Route B Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
