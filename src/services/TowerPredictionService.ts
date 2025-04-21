import axios from 'axios'
import { TowerPredictionResponse } from '../types/prediction'

export class TowerPredictionService {
    private readonly baseUrl = 'http://192.168.0.102:8000'

    async getPrediction(
        towerId: string,
        location: string,
        date: string,
    ): Promise<TowerPredictionResponse> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/predict/tower`,
                {
                    tower_id: towerId,
                    location: location,
                    date: date,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            return response.data
        } catch (error) {
            throw new Error(`Failed to fetch tower prediction: ${error}`)
        }
    }

    async getBatchPredictions(
        towers: { tower_id: string; location: string; date: string }[],
    ): Promise<TowerPredictionResponse[]> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/predict/batch`,
                { towers },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            return response.data
        } catch (error) {
            throw new Error(`Failed to fetch batch predictions: ${error}`)
        }
    }
}
