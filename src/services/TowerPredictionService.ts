import axios from 'axios'
import { TowerPredictionResponse } from '../types/prediction'

export class TowerPredictionService {
    private readonly baseUrl = 'http://192.168.0.106:8000'

    async getPrediction(
        towerId: string,
        location: string,
        date: string,
    ): Promise<TowerPredictionResponse> {
        try {
            console.log('RESYESSS ', {
                tower_id: towerId,
                location: location,
                date: date,
            })
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
            console.log('Prediction response:', response.data)
            return response.data
        } catch (error) {
            throw new Error(`Failed to fetch tower prediction: ${error}`)
        }
    }

    async getBatchPredictions(
        towers: { towerId: string; location: string }[],
        date: string,
    ): Promise<TowerPredictionResponse[]> {
        try {
            const predictions = await Promise.all(
                towers.map((tower) =>
                    this.getPrediction(tower.towerId, tower.location, date),
                ),
            )
            console.log('Batch predictions response:', predictions)
            return predictions
        } catch (error) {
            console.error('Batch predictions error:', error)
            throw new Error(`Failed to fetch batch predictions: ${error}`)
        }
    }
}
