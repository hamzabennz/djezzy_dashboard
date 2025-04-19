import React from 'react'

interface PredictionCardProps {
    prediction: {
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
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
    prediction,
}) => {
    const getRiskColor = (probability: number) => {
        if (probability >= 0.8) return 'bg-red-100 border-red-500 text-red-700'
        if (probability >= 0.5)
            return 'bg-yellow-100 border-yellow-500 text-yellow-700'
        return 'bg-green-100 border-green-500 text-green-700'
    }

    const riskClass = getRiskColor(prediction.failure_probability)

    return (
        <div
            className={`rounded-lg border p-6 ${riskClass} transition-all hover:shadow-lg`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        {prediction.tower_id}
                    </h3>
                    <p className="text-sm opacity-75">{prediction.location}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">
                        {(prediction.failure_probability * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm">Failure Risk</div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Predicted Failure:</span>
                    <span className="font-medium">
                        {prediction.predicted_failure ? 'Yes' : 'No'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Failure Type:</span>
                    <span className="font-medium">
                        {prediction.failure_type.failure_type}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Type Probability:</span>
                    <span className="font-medium">
                        {(
                            prediction.failure_type.type_probability * 100
                        ).toFixed(1)}
                        %
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Prediction Date:</span>
                    <span className="font-medium">
                        {new Date(prediction.date).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    )
}
