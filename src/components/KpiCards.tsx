import React from 'react';
import { AlertTriangle, Flame, Activity, Siren, Sparkles } from 'lucide-react';

interface KpiCardsProps {
  activeIncidents: number;
  criticalIncidents: number;
  congestionLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  emergencyVehicles: number;
  pendingApprovals: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  activeIncidents,
  criticalIncidents,
  congestionLevel,
  emergencyVehicles,
  pendingApprovals,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 select-none">
      {/* Active Incidents */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Active Incidents</span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-extrabold font-mono text-slate-100">{activeIncidents}</span>
          <span className="text-[10px] text-slate-400 font-mono">Pune Grid</span>
        </div>
        <div className="mt-1 text-[11px] text-amber-400/90 flex items-center space-x-1">
          <span>University Circle & Aundh</span>
        </div>
      </div>

      {/* Critical Incidents */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Critical Severity</span>
          <Flame className="w-4 h-4 text-red-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-extrabold font-mono text-red-400">{criticalIncidents}</span>
          <span className="text-[10px] text-slate-400 font-mono">High Urgency</span>
        </div>
        <div className="mt-1 text-[11px] text-red-400/90 flex items-center space-x-1">
          <span>Requires Corridor Clear</span>
        </div>
      </div>

      {/* Congestion Level */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Congestion Level</span>
          <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-xl font-bold font-mono text-amber-300">{congestionLevel}</span>
          <span className="text-[10px] text-slate-400 font-mono">Avg 18km/h</span>
        </div>
        <div className="mt-1 text-[11px] text-cyan-400/90">
          <span>Aundh - Ganeshkhind Bottleneck</span>
        </div>
      </div>

      {/* Emergency Vehicles */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Emergency Units</span>
          <Siren className="w-4 h-4 text-indigo-400 animate-pulse" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-extrabold font-mono text-indigo-300">{emergencyVehicles}</span>
          <span className="text-[10px] text-slate-400 font-mono">En Route</span>
        </div>
        <div className="mt-1 text-[11px] text-indigo-300/90">
          <span>AMB-09 Cardiac Unit</span>
        </div>
      </div>

      {/* AI Recommendations Awaiting Approval */}
      <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-800/60 rounded-xl p-3.5 shadow-md shadow-cyan-950/40">
        <div className="flex items-center justify-between text-cyan-300 text-xs font-semibold">
          <span>AI Recommendations</span>
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-extrabold font-mono text-cyan-300">{pendingApprovals}</span>
          <span className="text-[10px] text-cyan-400/80 font-mono font-bold uppercase">Awaiting Approval</span>
        </div>
        <div className="mt-1 text-[11px] text-cyan-400 font-mono font-medium">
          {pendingApprovals > 0 ? '⚡ Action plan ready' : 'Ready for query'}
        </div>
      </div>
    </div>
  );
};
