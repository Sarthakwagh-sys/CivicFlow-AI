import { IncidentAnalysisResult } from './incidentAgent';
import { TrafficAnalysisResult } from './trafficAgent';
import { EmergencyAnalysisResult } from './emergencyAgent';
import { RouteAnalysisResult } from './routeAgent';
import { SignalAnalysisResult } from './signalAgent';
import { Recommendation, RiskLevel } from '../../src/types';
import { getGeminiClient } from '../geminiClient';

export async function runDecisionAgent(
  sessionId: string,
  userQuery: string,
  incident: IncidentAnalysisResult,
  traffic: TrafficAnalysisResult,
  emergency: EmergencyAnalysisResult,
  route: RouteAnalysisResult,
  signal: SignalAnalysisResult
): Promise<Recommendation> {
  const gemini = getGeminiClient();

  let riskLevel: RiskLevel = 'MEDIUM';
  if (incident.severity === 'CRITICAL' || traffic.congestion_level === 'CRITICAL') {
    riskLevel = 'HIGH';
  } else if (incident.severity === 'LOW' && traffic.congestion_level === 'LOW') {
    riskLevel = 'LOW';
  }

  let reasoningSummary = `${route.recommended_route.name} provides the optimal balance by avoiding heavy congestion at ${traffic.location} and saving approximately ${route.estimated_time_saved_minutes} minutes. Green corridor signals are recommended across ${signal.signals_affected} junctions.`;

  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Summarize the multi-agent traffic intelligence decision for this request:
User Query: "${userQuery}"
Incident: ${JSON.stringify(incident)}
Traffic: ${JSON.stringify(traffic)}
Emergency: ${JSON.stringify(emergency)}
Route: ${JSON.stringify(route)}
Signal: ${JSON.stringify(signal)}

Provide a concise 2-sentence executive summary for the human traffic operator explaining why ${route.recommended_route.name} is recommended.`,
        config: {
          systemInstruction: 'You are the CivicFlow AI Decision Agent. Output concise, professional, operator-ready reasoning summary.',
        },
      });

      if (response.text) {
        reasoningSummary = response.text.trim();
      }
    } catch (e) {
      console.warn('DecisionAgent Gemini summary generation failed, using structured fallback:', e);
    }
  }

  const rec: Recommendation = {
    recommendation_id: `REC_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 6)}`,
    session_id: sessionId,
    summary: emergency.emergency_detected
      ? `Emergency Response Plan: ${emergency.vehicle_type} route optimized to ${emergency.destination}`
      : `Traffic Mitigation Plan: Congestion bypass for ${traffic.location}`,
    incident_type: incident.incident_type,
    severity: incident.severity,
    emergency_detected: emergency.emergency_detected,
    vehicle_type: emergency.vehicle_type !== 'NONE' ? emergency.vehicle_type : undefined,
    origin: route.origin,
    destination: route.destination,
    recommended_route: route.recommended_route,
    alternative_route: route.alternative_route,
    estimated_time_saved_minutes: route.estimated_time_saved_minutes,
    signal_strategy: signal.strategy,
    signals_affected: signal.signals_affected,
    signal_recommendations: signal.recommendations,
    risk_level: riskLevel,
    confidence_score: Math.min(0.96, (incident.confidence + traffic.confidence) / 2 + 0.03),
    requires_human_approval: true,
    approval_status: 'PENDING',
    reasoning_summary: reasoningSummary,
    created_at: new Date().toISOString(),
  };

  return rec;
}
