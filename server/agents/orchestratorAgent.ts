import { store } from '../store';
import { runIncidentAgent } from './incidentAgent';
import { runTrafficAgent } from './trafficAgent';
import { runEmergencyAgent } from './emergencyAgent';
import { runRouteAgent } from './routeAgent';
import { runSignalAgent } from './signalAgent';
import { runDecisionAgent } from './decisionAgent';
import { Recommendation } from '../../src/types';

export async function processMultiAgentWorkflow(sessionId: string, userQuery: string): Promise<Recommendation> {
  // Step 1: Initialize session logging
  store.addEvent({
    session_id: sessionId,
    agent_name: 'System',
    event_type: 'status',
    status: 'Completed',
    summary: 'User request received',
    details: { query: userQuery },
  });

  store.addEvent({
    session_id: sessionId,
    agent_name: 'Orchestrator Agent',
    event_type: 'status',
    status: 'Running',
    summary: 'Orchestrator Agent initialized workflow & selecting specialist agents',
  });

  // Step 2: Incident Agent
  store.addEvent({
    session_id: sessionId,
    agent_name: 'Incident Agent',
    event_type: 'status',
    status: 'Running',
    summary: 'Incident Agent activated to classify report details',
  });

  const incidentResult = await runIncidentAgent(userQuery);

  store.addEvent({
    session_id: sessionId,
    agent_name: 'Incident Agent',
    event_type: 'output',
    status: 'Completed',
    summary: `Incident classified as ${incidentResult.incident_type} (${incidentResult.severity} severity) at ${incidentResult.location}`,
    details: incidentResult,
  });

  // Step 3: Traffic Agent & MCP Call
  store.addEvent({
    session_id: sessionId,
    agent_name: 'Traffic Agent',
    event_type: 'status',
    status: 'Running',
    summary: 'Traffic Agent query requesting traffic metrics via MCP Server',
  });

  store.addEvent({
    session_id: sessionId,
    agent_name: 'MCP Traffic Tool',
    event_type: 'tool_call',
    status: 'Tool Call',
    summary: `MCP get_traffic_status("${incidentResult.location}") executed successfully`,
  });

  const trafficResult = await runTrafficAgent(incidentResult.location);

  store.addEvent({
    session_id: sessionId,
    agent_name: 'Traffic Agent',
    event_type: 'output',
    status: 'Completed',
    summary: `Congestion on ${trafficResult.location} classified as ${trafficResult.congestion_level} (${trafficResult.estimated_delay_minutes} min delay, ${trafficResult.average_speed_kmh} km/h avg speed)`,
    details: trafficResult,
  });

  // Step 4: Emergency Agent
  store.addEvent({
    session_id: sessionId,
    agent_name: 'Emergency Agent',
    event_type: 'status',
    status: 'Running',
    summary: 'Emergency Agent evaluating vehicle priority and destination route requirement',
  });

  const emergencyResult = await runEmergencyAgent(userQuery, incidentResult.location);

  store.addEvent({
    session_id: sessionId,
    agent_name: 'Emergency Agent',
    event_type: 'output',
    status: 'Completed',
    summary: emergencyResult.emergency_detected
      ? `${emergencyResult.vehicle_type} priority classified as ${emergencyResult.priority} en route to ${emergencyResult.destination}`
      : 'Standard traffic scenario — no critical emergency override required',
    details: emergencyResult,
  });

  // Step 5: Route Agent & MCP Tool Call
  store.addEvent({
    session_id: sessionId,
    agent_name: 'Route Agent',
    event_type: 'status',
    status: 'Running',
    summary: 'Route Planning Agent evaluating alternative corridors',
  });

  store.addEvent({
    session_id: sessionId,
    agent_name: 'MCP Route Tool',
    event_type: 'tool_call',
    status: 'Tool Call',
    summary: `MCP get_routes("${emergencyResult.current_location}", "${emergencyResult.destination}") executed`,
  });

  const routeResult = await runRouteAgent(emergencyResult.current_location, emergencyResult.destination);

  store.addEvent({
    session_id: sessionId,
    agent_name: 'Route Agent',
    event_type: 'output',
    status: 'Completed',
    summary: `Evaluated 3 routes: Selected ${routeResult.recommended_route.name} saving ~${routeResult.estimated_time_saved_minutes} minutes`,
    details: routeResult,
  });

  // Step 6: Signal Agent & MCP Tool Call
  store.addEvent({
    session_id: sessionId,
    agent_name: 'Signal Agent',
    event_type: 'status',
    status: 'Running',
    summary: 'Signal Strategy Agent formulating junction timing adjustments',
  });

  store.addEvent({
    session_id: sessionId,
    agent_name: 'MCP Signal Tool',
    event_type: 'tool_call',
    status: 'Tool Call',
    summary: `MCP simulate_signal_strategy("${routeResult.recommended_route.name}", "${emergencyResult.priority}") executed`,
  });

  const signalResult = await runSignalAgent(routeResult.recommended_route.name, emergencyResult.priority);

  store.addEvent({
    session_id: sessionId,
    agent_name: 'Signal Agent',
    event_type: 'output',
    status: 'Completed',
    summary: `Generated green corridor strategy across ${signalResult.signals_affected} signalized junctions`,
    details: signalResult,
  });

  // Step 7: Decision Agent
  store.addEvent({
    session_id: sessionId,
    agent_name: 'Decision Agent',
    event_type: 'status',
    status: 'Running',
    summary: 'Decision Agent synthesizing final recommendation and verifying safety constraints',
  });

  const rec = await runDecisionAgent(
    sessionId,
    userQuery,
    incidentResult,
    trafficResult,
    emergencyResult,
    routeResult,
    signalResult
  );

  store.saveRecommendation(rec);

  store.addEvent({
    session_id: sessionId,
    agent_name: 'Decision Agent',
    event_type: 'approval_required',
    status: 'Completed',
    summary: 'Action plan generated — Human operator approval required for execution',
    details: { recommendation_id: rec.recommendation_id },
  });

  store.updateSession(sessionId, {
    status: 'completed',
    completed_at: new Date().toISOString(),
    final_recommendation_id: rec.recommendation_id,
  });

  return rec;
}
