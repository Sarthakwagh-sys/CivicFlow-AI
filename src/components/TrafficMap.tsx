import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { PUNE_LOCATIONS } from '../data/simulationData';
import { Incident, Recommendation, EmergencyVehicle } from '../types';
import { Siren, AlertTriangle, Hospital, Navigation, ShieldCheck, ShieldAlert, Sparkles, MapPin, Compass } from 'lucide-react';

interface TrafficMapProps {
  incidents: Incident[];
  activeRecommendation: Recommendation | null;
  emergencyVehicles: EmergencyVehicle[];
}

export const TrafficMap: React.FC<TrafficMapProps> = ({
  incidents,
  activeRecommendation,
  emergencyVehicles,
}) => {
  const apiKey =
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    '';

  const hasValidKey = Boolean(apiKey) && apiKey !== 'YOUR_API_KEY' && apiKey.trim().length > 10;
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Fallback High-Tech Command Center Vector Canvas Map
  return (
    <div className="relative w-full h-[480px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between select-none">
      {/* Top Map Status Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
        <span className="font-mono text-slate-200 font-semibold">PUNE METRO TRAFFIC GRID</span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/80 rounded">
          LIVE MAP CONTROL
        </span>
      </div>

      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg text-[11px] font-mono space-y-1.5">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-slate-300">Recommended Corridor (Route B)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="text-slate-300">Blocked / Congested (Route A)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500/80 flex items-center justify-center text-[9px] font-bold text-black">
            !
          </span>
          <span className="text-slate-300">Active Incident</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white">
            🚑
          </span>
          <span className="text-slate-300">Emergency Unit</span>
        </div>
      </div>

      {/* Google Maps view or Vector Graphic Canvas */}
      {hasValidKey ? (
        <APIProvider apiKey={apiKey} version="weekly">
          <Map
            defaultCenter={{ lat: 18.552, lng: 73.815 }}
            defaultZoom={13}
            mapId="CIVICFLOW_PUNE_MAP"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Incident Markers */}
            {incidents.map((inc) => (
              <AdvancedMarker key={inc.id} position={{ lat: inc.lat, lng: inc.lng }}>
                <Pin background="#ef4444" glyphColor="#ffffff" borderColor="#991b1b" />
              </AdvancedMarker>
            ))}

            {/* Emergency Vehicle Marker */}
            {emergencyVehicles.map((v) => (
              <AdvancedMarker key={v.vehicle_id} position={{ lat: 18.558, lng: 73.807 }}>
                <Pin background="#6366f1" glyphColor="#ffffff" borderColor="#3730a3" />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      ) : (
        /* Render Custom High-Tech Smart City Command Vector Map */
        <div className="relative w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-6 overflow-hidden flex items-center justify-center">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

          <svg className="w-full h-full max-w-4xl max-h-[420px]" viewBox="0 0 800 420" fill="none">
            {/* Background Road Lines Network */}
            <path d="M 120,80 L 320,180 L 520,280 L 700,320" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <path d="M 220,380 L 320,180 L 480,100 L 680,120" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <path d="M 120,80 L 480,100" stroke="#334155" strokeWidth="4" strokeDasharray="4 4" />

            {/* Congested Route A (Red glowing path through University Circle) */}
            <path
              d="M 150,100 L 320,180 L 580,220"
              stroke="#ef4444"
              strokeWidth="5"
              strokeLinecap="round"
              className="opacity-80"
            />

            {/* Recommended Corridor Route B (Green pulsing glowing path via Pashan bypass) */}
            <path
              d="M 150,100 L 220,260 L 420,310 L 580,220"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="12 6"
              className="animate-pulse"
            />

            {/* Junction Nodes */}

            {/* Node 1: Aundh Road (Origin) */}
            <g
              className="cursor-pointer group"
              onClick={() => setSelectedNode('Aundh Road')}
              transform="translate(150, 100)"
            >
              <circle r="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <circle r="6" fill="#38bdf8" className="animate-ping" />
              <text x="0" y="-22" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Aundh Road
              </text>
            </g>

            {/* Node 2: University Circle (Accident Blockage) */}
            <g
              className="cursor-pointer group"
              onClick={() => setSelectedNode('University Circle')}
              transform="translate(320, 180)"
            >
              <circle r="18" fill="#450a0a" stroke="#ef4444" strokeWidth="3" />
              <text x="0" y="4" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold">
                !
              </text>
              <text x="0" y="-24" textAnchor="middle" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">
                University Circle (Accident)
              </text>
            </g>

            {/* Node 3: Pashan Bypass (Clear Route B) */}
            <g
              className="cursor-pointer group"
              onClick={() => setSelectedNode('Pashan Bypass')}
              transform="translate(220, 260)"
            >
              <circle r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
              <circle r="4" fill="#34d399" />
              <text x="-10" y="30" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontFamily="monospace">
                Pashan Bypass (Corridor B)
              </text>
            </g>

            {/* Node 4: Sahyadri Hospital (Destination) */}
            <g
              className="cursor-pointer group"
              onClick={() => setSelectedNode('Sahyadri Hospital')}
              transform="translate(580, 220)"
            >
              <circle r="18" fill="#1e1b4b" stroke="#818cf8" strokeWidth="3" />
              <text x="0" y="4" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold">
                +
              </text>
              <text x="0" y="-24" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Sahyadri Hospital Aundh
              </text>
            </g>

            {/* Ambulance Unit Pulse Marker */}
            <g transform="translate(180, 115)">
              <rect x="-14" y="-12" width="28" height="24" rx="6" fill="#312e81" stroke="#6366f1" strokeWidth="2" />
              <text x="0" y="4" textAnchor="middle" fontSize="12">
                🚑
              </text>
              <circle x="0" y="0" r="18" fill="none" stroke="#818cf8" strokeWidth="1" className="animate-ping" />
            </g>
          </svg>

          {/* Interactive Tooltip Card Overlay when clicking nodes */}
          {selectedNode && (
            <div className="absolute bottom-12 left-6 bg-slate-900/95 border border-cyan-800/80 backdrop-blur-md p-3.5 rounded-xl shadow-xl max-w-xs text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-cyan-300 font-mono">
                <span>{selectedNode}</span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedNode === 'University Circle'
                  ? 'CRITICAL CONGESTION: Two-vehicle crash blocking 2 lanes. Delay +25 mins.'
                  : selectedNode === 'Aundh Road'
                  ? 'AMBULANCE AMB-09 LOCATION: Emergency dispatch en route to Hospital A.'
                  : selectedNode === 'Pashan Bypass'
                  ? 'GREEN CORRIDOR ROUTE B: Open traffic flow with simulated signal priority.'
                  : 'DESTINATION: Sahyadri Hospital Emergency Gate.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Map Controls & Simulation Disclaimer */}
      <div className="px-4 py-2 bg-slate-900/95 border-t border-slate-800/90 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center space-x-2 text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Route B: Aundh Road ➔ Pashan Bypass ➔ Sahyadri Hospital</span>
        </div>
        <div className="text-amber-400/90 font-medium">
          SIMULATION / RECOMMENDATION — NOT CONNECTED TO LIVE INFRASTRUCTURE
        </div>
      </div>
    </div>
  );
};
