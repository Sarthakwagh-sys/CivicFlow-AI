import {
  AgentEvent,
  AgentSession,
  Incident,
  Recommendation,
  TrafficSnapshot,
  EmergencyVehicle
} from '../src/types';
import {
  INITIAL_INCIDENTS,
  INITIAL_TRAFFIC_SNAPSHOTS,
  INITIAL_EMERGENCY_VEHICLES
} from '../src/data/simulationData';

class CivicFlowStore {
  private sessions: Map<string, AgentSession> = new Map();
  private events: Map<string, AgentEvent[]> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  private incidents: Incident[] = [...INITIAL_INCIDENTS];
  private trafficSnapshots: TrafficSnapshot[] = [...INITIAL_TRAFFIC_SNAPSHOTS];
  private emergencyVehicles: EmergencyVehicle[] = [...INITIAL_EMERGENCY_VEHICLES];

  public createSession(sessionId: string, userQuery: string): AgentSession {
    const session: AgentSession = {
      session_id: sessionId,
      user_query: userQuery,
      status: 'processing',
      started_at: new Date().toISOString(),
    };
    this.sessions.set(sessionId, session);
    this.events.set(sessionId, []);
    return session;
  }

  public getSession(sessionId: string): AgentSession | undefined {
    return this.sessions.get(sessionId);
  }

  public updateSession(sessionId: string, patch: Partial<AgentSession>): AgentSession | undefined {
    const current = this.sessions.get(sessionId);
    if (!current) return undefined;
    const updated = { ...current, ...patch };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  public addEvent(event: Omit<AgentEvent, 'event_id' | 'timestamp'>): AgentEvent {
    const fullEvent: AgentEvent = {
      ...event,
      event_id: `EVT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    const sessionEvents = this.events.get(event.session_id) || [];
    sessionEvents.push(fullEvent);
    this.events.set(event.session_id, sessionEvents);
    return fullEvent;
  }

  public getEvents(sessionId: string): AgentEvent[] {
    return this.events.get(sessionId) || [];
  }

  public saveRecommendation(rec: Recommendation): Recommendation {
    this.recommendations.set(rec.recommendation_id, rec);
    return rec;
  }

  public getRecommendation(recId: string): Recommendation | undefined {
    return this.recommendations.get(recId);
  }

  public getRecommendationBySession(sessionId: string): Recommendation | undefined {
    for (const rec of this.recommendations.values()) {
      if (rec.session_id === sessionId) return rec;
    }
    return undefined;
  }

  public updateRecommendationStatus(
    recId: string,
    status: 'APPROVED' | 'REJECTED',
    approvedBy: string = 'Traffic Control Operator (Human)'
  ): Recommendation | undefined {
    const rec = this.recommendations.get(recId);
    if (!rec) return undefined;
    
    rec.approval_status = status;
    rec.approved_by = approvedBy;
    this.recommendations.set(recId, rec);

    if (status === 'APPROVED') {
      // Simulate traffic state update when approved
      this.applySimulationUpdate(rec);
    }
    return rec;
  }

  private applySimulationUpdate(rec: Recommendation) {
    // Reduce delay on affected road
    const loc = rec.origin || 'Aundh Road';
    for (const snap of this.trafficSnapshots) {
      if (snap.location.toLowerCase().includes(loc.toLowerCase())) {
        snap.congestion = 'MODERATE';
        snap.average_speed_kmh = Math.min(snap.normal_speed_kmh, snap.average_speed_kmh + 15);
        snap.estimated_delay_minutes = Math.max(2, snap.estimated_delay_minutes - rec.estimated_time_saved_minutes);
        snap.capacity_used_pct = Math.max(40, snap.capacity_used_pct - 25);
        snap.last_updated = new Date().toISOString();
      }
    }
  }

  public getIncidents(): Incident[] {
    return this.incidents;
  }

  public addIncident(incident: Incident): Incident {
    this.incidents.unshift(incident);
    return incident;
  }

  public getTrafficSnapshots(): TrafficSnapshot[] {
    return this.trafficSnapshots;
  }

  public getTrafficForLocation(location: string): TrafficSnapshot | undefined {
    const loc = location.toLowerCase();
    return this.trafficSnapshots.find((s) => s.location.toLowerCase().includes(loc) || loc.includes(s.location.toLowerCase()));
  }

  public getEmergencyVehicles(): EmergencyVehicle[] {
    return this.emergencyVehicles;
  }
}

export const store = new CivicFlowStore();
