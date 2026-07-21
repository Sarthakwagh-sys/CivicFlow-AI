import { mcpServer } from '../mcpServer';
import { CongestionLevel } from '../../src/types';

export interface TrafficAnalysisResult {
  location: string;
  congestion_level: CongestionLevel;
  average_speed_kmh: number;
  normal_speed_kmh: number;
  estimated_delay_minutes: number;
  capacity_used_pct: number;
  nearby_hotspots: string[];
  nearby_incidents_count: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
}

export async function runTrafficAgent(location: string): Promise<TrafficAnalysisResult> {
  // Tool call via MCP
  const status = mcpServer.getTrafficStatus(location);
  const incidents = mcpServer.getNearbyIncidents(location);

  const congestion = (status.congestion as CongestionLevel) || 'HIGH';
  let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';

  if (congestion === 'CRITICAL' || status.delay_minutes > 20) {
    risk = 'CRITICAL';
  } else if (congestion === 'HIGH' || status.delay_minutes > 10) {
    risk = 'HIGH';
  } else if (congestion === 'MODERATE') {
    risk = 'MEDIUM';
  } else {
    risk = 'LOW';
  }

  return {
    location: status.location,
    congestion_level: congestion,
    average_speed_kmh: status.average_speed_kmh,
    normal_speed_kmh: status.normal_speed_kmh,
    estimated_delay_minutes: status.delay_minutes,
    capacity_used_pct: status.capacity_used_pct,
    nearby_hotspots: status.nearby_hotspots,
    nearby_incidents_count: incidents.incident_count,
    risk,
    confidence: 0.94,
  };
}
