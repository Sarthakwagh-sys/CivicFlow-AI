import { getGeminiClient } from '../geminiClient';
import { Type } from '@google/genai';

export interface IncidentAnalysisResult {
  incident_type: 'ACCIDENT' | 'VEHICLE_BREAKDOWN' | 'ROAD_BLOCKAGE' | 'HEAVY_CONGESTION' | 'EMERGENCY_VEHICLE_MOVEMENT' | 'ROAD_CONSTRUCTION' | 'UNKNOWN';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  estimated_impact: string;
  recommended_response: string;
  confidence: number;
}

export async function runIncidentAgent(userQuery: string): Promise<IncidentAnalysisResult> {
  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analyze the following traffic incident report/query and extract structured classification details:
Query: "${userQuery}"`,
        config: {
          systemInstruction:
            'You are the CivicFlow AI Incident Analysis Agent. Analyze the report to identify incident type, severity, urgency, affected location, estimated impact, recommended response strategy, and confidence score between 0.0 and 1.0.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              incident_type: {
                type: Type.STRING,
                description: 'Classification type',
              },
              severity: { type: Type.STRING, description: 'LOW, MEDIUM, HIGH, or CRITICAL' },
              urgency: { type: Type.STRING, description: 'LOW, MEDIUM, HIGH, or CRITICAL' },
              location: { type: Type.STRING, description: 'Primary location extracted' },
              estimated_impact: { type: Type.STRING, description: 'Summary of road/lane impact' },
              recommended_response: { type: Type.STRING, description: 'Response category' },
              confidence: { type: Type.NUMBER, description: 'Confidence score from 0.0 to 1.0' },
            },
            required: ['incident_type', 'severity', 'urgency', 'location', 'estimated_impact', 'recommended_response', 'confidence'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          incident_type: parsed.incident_type || 'ACCIDENT',
          severity: parsed.severity || 'HIGH',
          urgency: parsed.urgency || 'HIGH',
          location: parsed.location || 'Aundh Road',
          estimated_impact: parsed.estimated_impact || 'Multiple lanes affected by heavy congestion',
          recommended_response: parsed.recommended_response || 'Traffic diversion and emergency green corridor',
          confidence: Number(parsed.confidence) || 0.92,
        };
      }
    } catch (e) {
      console.warn('IncidentAgent Gemini call failed, using rule-based fallback:', e);
    }
  }

  // Rule-based fallback
  const queryLower = userQuery.toLowerCase();
  const isAmbulance = queryLower.includes('ambulance') || queryLower.includes('hospital') || queryLower.includes('emergency');
  const isAccident = queryLower.includes('accident') || queryLower.includes('crash') || queryLower.includes('collision');

  return {
    incident_type: isAmbulance ? 'EMERGENCY_VEHICLE_MOVEMENT' : isAccident ? 'ACCIDENT' : 'HEAVY_CONGESTION',
    severity: isAmbulance ? 'CRITICAL' : isAccident ? 'HIGH' : 'MEDIUM',
    urgency: isAmbulance ? 'CRITICAL' : 'HIGH',
    location: queryLower.includes('aundh') ? 'Aundh Road' : queryLower.includes('university') ? 'University Circle' : 'Aundh Corridor',
    estimated_impact: 'Key arterial lanes bottlenecked due to peak traffic and incident',
    recommended_response: 'Activate priority routing and signal timing adjustments',
    confidence: 0.9,
  };
}
