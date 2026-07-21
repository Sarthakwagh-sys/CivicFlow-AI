import React, { useState } from 'react';
import { Send, Bot, Sparkles, Mic, RefreshCw, Zap } from 'lucide-react';

interface AiCopilotProps {
  onSubmitQuery: (query: string) => void;
  isLoading: boolean;
}

export const AiCopilot: React.FC<AiCopilotProps> = ({ onSubmitQuery, isLoading }) => {
  const [query, setQuery] = useState('');

  const samplePrompts = [
    {
      title: '🚑 Killer Demo Scenario',
      text: 'An ambulance is traveling from Aundh Road to Hospital A. A major accident has caused heavy congestion on the normal route. Find the fastest alternative and recommend a traffic-management plan.',
    },
    {
      title: '💥 University Circle Accident',
      text: 'Accident involving two vehicles near University Circle. Traffic is building up and an ambulance is approaching.',
    },
    {
      title: '🚦 Aundh Road Signal Optimization',
      text: 'Analyze heavy congestion near Aundh Road and recommend signal phase adjustments.',
    },
    {
      title: '🚗 Hinjawadi Bypass',
      text: 'Find alternative route around heavy congestion near Hinjawadi Phase 1.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmitQuery(query.trim());
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setQuery(sampleText);
    onSubmitQuery(sampleText);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl select-none space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-300 font-mono">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>AI COPILOT — NATURAL LANGUAGE TRAFFIC ORCHESTRATOR</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Powered by Gemini & Google ADK Agents
        </span>
      </div>

      {/* Query Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          placeholder="Describe an incident or ask CivicFlow AI to analyze traffic..."
          className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg pl-4 pr-24 py-3 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors shadow-inner"
        />

        <div className="absolute right-2 flex items-center space-x-1.5">
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-md shadow-cyan-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Prompts Chips */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold flex items-center space-x-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Quick Scenario Presets:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectSample(p.text)}
              className="text-left px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-cyan-800/80 hover:bg-slate-950 text-[11px] text-slate-300 transition-all group flex items-start space-x-2"
            >
              <div className="shrink-0 font-medium text-slate-200">{p.title}:</div>
              <div className="truncate text-slate-400 group-hover:text-cyan-300 transition-colors">
                {p.text}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
