import axios from 'axios'
import { TowerPrediction, DailyPrediction } from '../types/tower'

export class TowerPredictionService {
    private readonly baseUrl = 'http://192.168.0.106:8000'

    async getPrediction(
        towerId: string,
        date: string,
    ): Promise<TowerPrediction> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/predict/tower/${towerId}?date=${date}`,
            )
            return this.transformPredictionResponse(response.data)
        } catch (error) {
            throw new Error(`Failed to fetch tower prediction: ${error}`)
        }
    }

    async getBatchPredictions(
        towerIds: string[],
        startDate: string,
        endDate: string,
    ): Promise<TowerPrediction[]> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/predict/towers`,
                {
                    tower_ids: towerIds,
                    start_date: startDate,
                    end_date: endDate,
                },
            )
            return response.data.map(this.transformPredictionResponse)
        } catch (error) {
            throw new Error(`Failed to fetch batch predictions: ${error}`)
        }
    }

    private transformPredictionResponse(data: any): TowerPrediction {
        return {
            towerId: data.tower_id,
            predictions: data.predictions.map(
                (p: any): DailyPrediction => ({
                    date: p.date,
                    value: p.value,
                    confidence: p.confidence,
                    riskLevel: this.calculateRiskLevel(p.value, p.confidence),
                    failureType: p.failure_type || 'Unknown',
                }),
            ),
        }
    }

    private calculateRiskLevel(
        value: number,
        confidence: number,
    ): 'low' | 'medium' | 'high' | 'critical' {
        if (value < 0.3) return 'low'
        if (value < 0.6) return 'medium'
        if (value < 0.8) return 'high'
        return 'critical'
    }
}
