import { mcpServer } from '../mcpServer';

export interface EmergencyAnalysisResult {
  emergency_detected: boolean;
  vehicle_type: 'AMBULANCE' | 'FIRE_BRIGADE' | 'POLICE' | 'DISASTER_RESPONSE' | 'NONE';
  unit_code: string;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  current_location: string;
  destination: string;
  routing_required: boolean;
  recommended_strategy: string;
}

export async function runEmergencyAgent(userQuery: string, extractedLocation: string): Promise<EmergencyAnalysisResult> {
  const queryLower = userQuery.toLowerCase();

  const isAmbulance = queryLower.includes('ambulance') || queryLower.includes('hospital') || queryLower.includes('patient');
  const isFire = queryLower.includes('fire') || queryLower.includes('engine');
  const isPolice = queryLower.includes('police') || queryLower.includes('patrol');

  if (!isAmbulance && !isFire && !isPolice) {
    return {
      emergency_detected: false,
      vehicle_type: 'NONE',
      unit_code: 'N/A',
      priority: 'NORMAL',
      current_location: extractedLocation,
      destination: 'N/A',
      routing_required: false,
      recommended_strategy: 'Standard traffic monitoring',
    };
  }

  const vehicleType = isAmbulance ? 'AMBULANCE' : isFire ? 'FIRE_BRIGADE' : 'POLICE';
  const vehicleData = mcpServer.getEmergencyVehicle('AMB_009');

  let dest = 'Hospital A (Sahyadri Hospital Aundh)';
  if (queryLower.includes('hospital b') || queryLower.includes('ruby hall')) {
    dest = 'Hospital B (Ruby Hall Clinic)';
  } else if (queryLower.includes('hospital a') || queryLower.includes('sahyadri')) {
    dest = 'Hospital A (Sahyadri Hospital Aundh)';
  }

  return {
    emergency_detected: true,
    vehicle_type: vehicleType,
    unit_code: vehicleData.unit_code,
    priority: 'CRITICAL',
    current_location: extractedLocation || vehicleData.current_location,
    destination: dest,
    routing_required: true,
    recommended_strategy: 'Evaluate emergency corridor bypass and clear signal progression',
  };
}
