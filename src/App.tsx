import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { Sidebar, NavTab } from './components/Sidebar';
import { KpiCards } from './components/KpiCards';
import { TrafficMap } from './components/TrafficMap';
import { AiCopilot } from './components/AiCopilot';
import { AgentActivityTimeline } from './components/AgentActivityTimeline';
import { RecommendationPanel } from './components/RecommendationPanel';
import { LiveTrafficView } from './components/LiveTrafficView';
import { IncidentsView } from './components/IncidentsView';
import { EmergencyOpsView } from './components/EmergencyOpsView';
import { HistoryLogsView } from './components/HistoryLogsView';
import { SettingsView } from './components/SettingsView';
import { AgentEvent, Incident, Recommendation, EmergencyVehicle } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('command_center');

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [emergencyVehicles, setEmergencyVehicles] = useState<EmergencyVehicle[]>([]);
  const [kpis, setKpis] = useState({
    active_incidents: 3,
    critical_incidents: 2,
    congestion_level: 'HIGH' as 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL',
    emergency_vehicles_en_route: 1,
  });

  // Initial data fetch
  const fetchData = async () => {
    try {
      const [kpiRes, incRes, emRes] = await Promise.all([
        fetch('/api/v1/kpis'),
        fetch('/api/v1/incidents'),
        fetch('/api/v1/emergency-vehicles'),
      ]);

      if (kpiRes.ok) setKpis(await kpiRes.json());
      if (incRes.ok) setIncidents(await incRes.json());
      if (emRes.ok) setEmergencyVehicles(await emRes.json());
    } catch (e) {
      console.error('Failed to fetch initial telemetry data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Poll agent events when active session is running
  useEffect(() => {
    if (!activeSessionId) return;

    let isPolling = true;
    const interval = setInterval(async () => {
      if (!isPolling) return;
      try {
        const res = await fetch(`/api/v1/sessions/${activeSessionId}/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);

          // Check if recommendation is ready
          const recRes = await fetch(`/api/v1/sessions/${activeSessionId}/recommendation`);
          if (recRes.ok) {
            const recData = await recRes.json();
            setRecommendation(recData);
            setIsWorkflowLoading(false);
          }
        }
      } catch (e) {
        console.error('Error polling events:', e);
      }
    }, 800);

    return () => {
      isPolling = false;
      clearInterval(interval);
    };
  }, [activeSessionId]);

  // Handle Natural Language Query submission
  const handleQuerySubmit = async (query: string) => {
    setIsWorkflowLoading(true);
    setEvents([]);
    setRecommendation(null);

    try {
      const res = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveSessionId(data.session_id);
      } else {
        setIsWorkflowLoading(false);
      }
    } catch (e) {
      console.error('Failed to initiate query workflow:', e);
      setIsWorkflowLoading(false);
    }
  };

  // Handle Approve
  const handleApprove = async (recId: string) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/v1/recommendations/${recId}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data.recommendation);
        fetchData();
      }
    } catch (e) {
      console.error('Failed to approve recommendation:', e);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Reject
  const handleReject = async (recId: string) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/v1/recommendations/${recId}/reject`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data.recommendation);
      }
    } catch (e) {
      console.error('Failed to reject recommendation:', e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const pendingCount = recommendation && recommendation.approval_status === 'PENDING' ? 1 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <TopNav systemStatus="SIMULATING" />

      {/* App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingApprovalsCount={pendingCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar">
          {activeTab === 'command_center' && (
            <>
              {/* KPI Header Bar */}
              <KpiCards
                activeIncidents={kpis.active_incidents}
                criticalIncidents={kpis.critical_incidents}
                congestionLevel={kpis.congestion_level}
                emergencyVehicles={kpis.emergency_vehicles_en_route}
                pendingApprovals={pendingCount}
              />

              {/* Natural Language AI Copilot Bar */}
              <AiCopilot onSubmitQuery={handleQuerySubmit} isLoading={isWorkflowLoading} />

              {/* Central Map & Activity Panel Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Traffic Map (7 Columns) */}
                <div className="lg:col-span-7">
                  <TrafficMap
                    incidents={incidents}
                    activeRecommendation={recommendation}
                    emergencyVehicles={emergencyVehicles}
                  />
                </div>

                {/* Agent Activity Timeline (5 Columns) */}
                <div className="lg:col-span-5">
                  <AgentActivityTimeline events={events} isLoading={isWorkflowLoading} />
                </div>
              </div>

              {/* AI Recommendation Action Plan Panel */}
              <RecommendationPanel
                recommendation={recommendation}
                onApprove={handleApprove}
                onReject={handleReject}
                isActionLoading={isActionLoading}
              />
            </>
          )}

          {activeTab === 'live_traffic' && <LiveTrafficView />}
          {activeTab === 'incidents' && <IncidentsView />}
          {activeTab === 'emergency_ops' && <EmergencyOpsView />}
          {activeTab === 'agent_activity' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-mono text-slate-100">Live Agent Activity Log</h2>
              <AgentActivityTimeline events={events} isLoading={isWorkflowLoading} />
            </div>
          )}
          {activeTab === 'history_logs' && <HistoryLogsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
