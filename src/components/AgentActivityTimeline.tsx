import React from 'react';
import { AgentEvent } from '../types';
import {
  CheckCircle2,
  Clock,
  Wrench,
  BrainCircuit,
  AlertTriangle,
  Bot,
  ChevronRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface AgentActivityTimelineProps {
  events: AgentEvent[];
  isLoading: boolean;
}

export const AgentActivityTimeline: React.FC<AgentActivityTimelineProps> = ({ events, isLoading }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl select-none flex flex-col h-[480px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
            Agent Orchestration Timeline
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Google ADK Trace</span>
        </div>
      </div>

      {/* Events Scroll List */}
      <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1.5 custom-scrollbar">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
            <Bot className="w-8 h-8 text-slate-700" />
            <p className="text-xs font-mono">No active agent execution trace.</p>
            <p className="text-[11px] text-slate-600">
              Submit a natural language query in the AI Copilot above to observe multi-agent reasoning.
            </p>
          </div>
        ) : (
          events.map((evt, idx) => {
            const isTool = evt.event_type === 'tool_call';
            const isApproval = evt.event_type === 'approval_required';
            const isCompleted = evt.status === 'Completed';

            return (
              <div
                key={evt.event_id || idx}
                className={`p-2.5 rounded-lg border text-xs transition-all ${
                  isApproval
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                    : isTool
                    ? 'bg-slate-950 border-cyan-900/60 text-cyan-200 font-mono'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isTool ? (
                      <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : isApproval ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
                    ) : (
                      <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
                    )}
                    <span className={isTool ? 'text-cyan-400' : isApproval ? 'text-amber-300' : 'text-slate-200'}>
                      {evt.agent_name}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-300">{evt.summary}</p>

                {evt.details && evt.details.recommendations && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1 font-mono">
                    {evt.details.recommendations.map((rec: any, rIdx: number) => (
                      <div key={rIdx} className="flex items-center space-x-1">
                        <ChevronRight className="w-3 h-3 text-cyan-400" />
                        <span>
                          {rec.junction}: {rec.action} ({rec.duration_seconds}s)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="p-3 rounded-lg bg-slate-950 border border-cyan-800/50 text-xs text-cyan-300 flex items-center space-x-2 font-mono animate-pulse">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Agent orchestration in progress... Invoking specialist agents...</span>
          </div>
        )}
      </div>
    </div>
  );
};
