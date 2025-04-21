import React from 'react'
import { Cloud, BarChart3, Activity, Zap, Calendar, Loader } from 'lucide-react'
import { useTower } from '../context/TowerContext'
import RiskTimeline from './RiskTimeline'

interface MonitoringSectionProps {
    className?: string
}

const MonitoringSection: React.FC<MonitoringSectionProps> = ({
    className = '',
}) => {
    const { towers, selectedTower, predictions, isPredicting } = useTower()

    // Calculate some metrics
    const systemHealth = 82
    const networkLoad = 68
    const highRiskTowers = towers.filter(
        (t) => t.failureProbability > 50,
    ).length

    return (
        <div
            className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 ${className}`}
        >
            <h2 className="text-lg font-bold mb-3 text-gray-900">
                Real-time Monitoring
            </h2>
            {/* Predictions Section */}
            {selectedTower && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                    <h3 className="text-sm font-medium flex items-center mb-2 text-gray-800">
                        <Calendar className="h-4 w-4 text-primary mr-1" />
                        3-Day Predictions for {selectedTower.name}
                    </h3>
                    {isPredicting ? (
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Loader className="h-4 w-4 animate-spin" />
                            Loading predictions...
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {predictions.map((prediction, index) => {
                                const date = new Date(prediction.date)
                                const dateStr = date.toLocaleDateString()

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col bg-white p-3 rounded border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-sm">
                                                <span className="font-medium">
                                                    {dateStr}
                                                </span>
                                            </div>
                                        </div>
                                        {prediction.predicted_failure && (
                                            <div className="text-xs bg-error/10 text-error rounded p-2">
                                                <span className="font-medium">
                                                    Potential Failure:{' '}
                                                </span>
                                                {
                                                    prediction.failure_type
                                                        .failure_type
                                                }
                                                <span className="text-gray-500 ml-1">
                                                    (
                                                    {Math.round(
                                                        prediction.failure_type
                                                            .type_probability *
                                                            100,
                                                    )}
                                                    % confidence)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Existing sections */}
            {/* Risk timeline */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                <h3 className="text-sm font-medium flex items-center mb-2 text-gray-800">
                    <Activity className="h-4 w-4 text-primary mr-1" />
                    Failure Prediction Timeline
                </h3>
                <RiskTimeline />
            </div>

            {/* Weather conditions */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                <h3 className="text-sm font-medium flex items-center mb-2 text-gray-800">
                    <Cloud className="h-4 w-4 text-info mr-1" />
                    Weather Conditions
                </h3>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <img
                            src="https://images.pexels.com/photos/3032117/pexels-photo-3032117.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt="Weather"
                            className="h-10 w-10 rounded mr-2 object-cover"
                        />
                        <div>
                            <div className="font-medium text-gray-800">
                                Heavy Rain
                            </div>
                            <div className="text-xs text-gray-500">
                                Affecting {highRiskTowers} towers
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-warning font-medium">
                            High Risk
                        </div>
                        <div className="text-xs text-gray-500">
                            Wind: 25 mph
                        </div>
                    </div>
                </div>
            </div>

            {/* System metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard
                    icon={<BarChart3 className="h-4 w-4 text-primary" />}
                    label="System Health"
                    value={`${systemHealth}%`}
                    color={getHealthColor(systemHealth)}
                />
                <MetricCard
                    icon={<Zap className="h-4 w-4 text-warning" />}
                    label="Network Load"
                    value={`${networkLoad}%`}
                    color={getLoadColor(networkLoad)}
                />
            </div>
        </div>
    )
}

const MetricCard: React.FC<{
    icon: React.ReactNode
    label: string
    value: string
    color: string
}> = ({ icon, label, value, color }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 flex items-center">
                    {icon}
                    <span className="ml-1">{label}</span>
                </div>
                <div className={`text-sm font-medium ${color}`}>{value}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                    className={`h-1.5 rounded-full ${color.replace('text', 'bg')}`}
                    style={{ width: value }}
                ></div>
            </div>
        </div>
    )
}

// Helper functions for color coding
const getHealthColor = (health: number) => {
    if (health > 80) return 'text-success'
    if (health > 50) return 'text-warning'
    return 'text-error'
}

const getLoadColor = (load: number) => {
    if (load < 30) return 'text-success'
    if (load < 70) return 'text-warning'
    return 'text-error'
}

export default MonitoringSection
