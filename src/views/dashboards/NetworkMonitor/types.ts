export interface FailureRecord {
    date: string;
    reason: string;
}

export interface PerformanceData {
    label: string;
    value: number;
}

export interface Tower {
    id: string;
    name: string;
    location: string;
    position: { x: number; y: number };
    status: 'operational' | 'at-risk' | 'failed';
    signalStrength: number;
    failureProbability: number;
    lastMaintenance: string;
    nextMaintenance?: string;
    failureHistory: FailureRecord[];
    performanceHistory: PerformanceData[];
}