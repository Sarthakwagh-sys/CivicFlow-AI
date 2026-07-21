import { PUNE_LOCATIONS } from '../src/data/simulationData';
import { store } from './store';
import { RouteOption, SignalRecommendation } from '../src/types';

export class CivicFlowMcpServer {
  /**
   * Tool 1: get_traffic_status
   */
  public getTrafficStatus(location: string) {
    const snap = store.getTrafficForLocation(location);
    if (snap) {
      return {
        location: snap.location,
        congestion: snap.congestion,
        average_speed_kmh: snap.average_speed_kmh,
        normal_speed_kmh: snap.normal_speed_kmh,
        delay_minutes: snap.estimated_delay_minutes,
        capacity_used_pct: snap.capacity_used_pct,
        nearby_hotspots: snap.nearby_hotspots,
        source: 'CIVICFLOW_MCP_TRAFFIC_DATA_FEED',
      };
    }
    return {
      location: location,
      congestion: 'HIGH',
      average_speed_kmh: 15,
      normal_speed_kmh: 45,
      delay_minutes: 18,
      capacity_used_pct: 88,
      nearby_hotspots: ['Junction A', 'Junction B'],
      source: 'CIVICFLOW_MCP_SIMULATED_DATA',
    };
  }

  /**
   * Tool 2: get_nearby_incidents
   */
  public getNearbyIncidents(location: string) {
    const locLower = location.toLowerCase();
    const incidents = store.getIncidents().filter(
      (inc) => inc.location.toLowerCase().includes(locLower) || locLower.includes('aundh') || locLower.includes('university')
    );
    return {
      location,
      incident_count: incidents.length,
      incidents: incidents.map((i) => ({
        id: i.id,
        type: i.type,
        severity: i.severity,
        status: i.status,
        description: i.description,
      })),
    };
  }

  /**
   * Tool 3: get_routes
   */
  public getRoutes(origin: string, destination: string) {
    const origCoord = PUNE_LOCATIONS[origin] || PUNE_LOCATIONS['Aundh Road'];
    const destCoord = PUNE_LOCATIONS[destination] || PUNE_LOCATIONS['Hospital A (Sahyadri Hospital Aundh)'];

    // Primary route (direct via Ganeshkhind/University Circle - currently congested)
    const primaryRoute: RouteOption = {
      name: 'Route A (Via Ganeshkhind Road / University Circle)',
      distance_km: 5.2,
      estimated_time_minutes: 20,
      congestion: 'CRITICAL',
      coordinates: [
        origCoord,
        { lat: 18.555, lng: 73.818 },
        { lat: 18.552, lng: 73.826 }, // University Circle
        { lat: 18.553, lng: 73.818 },
        destCoord,
      ],
    };

    // Alternative recommended route (via Pashan Bypass Road - clear)
    const recommendedRoute: RouteOption = {
      name: 'Route B (Via Pashan Bypass Corridor)',
      distance_km: 6.4,
      estimated_time_minutes: 12,
      congestion: 'MODERATE',
      coordinates: [
        origCoord,
        { lat: 18.548, lng: 73.801 },
        { lat: 18.539, lng: 73.799 }, // Pashan Rd
        { lat: 18.545, lng: 73.808 },
        destCoord,
      ],
    };

    // Second alternative (via Baner Link Road)
    const alternativeRoute2: RouteOption = {
      name: 'Route C (Via Baner Link Road & Abhimanshree)',
      distance_km: 7.1,
      estimated_time_minutes: 16,
      congestion: 'LOW',
      coordinates: [
        origCoord,
        { lat: 18.559, lng: 73.786 },
        { lat: 18.551, lng: 73.795 },
        destCoord,
      ],
    };

    return {
      origin,
      destination,
      primary_route: primaryRoute,
      recommended_route: recommendedRoute,
      alternative_route: alternativeRoute2,
      estimated_time_saved_minutes: 8,
      recommendation_reasoning:
        'Route B bypasses University Circle accident blockage, saving 8 minutes despite being 1.2 km longer.',
    };
  }

  /**
   * Tool 4: get_emergency_vehicle
   */
  public getEmergencyVehicle(vehicleId: string) {
    const vehicle = store.getEmergencyVehicles().find((v) => v.vehicle_id === vehicleId || v.unit_code.includes(vehicleId));
    if (vehicle) {
      return vehicle;
    }
    return {
      vehicle_id: vehicleId || 'AMB_009',
      type: 'AMBULANCE',
      unit_code: 'AMB-09 (Cardiac Emergency Unit)',
      status: 'EN_ROUTE',
      current_location: 'Aundh Road',
      destination: 'Hospital A (Sahyadri Hospital Aundh)',
      priority: 'CRITICAL',
      eta_minutes: 12,
    };
  }

  /**
   * Tool 5: get_signal_network
   */
  public getSignalNetwork(routeName: string) {
    return {
      route_name: routeName,
      junctions: [
        { junction: 'Junction A (Aundh Road / Brehmen Chowk)', current_phase: 'RED', cycle_time_s: 120 },
        { junction: 'Junction B (Pashan Link Crossing)', current_phase: 'GREEN', cycle_time_s: 90 },
        { junction: 'Junction C (Abhimanshree Circle)', current_phase: 'YELLOW', cycle_time_s: 90 },
        { junction: 'Junction D (Hospital Gate Approach)', current_phase: 'RED', cycle_time_s: 60 },
      ],
    };
  }

  /**
   * Tool 6: simulate_signal_strategy
   */
  public simulateSignalStrategy(routeName: string, priority: string) {
    const recommendations: SignalRecommendation[] = [
      { junction: 'Junction A (Brehmen Chowk)', action: 'Extend green phase by 20 seconds for emergency corridor', duration_seconds: 20 },
      { junction: 'Junction B (Pashan Link)', action: 'Prioritize northbound ambulance direction', duration_seconds: 30 },
      { junction: 'Junction C (Abhimanshree)', action: 'Hold cross-traffic on red until ambulance passes', duration_seconds: 15 },
      { junction: 'Junction D (Hospital Approach)', action: 'Pre-clear gate junction cycle', duration_seconds: 15 },
    ];

    return {
      strategy: 'SIMULATED_GREEN_CORRIDOR',
      route: routeName,
      priority,
      signals_affected: recommendations.length,
      recommendations,
      requires_human_approval: true,
      disclaimer: 'SIMULATION ONLY — NOT CONNECTED TO LIVE TRAFFIC INFRASTRUCTURE',
    };
  }
}

export const mcpServer = new CivicFlowMcpServer();
