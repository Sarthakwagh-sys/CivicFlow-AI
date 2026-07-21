import React from 'react';
import { Settings, Cpu, Radio, ShieldCheck, Database } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-4 select-none max-w-3xl">
      <div>
        <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-slate-400" />
          <span>System Settings & Agent Integrations</span>
        </h2>
        <p className="text-xs text-slate-400">Manage Model Context Protocol (MCP) servers and Gemini reasoning models</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 text-xs font-mono text-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-100">Primary Reasoning Model</span>
          </div>
          <span className="text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
            Gemini 3.6 Flash
          </span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-100">Model Context Protocol (MCP) Server</span>
          </div>
          <span className="text-cyan-400 font-bold bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
            HTTP MCP Endpoint (Local)
          </span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-100">Persistence Storage</span>
          </div>
          <span className="text-slate-300 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
            In-Memory / Firestore Fallback Sync
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-100">Human-in-the-Loop Safety Enforcement</span>
          </div>
          <span className="text-emerald-400 font-bold">MANDATORY (ENFORCED)</span>
        </div>
      </div>
    </div>
  );
};
