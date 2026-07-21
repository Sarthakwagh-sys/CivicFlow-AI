import { mcpServer } from '../mcpServer';
import { RouteOption } from '../../src/types';

export interface RouteAnalysisResult {
  origin: string;
  destination: string;
  recommended_route: RouteOption;
  alternative_route: RouteOption;
  estimated_time_saved_minutes: number;
  reasoning: string;
}

export async function runRouteAgent(origin: string, destination: string): Promise<RouteAnalysisResult> {
  const routesData = mcpServer.getRoutes(origin, destination);

  return {
    origin,
    destination,
    recommended_route: routesData.recommended_route,
    alternative_route: routesData.primary_route,
    estimated_time_saved_minutes: routesData.estimated_time_saved_minutes,
    reasoning: routesData.recommendation_reasoning,
  };
}
