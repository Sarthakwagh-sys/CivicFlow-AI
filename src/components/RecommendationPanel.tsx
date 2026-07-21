import React from 'react';
import { Recommendation } from '../types';
import {
  ShieldCheck,
  Clock,
  Navigation,
  Siren,
  Activity,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertOctagon,
  ChevronRight,
  Info
} from 'lucide-react';

interface RecommendationPanelProps {
  recommendation: Recommendation | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isActionLoading: boolean;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendation,
  onApprove,
  onReject,
  isActionLoading,
}) => {
  if (!recommendation) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl text-center select-none flex flex-col items-center justify-center h-[480px] space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200 font-mono">Awaiting Decision Support Query</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Submit an incident query to receive a multi-agent route optimization and simulated signal timing recommendation.
          </p>
        </div>
      </div>
    );
  }

  const isApproved = recommendation.approval_status === 'APPROVED';
  const isRejected = recommendation.approval_status === 'REJECTED';

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-5 shadow-2xl select-none flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Siren className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
            AI RECOMMENDATION PLAN
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
            {recommendation.vehicle_type || 'TRAFFIC_CONTROL'}
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
              isApproved
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : isRejected
                ? 'bg-red-950 text-red-400 border border-red-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
            }`}
          >
            {recommendation.approval_status}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-3.5">
        {/* Situation Summary */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
            Situation Summary
          </div>
          <p className="text-slate-200 leading-relaxed font-sans font-medium">{recommendation.summary}</p>
        </div>

        {/* Route Comparison Card */}
        <div className="grid grid-cols-2 gap-3">
          {/* Recommended Route */}
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/60 text-xs space-y-1">
            <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center justify-between">
              <span>Recommended Route</span>
              <span className="text-emerald-300">Fastest</span>
            </div>
            <div className="font-bold text-slate-100">{recommendation.recommended_route.name}</div>
            <div className="text-[11px] text-slate-400 font-mono">
              Est. Time: {recommendation.recommended_route.estimated_time_minutes} mins ({recommendation.recommended_route.distance_km} km)
            </div>
          </div>

          {/* Time Saved Badge */}
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-xs flex flex-col justify-center items-center text-center">
            <div className="text-[10px] font-mono uppercase text-indigo-300 font-bold">
              Estimated Time Saved
            </div>
            <div className="text-2xl font-extrabold font-mono text-cyan-300 my-0.5">
              {recommendation.estimated_time_saved_minutes} Mins
            </div>
            <div className="text-[10px] text-slate-400">Vs congested primary route</div>
          </div>
        </div>

        {/* Signal Timing Strategy */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-400">
            <span>Simulated Signal Strategy</span>
            <span className="text-cyan-400 font-bold">{recommendation.signals_affected} Junctions Affected</span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300 font-mono">
            {recommendation.signal_recommendations.map((sig, sIdx) => (
              <div key={sIdx} className="flex items-center space-x-1.5 text-slate-300">
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold text-slate-200">{sig.junction}:</span>
                <span className="text-slate-400">{sig.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable Reasoning */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold flex items-center space-x-1">
            <Info className="w-3 h-3 text-cyan-400" />
            <span>AI Reasoning & Risk Assessment</span>
          </div>
          <p className="text-slate-300 leading-relaxed italic">{recommendation.reasoning_summary}</p>
          <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-400 pt-1">
            <span>Risk Level: <strong className="text-amber-400">{recommendation.risk_level}</strong></span>
            <span>Confidence: <strong className="text-emerald-400">{Math.round(recommendation.confidence_score * 100)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer & Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="text-[10px] font-mono text-center text-amber-400/90 font-semibold bg-amber-950/30 border border-amber-900/50 py-1 px-2 rounded">
          SIMULATION / RECOMMENDATION — NOT CONNECTED TO LIVE TRAFFIC INFRASTRUCTURE
        </div>

        {recommendation.approval_status === 'PENDING' ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onApprove(recommendation.recommendation_id)}
              disabled={isActionLoading}
              className="py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APPROVE RECOMMENDATION</span>
            </button>

            <button
              onClick={() => onReject(recommendation.recommendation_id)}
              disabled={isActionLoading}
              className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold border border-slate-700 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4 text-red-400" />
              <span>REJECT</span>
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono text-xs text-slate-300 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Recommendation {isApproved ? 'Approved — Simulation Updated' : 'Rejected — Logged to Audit Trail'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
