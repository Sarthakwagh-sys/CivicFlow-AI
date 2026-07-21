import React from 'react';
import {
  LayoutDashboard,
  Navigation,
  AlertTriangle,
  Siren,
  Bot,
  History,
  Settings,
  Flame,
  CheckCircle2,
  FileCode2
} from 'lucide-react';

export type NavTab =
  | 'command_center'
  | 'live_traffic'
  | 'incidents'
  | 'emergency_ops'
  | 'agent_activity'
  | 'history_logs'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingApprovalsCount }) => {
  const navItems = [
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'live_traffic', label: 'Live Traffic', icon: Navigation },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: '3' },
    { id: 'emergency_ops', label: 'Emergency Operations', icon: Siren, highlight: true },
    { id: 'agent_activity', label: 'AI Agent Activity', icon: Bot },
    { id: 'history_logs', label: 'History & Audit', icon: History },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
          Control Panel
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-bold">
                  {item.badge}
                </span>
              )}

              {item.id === 'command_center' && pendingApprovalsCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/80 font-bold animate-pulse">
                  {pendingApprovalsCount} REQ
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-4 m-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center space-x-1.5 font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
          <ShieldNoticeIcon className="w-3.5 h-3.5" />
          <span>Safety Standard</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
          All traffic-signal adjustments are simulated recommendations requiring explicit human operator approval.
        </p>
      </div>
    </aside>
  );
};

function ShieldNoticeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  );
}
