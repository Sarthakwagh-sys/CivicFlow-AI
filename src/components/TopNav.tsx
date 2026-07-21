import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Radio, Cpu, UserCheck, Clock, Layers } from 'lucide-react';

interface TopNavProps {
  systemStatus: 'ONLINE' | 'SIMULATING' | 'WARNING';
}

export const TopNav: React.FC<TopNavProps> = ({ systemStatus }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST (Pune)'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between text-slate-100 shadow-lg select-none">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-tight text-white font-mono">CivicFlow AI</h1>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              Agentic Copilot v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">Multi-Agent Traffic Intelligence & Decision-Support System</p>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Simulation Badge */}
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-full px-3.5 py-1 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-mono text-[11px]">SIMULATION MODE — PUNE TRAFFIC GRID</span>
        </div>

        {/* MCP Status */}
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-slate-400">MCP:</span>
          <span className="text-emerald-400 font-semibold font-mono">ONLINE (6 Tools)</span>
        </div>

        {/* Local Clock */}
        <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-cyan-300 text-xs font-medium">{timeStr || '18:42:00 IST'}</span>
        </div>
      </div>

      {/* Operator Profile */}
      <div className="flex items-center space-x-3">
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-slate-200">Operator S. Wagh</div>
          <div className="text-[10px] text-emerald-400 font-mono">Control Room Alpha • Active</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shadow-inner">
          OP1
        </div>
      </div>
    </header>
  );
};
