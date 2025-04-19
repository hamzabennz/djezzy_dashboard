export interface TowerPrediction {
    towerId: string
    predictions: DailyPrediction[]
}

export interface DailyPrediction {
    date: string
    value: number
    confidence: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    failureType: string
}

export interface CalendarPrediction {
    date: string
    count: number
    risk: 'low' | 'medium' | 'high' | 'critical'
    towers: string[]
    primaryType: string
}

export interface DayPredictionDetails {
    towerId: string
    location: string
    riskScore: number
    failureType: string
    predictedTime: string
    estimatedDowntime: string
    impactedUsers: number
    maintenanceWindow: string
    recommendation: string
}
