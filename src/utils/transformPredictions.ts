import {
    TowerPrediction,
    CalendarPrediction,
    DayPredictionDetails,
} from '../types/tower'

export const transformPredictionsForCalendar = (
    predictions: TowerPrediction[],
): Record<string, CalendarPrediction> => {
    const calendarData: Record<string, CalendarPrediction> = {}

    predictions.forEach((tower) => {
        tower.predictions.forEach((pred) => {
            if (!calendarData[pred.date]) {
                calendarData[pred.date] = {
                    date: pred.date,
                    count: 0,
                    risk: 'low',
                    towers: [],
                    primaryType: pred.failureType,
                }
            }

            const day = calendarData[pred.date]
            day.count++
            day.towers.push(tower.towerId)

            // Update risk level if current prediction is higher
            if (getRiskLevel(pred.riskLevel) > getRiskLevel(day.risk)) {
                day.risk = pred.riskLevel
            }
        })
    })

    return calendarData
}

const getRiskLevel = (risk: string): number => {
    const levels = { low: 0, medium: 1, high: 2, critical: 3 }
    return levels[risk as keyof typeof levels] || 0
}
