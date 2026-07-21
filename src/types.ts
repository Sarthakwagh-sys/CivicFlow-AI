export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'ACTIVE' | 'DISPATCHED' | 'MONITORING' | 'RESOLVED';
export type IncidentType =
  | 'ACCIDENT'
  | 'VEHICLE_BREAKDOWN'
  | 'ROAD_BLOCKAGE'
  | 'HEAVY_CONGESTION'
  | 'EMERGENCY_VEHICLE_MOVEMENT'
  | 'ROAD_CONSTRUCTION'
  | 'UNKNOWN';

export interface Incident {
  id: string;
  type: IncidentType;
  location: string;
  lat: number;
  lng: number;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  created_at: string;
  updated_at: string;
}

export type CongestionLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface TrafficSnapshot {
  snapshot_id: string;
  road_id: string;
  name: string;
  location: string;
  congestion: CongestionLevel;
  average_speed_kmh: number;
  normal_speed_kmh: number;
  estimated_delay_minutes: number;
  capacity_used_pct: number;
  nearby_hotspots: string[];
  lat: number;
  lng: number;
  last_updated: string;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface RouteOption {
  name: string;
  distance_km: number;
  estimated_time_minutes: number;
  congestion: CongestionLevel;
  coordinates: Coordinate[];
}

export interface SignalRecommendation {
  junction: string;
  action: string;
  duration_seconds: number;
}

export type AgentEventType = 'status' | 'thinking' | 'tool_call' | 'output' | 'warning' | 'approval_required';
export type AgentStatus = 'Waiting' | 'Running' | 'Tool Call' | 'Completed' | 'Failed';

export interface AgentEvent {
  event_id: string;
  session_id: string;
  agent_name: string;
  event_type: AgentEventType;
  status: AgentStatus;
  timestamp: string;
  summary: string;
  details?: Record<string, any>;
}

export interface AgentSession {
  session_id: string;
  user_query: string;
  status: 'processing' | 'completed' | 'error';
  started_at: string;
  completed_at?: string;
  final_recommendation_id?: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Recommendation {
  recommendation_id: string;
  session_id: string;
  summary: string;
  incident_type: IncidentType;
  severity: IncidentSeverity;
  emergency_detected: boolean;
  vehicle_type?: string;
  origin?: string;
  destination?: string;
  recommended_route: RouteOption;
  alternative_route?: RouteOption;
  estimated_time_saved_minutes: number;
  signal_strategy: string;
  signals_affected: number;
  signal_recommendations: SignalRecommendation[];
  risk_level: RiskLevel;
  confidence_score: number;
  requires_human_approval: boolean;
  approval_status: ApprovalStatus;
  approved_by?: string;
  reasoning_summary: string;
  created_at: string;
}

export interface EmergencyVehicle {
  vehicle_id: string;
  type: 'AMBULANCE' | 'FIRE_BRIGADE' | 'POLICE' | 'DISASTER_RESPONSE';
  unit_code: string;
  status: 'EN_ROUTE' | 'STANDBY' | 'ARRIVED';
  current_location: string;
  destination: string;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  eta_minutes: number;
}
