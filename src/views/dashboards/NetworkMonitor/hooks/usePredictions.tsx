import { useState } from 'react'
import { TowerPredictionService } from '../../../../services/TowerPredictionService'
import { TowerPredictionResponse } from '../../../../types/prediction'

const predictionService = new TowerPredictionService()

export const usePredictions = () => {
    const [predictions, setPredictions] = useState<TowerPredictionResponse[]>(
        [],
    )
    const [isLoading, setIsLoading] = useState(false)

    const fetchPredictions = async (towerId: string, location: string) => {
        setIsLoading(true)
        try {
            const dates = Array.from({ length: 3 }).map((_, i) => {
                const date = new Date()
                date.setDate(date.getDate() + i + 1)
                return date.toISOString().split('T')[0]
            })

            const predictions = await Promise.all(
                dates.map((date) =>
                    predictionService.getPrediction(towerId, location, date),
                ),
            )

            setPredictions(predictions)
        } catch (error) {
            console.error('Error fetching predictions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return { predictions, isLoading, fetchPredictions }
}
