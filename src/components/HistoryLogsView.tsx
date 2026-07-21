import React from 'react';
import { History, ShieldCheck, CheckCircle2, FileText, Cpu } from 'lucide-react';

export const HistoryLogsView: React.FC = () => {
  const auditLogs = [
    {
      id: 'AUD_901',
      time: '18:38:12 IST',
      action: 'RECOMMENDATION_APPROVED',
      details: 'Operator S. Wagh approved Green Corridor Route B for Ambulance AMB-09 (Aundh Road to Sahyadri Hospital)',
      status: 'APPROVED',
      operator: 'Traffic Operator S. Wagh',
    },
    {
      id: 'AUD_900',
      time: '18:15:04 IST',
      action: 'INCIDENT_DISPATCHED',
      details: 'Incident INC_101 at University Circle dispatched towing and traffic squad unit TS-04',
      status: 'EXECUTED',
      operator: 'System Dispatcher',
    },
    {
      id: 'AUD_899',
      time: '17:45:30 IST',
      action: 'SIGNAL_CYCLE_ADJUSTMENT',
      details: 'Simulated 20s extension on Brehmen Chowk Junction A',
      status: 'COMPLETED',
      operator: 'Operator S. Wagh',
    },
  ];

  return (
    <div className="space-y-4 select-none">
      <div>
        <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center space-x-2">
          <History className="w-5 h-5 text-cyan-400" />
          <span>Operator Approval & Decision Audit Trail</span>
        </h2>
        <p className="text-xs text-slate-400">
          Permanent log of all AI agent recommendations, tool calls, and human approval decisions
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Audit ID</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Action Type</th>
              <th className="px-4 py-3">Operator</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-950/60 transition-colors">
                <td className="px-4 py-3 font-bold text-cyan-400">{log.id}</td>
                <td className="px-4 py-3 text-slate-400">{log.time}</td>
                <td className="px-4 py-3 font-semibold text-slate-200">{log.action}</td>
                <td className="px-4 py-3 text-slate-300">{log.operator}</td>
                <td className="px-4 py-3 text-slate-400 max-w-sm">{log.details}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
