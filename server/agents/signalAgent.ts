import { mcpServer } from '../mcpServer';
import { SignalRecommendation } from '../../src/types';

export interface SignalAnalysisResult {
  strategy: string;
  signals_affected: number;
  recommendations: SignalRecommendation[];
  requires_human_approval: boolean;
  disclaimer: string;
}

export async function runSignalAgent(routeName: string, priority: string): Promise<SignalAnalysisResult> {
  const signalData = mcpServer.simulateSignalStrategy(routeName, priority);

  return {
    strategy: signalData.strategy,
    signals_affected: signalData.signals_affected,
    recommendations: signalData.recommendations,
    requires_human_approval: true,
    disclaimer: 'SIMULATION / RECOMMENDATION — NOT CONNECTED TO LIVE TRAFFIC INFRASTRUCTURE',
  };
}
