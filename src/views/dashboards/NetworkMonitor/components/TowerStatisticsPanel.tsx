import React from 'react'
import { useTower } from '../context/TowerContext'
import {
    MapPin,
    Signal,
    AlertTriangle,
    Calendar,
    BarChart,
    AlertCircle,
    Clock,
    Wrench,
    ChevronDown,
    ChevronUp,
    X,
} from 'lucide-react'
import PerformanceChart from './PerformanceChart'

const TowerStatisticsPanel: React.FC = () => {
    const { selectedTower, deselectTower } = useTower()
    const [expanded, setExpanded] = React.useState(true)

    if (!selectedTower) return null

    // Determine status color
    const getStatusColor = () => {
        switch (selectedTower.status) {
            case 'operational':
                return 'bg-success'
            case 'at-risk':
                return 'bg-warning'
            case 'failed':
                return 'bg-error'
            default:
                return 'bg-info'
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* Header with toggle */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center">
                    <div
                        className={`h-3 w-3 rounded-full mr-2 ${getStatusColor()}`}
                    ></div>
                    <h2 className="text-lg font-bold text-gray-900">
                        {selectedTower.id}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        className="bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5 text-gray-500"
                        onClick={(e) => {
                            e.stopPropagation()
                            deselectTower()
                        }}
                    >
                        <span className="sr-only">Close</span>
                        <X className="h-5 w-5" />
                    </button>
                    <button
                        className="bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5"
                        onClick={(e) => {
                            e.stopPropagation()
                            setExpanded(!expanded)
                        }}
                    >
                        {expanded ? (
                            <ChevronUp className="h-5 w-5" />
                        ) : (
                            <ChevronDown className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expandable content */}
            {expanded && (
                <div className="px-4 pb-4 animate-fadeIn space-y-4">
                    {/* Basic info */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem
                            icon={<MapPin className="h-4 w-4 text-primary" />}
                            label="Location"
                            value={selectedTower.location}
                        />
                        <InfoItem
                            icon={<Signal className="h-4 w-4 text-info" />}
                            label="Signal Strength"
                            value={`${selectedTower.signalStrength}%`}
                        />
                        <InfoItem
                            icon={
                                <AlertTriangle className="h-4 w-4 text-warning" />
                            }
                            label="Failure Probability"
                            value={`${selectedTower.failureProbability}%`}
                        />
                        <InfoItem
                            icon={
                                <Calendar className="h-4 w-4 text-gray-500" />
                            }
                            label="Last Maintenance"
                            value={formatDate(selectedTower.lastMaintenance)}
                        />
                    </div>

                    {/* Performance chart */}
                    <div className="mt-4">
                        <h3 className="text-sm font-medium flex items-center mb-2">
                            <BarChart className="h-4 w-4 text-primary mr-1" />
                            Performance Metrics
                        </h3>
                        <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-200 p-4 h-40">
                            <PerformanceChart
                                data={selectedTower.performanceHistory}
                            />
                        </div>
                    </div>

                    {/* Historical failures */}
                    {selectedTower.failureHistory.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium flex items-center mb-2">
                                <AlertCircle className="h-4 w-4 text-error mr-1" />
                                Historical Failures
                            </h3>
                            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-200 p-2">
                                {selectedTower.failureHistory.map(
                                    (failure, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                                        >
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 text-gray-400 mr-2" />
                                                <span className="text-xs">
                                                    {formatDate(failure.date)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {failure.reason}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}

                    {/* Maintenance schedule */}
                    <div className="mt-4">
                        <h3 className="text-sm font-medium flex items-center mb-2">
                            <Wrench className="h-4 w-4 text-info mr-1" />
                            Upcoming Maintenance
                        </h3>
                        <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-200 p-4 text-center">
                            <div className="text-sm">
                                {selectedTower.nextMaintenance
                                    ? `Scheduled for ${formatDate(selectedTower.nextMaintenance)}`
                                    : 'No upcoming maintenance scheduled'}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4">
                        <button className="bg-primary hover:bg-primary-deep text-white rounded-lg px-3 py-2 text-sm flex-1 flex items-center justify-center">
                            <Wrench className="h-4 w-4 mr-1" />
                            Schedule Maintenance
                        </button>
                        <button
                            className={`${
                                selectedTower.status === 'failed'
                                    ? 'bg-error hover:bg-error/90'
                                    : 'bg-gray-500 hover:bg-gray-600'
                            } text-white rounded-lg px-3 py-2 text-sm flex-1 flex items-center justify-center`}
                        >
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {selectedTower.status === 'failed'
                                ? 'Report Issue'
                                : 'Run Diagnostics'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const InfoItem: React.FC<{
    icon: React.ReactNode
    label: string
    value: string
}> = ({ icon, label, value }) => {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <div className="text-xs text-gray-500 flex items-center">
                {icon}
                <span className="ml-1">{label}</span>
            </div>
            <div className="text-sm font-medium mt-1">{value}</div>
        </div>
    )
}

export default TowerStatisticsPanel
