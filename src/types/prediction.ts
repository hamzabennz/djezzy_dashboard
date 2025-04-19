export interface TowerPredictionResponse {
    tower_id: string
    location: string
    date: string
    failure_probability: number
    predicted_failure: boolean
    failure_type: {
        failure_type: string
        type_probability: number
    }
}

export interface DailyPredictions {
    [key: string]: {
        count: number
        risk: 'low' | 'medium' | 'high' | 'critical'
        towers: TowerPredictionResponse[]
        primaryType: string
    }
}
