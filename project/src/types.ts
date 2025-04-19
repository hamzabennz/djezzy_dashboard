export interface Tower {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'at-risk' | 'failed';
  position: { x: number; y: number };
  signalStrength: number;
  failureProbability: number;
  lastMaintenance: string;
  nextMaintenance: string | null;
  performanceHistory: PerformanceData[];
  failureHistory: FailureRecord[];
  visible: boolean;
}

export interface PerformanceData {
  label: string;
  value: number;
}

export interface FailureRecord {
  date: string;
  reason: string;
  duration: number; // in hours
}

export interface WeatherCondition {
  type: 'rain' | 'storm' | 'wind' | 'clear' | 'snow';
  severity: 'low' | 'medium' | 'high';
  affectedTowers: string[]; // tower IDs
}