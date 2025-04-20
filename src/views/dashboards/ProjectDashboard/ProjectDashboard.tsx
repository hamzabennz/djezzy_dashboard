import {
    BarChart,
    LineChart,
    PieChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    Pie,
    Cell,
} from 'recharts'
import {
    Calendar,
    Clock,
    AlertTriangle,
    Check,
    Activity,
    Zap,
    ArrowUpCircle,
    ChevronLeft,
    ChevronRight,
    AlarmClock,
    AlertOctagon,
    Server,
} from 'lucide-react'

import { useState, useEffect } from 'react'
import { TowerPredictionService } from '@/services/TowerPredictionService'
import { towersData } from '@/mock/data/towersData'
import { TowerPredictionResponse, DailyPredictions } from '@/types/prediction'
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import axios from 'axios'

export const ProjectDashboard = () => {
    console.log('towersData:', towersData)
    const [predictions, setPredictions] = useState<DailyPredictions>({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const [currentTower, setCurrentTower] = useState<string | null>(null)
    const [currentDay, setCurrentDay] = useState<string | null>(null)

    useEffect(() => {
        fetchNextThreeDaysPredictions()
    }, [])

    const fetchMonthPredictions = async () => {
        setIsLoading(true)
        setError(null)

        const service = new TowerPredictionService()
        const today = new Date()
        const dateStr = format(today, 'yyyy-MM-dd')
        const dailyPredictions: DailyPredictions = {}

        try {
            const predictions: TowerPredictionResponse[] = []

            // Fetch predictions for each tower for today only
            for (const towerId of towersData) {
                const location = `Location_${towerId.slice(3)}`
                const prediction = await service.getPrediction(
                    towerId,
                    location,
                    dateStr,
                )
                predictions.push(prediction)
            }

            // Filter only failed predictions
            const failedPredictions = predictions.filter(
                (p) => p.predicted_failure,
            )

            if (failedPredictions.length > 0) {
                const maxProb = Math.max(
                    ...failedPredictions.map((p) => p.failure_probability),
                )
                dailyPredictions[dateStr] = {
                    count: failedPredictions.length,
                    risk: getRiskLevel(maxProb),
                    towers: failedPredictions,
                    primaryType: getMostCommonFailureType(failedPredictions),
                }
            }

            setPredictions(dailyPredictions)
            setSelectedDay(dateStr) // Automatically select today
        } catch (err) {
            setError('Failed to fetch predictions')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchNextThreeDaysPredictions = async () => {
        setIsLoading(true)
        setError(null)

        const service = new TowerPredictionService()
        const today = new Date()
        const nextThreeDays = Array.from({ length: 3 }, (_, i) => {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            return format(date, 'yyyy-MM-dd')
        })

        const dailyPredictions: DailyPredictions = {}

        try {
            // Create a batch of requests for all towers across all 3 days
            const batchRequests = nextThreeDays.flatMap((dateStr) =>
                towersData.map((towerId) => ({
                    towerId,
                    location: `Location_${towerId.slice(3)}`,
                    date: dateStr,
                })),
            )

            // Fetch all predictions in parallel
            for (const { towerId, location, date } of batchRequests) {
                try {
                    setCurrentTower(towerId) // Update current tower
                    setCurrentDay(date) // Update current day
                    const prediction = await service.getPrediction(
                        towerId,
                        location,
                        date,
                    )
                    if (prediction.predicted_failure) {
                        if (!dailyPredictions[date]) {
                            dailyPredictions[date] = {
                                count: 0,
                                risk: 'low',
                                towers: [],
                                primaryType: '',
                            }
                        }

                        const dayData = dailyPredictions[date]
                        dayData.count += 1
                        dayData.towers.push(prediction)
                        dayData.risk = getRiskLevel(
                            Math.max(
                                ...dayData.towers.map(
                                    (p) => p.failure_probability,
                                ),
                            ),
                        )
                        dayData.primaryType = getMostCommonFailureType(
                            dayData.towers,
                        )
                    }
                } catch (err) {
                    console.error(
                        `Failed to fetch prediction for tower ${towerId} on ${date}:`,
                        err,
                    )
                }
            }

            setPredictions(dailyPredictions)
            setSelectedDay(nextThreeDays[0]) // Automatically select the first day
        } catch (err) {
            setError('Failed to fetch predictions')
            console.error(err)
        } finally {
            setCurrentTower(null) // Clear current tower after loading
            setCurrentDay(null) // Clear current day after loading
            setIsLoading(false)
        }
    }

    const getRiskLevel = (
        probability: number,
    ): 'low' | 'medium' | 'high' | 'critical' => {
        if (probability < 0.3) return 'low'
        if (probability < 0.6) return 'medium'
        if (probability < 0.8) return 'high'
        return 'critical'
    }

    const getMostCommonFailureType = (
        predictions: TowerPredictionResponse[],
    ): string => {
        const types = predictions.map((p) => p.failure_type.failure_type)
        return (
            types
                .sort(
                    (a, b) =>
                        types.filter((v) => v === a).length -
                        types.filter((v) => v === b).length,
                )
                .pop() || 'Unknown'
        )
    }

    const getDayDetails = (date: string) => {
        const towers = predictions[date]?.towers || []
        return Array.isArray(towers) ? towers : [towers]
    }

    // Update calendar rendering to use new predictions format
    const renderCalendarDay = (dayObj: { date: string; day: number }) => {
        const prediction = predictions[dayObj.date]

        return (
            <div className="h-full flex flex-col">
                <div className="text-right text-sm">{dayObj.day}</div>
                {prediction && (
                    <div className="flex-1 flex flex-col items-center justify-center mt-1">
                        <div
                            className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold
                            ${prediction.risk === 'low' ? 'bg-green-500' : ''}
                            ${prediction.risk === 'medium' ? 'bg-yellow-500' : ''}
                            ${prediction.risk === 'high' ? 'bg-orange-500' : ''}
                            ${prediction.risk === 'critical' ? 'bg-red-500' : ''}
                        `}
                        >
                            {prediction.count}
                        </div>
                        <div className="text-xs text-center mt-1 truncate w-full">
                            {prediction.primaryType}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Update selected day details view
    const renderDayDetails = () => {
        if (!selectedDay) return null

        const details = getDayDetails(selectedDay)
        if (!details || details.length === 0) return null

        // Ensure details is always an array
        const detailsArray = Array.isArray(details) ? details : [details]

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <AlertOctagon className="text-red-500 mr-2" size={20} />
                        <span className="font-medium">
                            {detailsArray.length} Predicted Failures
                        </span>
                    </div>
                    <RiskBadge
                        risk={getRiskLevel(
                            Math.max(
                                ...detailsArray.map(
                                    (d) => d.failure_probability,
                                ),
                            ),
                        )}
                    />
                </div>

                <div className="overflow-auto max-h-96">
                    {detailsArray.map((prediction, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg mb-3"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-lg">
                                    Tower ID:{' '}
                                    {prediction.tower_id || prediction.towerId}
                                </div>
                                <RiskIndicator
                                    score={Math.round(
                                        prediction.failure_probability * 100,
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div>
                                    <span className="text-gray-500">
                                        Location:
                                    </span>{' '}
                                    {prediction.location}
                                </div>
                                <div>
                                    <span className="text-gray-500">
                                        Failure Type:
                                    </span>{' '}
                                    {prediction.failure_type?.failure_type ||
                                        prediction.failureType}
                                </div>
                                {prediction.predictedTime && (
                                    <div className="flex items-center">
                                        <AlarmClock
                                            size={14}
                                            className="mr-1"
                                        />
                                        <span className="text-gray-500 mr-1">
                                            Predicted Time:
                                        </span>{' '}
                                        {prediction.predictedTime}
                                    </div>
                                )}
                                {prediction.estimatedDowntime && (
                                    <div>
                                        <span className="text-gray-500">
                                            Est. Downtime:
                                        </span>{' '}
                                        {prediction.estimatedDowntime}
                                    </div>
                                )}
                                {prediction.impactedUsers && (
                                    <div>
                                        <span className="text-gray-500">
                                            Impacted Users:
                                        </span>{' '}
                                        {prediction.impactedUsers.toLocaleString()}
                                    </div>
                                )}
                                {prediction.maintenanceWindow && (
                                    <div>
                                        <span className="text-gray-500">
                                            Maintenance Window:
                                        </span>{' '}
                                        {prediction.maintenanceWindow}
                                    </div>
                                )}
                            </div>
                            {prediction.recommendation && (
                                <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-500 text-sm">
                                    <div className="font-medium text-blue-800 mb-1">
                                        Recommendation
                                    </div>
                                    {prediction.recommendation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Hardcoded prediction data
    const data = {
        predictionSummary: {
            towersMonitored: 157,
            predictedFailures: 14,
            highRiskTowers: 8,
            averageDowntime: '3.2 hours',
            maintenanceEfficiency: 84,
        },
        failureTypePrediction: [
            { name: 'Hardware Malfunction', value: 42 },
            { name: 'Power Outage', value: 28 },
            { name: 'Software Error', value: 15 },
            { name: 'Weather Damage', value: 10 },
            { name: 'Connectivity Issue', value: 5 },
        ],
        timelinePrediction: [
            { day: 'Mon', predictions: 2, actual: 1 },
            { day: 'Tue', predictions: 1, actual: 1 },
            { day: 'Wed', predictions: 3, actual: 2 },
            { day: 'Thu', predictions: 2, actual: 3 },
            { day: 'Fri', predictions: 4, actual: 3 },
            { day: 'Sat', predictions: 1, actual: 0 },
            { day: 'Sun', predictions: 1, actual: 2 },
        ],
        riskTowers: [
            {
                id: 'TWR-1042',
                riskScore: 89,
                failureType: 'Hardware Malfunction',
                predictedDowntime: '4.5 hours',
                lastFailure: '22 days ago',
            },
            {
                id: 'TWR-0587',
                riskScore: 76,
                failureType: 'Power Outage',
                predictedDowntime: '2.8 hours',
                lastFailure: '15 days ago',
            },
            {
                id: 'TWR-2311',
                riskScore: 74,
                failureType: 'Hardware Malfunction',
                predictedDowntime: '3.1 hours',
                lastFailure: '30 days ago',
            },
            {
                id: 'TWR-0892',
                riskScore: 68,
                failureType: 'Software Error',
                predictedDowntime: '1.5 hours',
                lastFailure: '45 days ago',
            },
        ],
        downtimeTrend: [
            { month: 'Jan', actual: 48, predicted: 52 },
            { month: 'Feb', actual: 43, predicted: 45 },
            { month: 'Mar', actual: 38, predicted: 40 },
            { month: 'Apr', actual: 35, predicted: 36 },
            { month: 'May', actual: 33, predicted: 32 },
            { month: 'Jun', actual: 30, predicted: 29 },
        ],
        failureDistribution: [
            { hour: '00:00', failures: 3 },
            { hour: '03:00', failures: 5 },
            { hour: '06:00', failures: 8 },
            { hour: '09:00', failures: 12 },
            { hour: '12:00', failures: 8 },
            { hour: '15:00', failures: 10 },
            { hour: '18:00', failures: 14 },
            { hour: '21:00', failures: 7 },
        ],
        modelPerformance: {
            accuracy: 87.5,
            precision: 82.3,
            recall: 79.8,
            f1Score: 81.0,
        },
        // Calendar prediction data
        calendarPredictions: {
            // Using current month + day numbers for the demo
            '2025-04-21': {
                count: 3,
                risk: 'high',
                towers: ['TWR-1042', 'TWR-0587', 'TWR-0331'],
                primaryType: 'Hardware Malfunction',
            },
            '2025-04-22': {
                count: 1,
                risk: 'medium',
                towers: ['TWR-2311'],
                primaryType: 'Power Outage',
            },
            '2025-04-24': {
                count: 2,
                risk: 'medium',
                towers: ['TWR-0892', 'TWR-1157'],
                primaryType: 'Software Error',
            },
            '2025-04-25': {
                count: 4,
                risk: 'critical',
                towers: ['TWR-1042', 'TWR-0587', 'TWR-2176', 'TWR-3311'],
                primaryType: 'Hardware Malfunction',
            },
            '2025-04-28': {
                count: 2,
                risk: 'high',
                towers: ['TWR-0587', 'TWR-1621'],
                primaryType: 'Weather Damage',
            },
            '2025-04-30': {
                count: 2,
                risk: 'medium',
                towers: ['TWR-0892', 'TWR-1157'],
                primaryType: 'Connectivity Issue',
            },
        },
        // Selected day detailed predictions
        dayPredictions: {
            '2025-04-25': [
                {
                    towerId: 'TWR-1042',
                    location: 'North Sector, Building 7',
                    riskScore: 89,
                    failureType: 'Hardware Malfunction',
                    predictedTime: '13:45',
                    estimatedDowntime: '4.5 hours',
                    impactedUsers: 1250,
                    maintenanceWindow: '08:00 - 12:00',
                    recommendation:
                        'Replace primary circuit board and test backup power systems',
                },
                {
                    towerId: 'TWR-0587',
                    location: 'East District, Cell 12',
                    riskScore: 76,
                    failureType: 'Hardware Malfunction',
                    predictedTime: '15:30',
                    estimatedDowntime: '2.8 hours',
                    impactedUsers: 872,
                    maintenanceWindow: '10:00 - 14:00',
                    recommendation:
                        'Check cooling system and replace thermal paste on processors',
                },
                {
                    towerId: 'TWR-2176',
                    location: 'Downtown, Sector 5',
                    riskScore: 81,
                    failureType: 'Hardware Malfunction',
                    predictedTime: '18:15',
                    estimatedDowntime: '3.2 hours',
                    impactedUsers: 1640,
                    maintenanceWindow: '06:00 - 10:00',
                    recommendation:
                        'Replace power supply unit and verify voltage regulators',
                },
                {
                    towerId: 'TWR-3311',
                    location: 'West Zone, Grid 9',
                    riskScore: 72,
                    failureType: 'Hardware Malfunction',
                    predictedTime: '22:40',
                    estimatedDowntime: '2.5 hours',
                    impactedUsers: 935,
                    maintenanceWindow: '20:00 - 00:00',
                    recommendation:
                        'Perform full diagnostic and check main board connections',
                },
            ],
        },
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

    const StatsCard = ({ icon: Icon, title, value, color }) => (
        <div className=" rounded-lg p-4 shadow flex items-center">
            <div className={`p-3 rounded-full mr-4 ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <div className="text-gray-500 text-sm font-medium">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    )

    const RiskIndicator = ({ score }) => {
        let color = 'bg-green-500'
        if (score > 60) color = 'bg-yellow-500'
        if (score > 75) color = 'bg-orange-500'
        if (score > 85) color = 'bg-red-500'

        return (
            <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
                <span>{score}%</span>
            </div>
        )
    }

    const RiskBadge = ({ risk }) => {
        const colorMap = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800',
        }

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[risk]}`}
            >
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </span>
        )
    }

    // Calendar functions
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const generateCalendarDays = () => {
        const today = new Date()
        return Array.from({ length: 3 }, (_, i) => {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            return {
                day: date.getDate(),
                date: format(date, 'yyyy-MM-dd'),
                isToday: i === 0,
            }
        })
    }

    const calendarDays = generateCalendarDays()

    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
            ),
        )
        setSelectedDay(null)
    }

    const goToNextMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
            ),
        )
        setSelectedDay(null)
    }

    const handleDayClick = (day: { date: string; day: number }) => {
        if (!day || !day.date) return
        setSelectedDay(day.date)
    }

    const selectedDayDetails = renderDayDetails()

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">
                Network Tower Failure Prediction Dashboard
            </h1>

            {!isLoading && (
                <div className="flex flex-col gap-4">
                    {/* Calendar and Day Details */}
                    <div className="flex flex-col xl:flex-row gap-4">
                        {/* Calendar */}
                        <div className="bg-white p-4 rounded-lg shadow flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">
                                    Next 3 Days Predictions
                                </h2>
                                <span className="font-medium">
                                    {format(new Date(), 'MMMM yyyy')}
                                </span>
                            </div>

                            {/* 3-Day Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {isLoading ? (
                                    // Loading skeleton for 3 days
                                    <>
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="aspect-square border rounded-md p-3 animate-pulse"
                                            >
                                                <div className="h-full flex flex-col">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="h-4 w-8 bg-gray-200 rounded"></div>
                                                        <div className="h-4 w-6 bg-gray-200 rounded"></div>
                                                    </div>
                                                    <div className="flex-1 flex flex-col items-center justify-center">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
                                                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    // Actual content
                                    calendarDays.map((dayObj) => (
                                        <div
                                            key={dayObj.date}
                                            className={`
                    aspect-square border rounded-md p-3 cursor-pointer
                    ${selectedDay === dayObj.date ? 'ring-2 ring-blue-500' : ''}
                    ${dayObj.isToday ? 'bg-blue-50' : 'hover:bg-gray-50'}
                `}
                                            onClick={() =>
                                                handleDayClick(dayObj)
                                            }
                                        >
                                            <div className="h-full flex flex-col">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span
                                                        className={`text-sm ${dayObj.isToday ? 'font-bold' : ''}`}
                                                    >
                                                        {format(
                                                            new Date(
                                                                dayObj.date,
                                                            ),
                                                            'EEE',
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`text-sm ${dayObj.isToday ? 'font-bold' : ''}`}
                                                    >
                                                        {dayObj.day}
                                                    </span>
                                                </div>
                                                {predictions[dayObj.date] && (
                                                    <div className="flex-1 flex flex-col items-center justify-center">
                                                        <div
                                                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center 
                                text-white text-sm font-bold mb-2
                                ${predictions[dayObj.date].risk === 'low' ? 'bg-green-500' : ''}
                                ${predictions[dayObj.date].risk === 'medium' ? 'bg-yellow-500' : ''}
                                ${predictions[dayObj.date].risk === 'high' ? 'bg-orange-500' : ''}
                                ${predictions[dayObj.date].risk === 'critical' ? 'bg-red-500' : ''}
                            `}
                                                        >
                                                            {
                                                                predictions[
                                                                    dayObj.date
                                                                ].count
                                                            }
                                                        </div>
                                                        <div className="text-xs text-center truncate w-full">
                                                            {
                                                                predictions[
                                                                    dayObj.date
                                                                ].primaryType
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {!predictions[dayObj.date] && (
                                                    <div className="flex-1 flex items-center justify-center text-gray-400">
                                                        <Check size={24} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Selected Day Details */}
                        <div className="p-4 rounded-lg shadow flex-1">
                            <h2 className="text-lg font-semibold mb-4">
                                {selectedDay
                                    ? `Predicted Failures - ${new Date(selectedDay).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                                    : 'Select a day with predicted failures'}
                            </h2>

                            {!selectedDay && (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                    <Calendar size={48} />
                                    <p className="mt-4">
                                        Select a day on the calendar to view
                                        detailed predictions
                                    </p>
                                </div>
                            )}

                            {selectedDay && predictions[selectedDay] && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <AlertOctagon
                                                className="text-red-500 mr-2"
                                                size={20}
                                            />
                                            <span className="font-medium">
                                                {
                                                    predictions[selectedDay]
                                                        .towers.length
                                                }{' '}
                                                Predicted Failures
                                            </span>
                                        </div>
                                        <RiskBadge
                                            risk={predictions[selectedDay].risk}
                                        />
                                    </div>

                                    <div className="overflow-auto max-h-96">
                                        {predictions[selectedDay].towers.map(
                                            (detail, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 p-4 rounded-lg mb-3"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="font-medium text-lg">
                                                            {detail.tower_id ||
                                                                detail.towerId}
                                                        </div>
                                                        <RiskIndicator
                                                            score={Math.round(
                                                                detail.failure_probability *
                                                                    100,
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                                        <div>
                                                            <span className="text-gray-500">
                                                                Location:
                                                            </span>{' '}
                                                            {detail.location}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">
                                                                Failure Type:
                                                            </span>{' '}
                                                            {detail.failure_type
                                                                ?.failure_type ||
                                                                detail.failureType}
                                                        </div>
                                                        {detail.predictedTime && (
                                                            <div className="flex items-center">
                                                                <AlarmClock
                                                                    size={14}
                                                                    className="mr-1"
                                                                />
                                                                <span className="text-gray-500 mr-1">
                                                                    Predicted
                                                                    Time:
                                                                </span>{' '}
                                                                {
                                                                    detail.predictedTime
                                                                }
                                                            </div>
                                                        )}
                                                        {detail.estimatedDowntime && (
                                                            <div>
                                                                <span className="text-gray-500">
                                                                    Est.
                                                                    Downtime:
                                                                </span>{' '}
                                                                {
                                                                    detail.estimatedDowntime
                                                                }
                                                            </div>
                                                        )}
                                                        {detail.impactedUsers && (
                                                            <div>
                                                                <span className="text-gray-500">
                                                                    Impacted
                                                                    Users:
                                                                </span>{' '}
                                                                {detail.impactedUsers.toLocaleString()}
                                                            </div>
                                                        )}
                                                        {detail.maintenanceWindow && (
                                                            <div>
                                                                <span className="text-gray-500">
                                                                    Maintenance
                                                                    Window:
                                                                </span>{' '}
                                                                {
                                                                    detail.maintenanceWindow
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    {detail.recommendation && (
                                                        <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-500 text-sm">
                                                            <div className="font-medium text-blue-800 mb-1">
                                                                Recommendation
                                                            </div>
                                                            {
                                                                detail.recommendation
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {/* Failure Type Prediction */}
                        <div className="bg- p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4">
                                Failure Type Distribution
                            </h2>
                            <div className="flex justify-center">
                                <PieChart width={250} height={250}>
                                    <Pie
                                        data={data.failureTypePrediction}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {data.failureTypePrediction.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ),
                                        )}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </div>
                        </div>

                        {/* Weekly Prediction vs Actual */}
                        <div className="whitebg- p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4">
                                Weekly Failure Prediction
                            </h2>
                            <LineChart
                                width={300}
                                height={250}
                                data={data.timelinePrediction}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="predictions"
                                    stroke="#8884d8"
                                    name="Predicted"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#82ca9d"
                                    name="Actual"
                                />
                            </LineChart>
                        </div>

                        {/* Model Performance */}
                        <div className=" p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4">
                                Model Performance
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">
                                        Accuracy
                                    </div>
                                    <div className="flex items-end">
                                        <span className="text-2xl font-bold">
                                            {data.modelPerformance.accuracy}%
                                        </span>
                                        <div className="ml-2 h-16 w-16">
                                            <div className="w-full h-full relative">
                                                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                                                <div
                                                    className="absolute inset-0 rounded-full bg-blue-500"
                                                    style={{
                                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((Math.PI * 2 * data.modelPerformance.accuracy) / 100)}% ${50 - 50 * Math.sin((Math.PI * 2 * data.modelPerformance.accuracy) / 100)}%, 50% 0%)`,
                                                    }}
                                                ></div>
                                                <div className="absolute inset-0 rounded-full flex items-center justify-center text-xs font-medium">
                                                    {
                                                        data.modelPerformance
                                                            .accuracy
                                                    }
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">
                                        Precision
                                    </div>
                                    <div className="flex items-end">
                                        <span className="text-2xl font-bold">
                                            {data.modelPerformance.precision}%
                                        </span>
                                        <div className="ml-2 h-16 w-16">
                                            <div className="w-full h-full relative">
                                                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                                                <div
                                                    className="absolute inset-0 rounded-full bg-green-500"
                                                    style={{
                                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((Math.PI * 2 * data.modelPerformance.precision) / 100)}% ${50 - 50 * Math.sin((Math.PI * 2 * data.modelPerformance.precision) / 100)}%, 50% 0%)`,
                                                    }}
                                                ></div>
                                                <div className="absolute inset-0 rounded-full flex items-center justify-center text-xs font-medium">
                                                    {
                                                        data.modelPerformance
                                                            .precision
                                                    }
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">
                                        Recall
                                    </div>
                                    <div className="flex items-end">
                                        <span className="text-2xl font-bold">
                                            {data.modelPerformance.recall}%
                                        </span>
                                        <div className="ml-2 h-16 w-16">
                                            <div className="w-full h-full relative">
                                                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                                                <div
                                                    className="absolute inset-0 rounded-full bg-purple-500"
                                                    style={{
                                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((Math.PI * 2 * data.modelPerformance.recall) / 100)}% ${50 - 50 * Math.sin((Math.PI * 2 * data.modelPerformance.recall) / 100)}%, 50% 0%)`,
                                                    }}
                                                ></div>
                                                <div className="absolute inset-0 rounded-full flex items-center justify-center text-xs font-medium">
                                                    {
                                                        data.modelPerformance
                                                            .recall
                                                    }
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">
                                        F1 Score
                                    </div>
                                    <div className="flex items-end">
                                        <span className="text-2xl font-bold">
                                            {data.modelPerformance.f1Score}%
                                        </span>
                                        <div className="ml-2 h-16 w-16">
                                            <div className="w-full h-full relative">
                                                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                                                <div
                                                    className="absolute inset-0 rounded-full bg-orange-500"
                                                    style={{
                                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((Math.PI * 2 * data.modelPerformance.f1Score) / 100)}% ${50 - 50 * Math.sin((Math.PI * 2 * data.modelPerformance.f1Score) / 100)}%, 50% 0%)`,
                                                    }}
                                                ></div>
                                                <div className="absolute inset-0 rounded-full flex items-center justify-center text-xs font-medium">
                                                    {
                                                        data.modelPerformance
                                                            .f1Score
                                                    }
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4">
                            Fetching next 3 days predictions...
                        </p>
                        <p className="text-sm text-gray-500">
                            Current tower : {currentTower}, Day: {currentDay}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectDashboard
