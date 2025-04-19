import { Tower, PerformanceData, FailureRecord } from './types'

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 10)

// Generate random date within the past year
const randomDate = (startDays = 365, endDays = 0) => {
    const start = new Date()
    start.setDate(start.getDate() - startDays)
    const end = new Date()
    end.setDate(end.getDate() - endDays)

    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    ).toISOString()
}

// Generate random future date
const randomFutureDate = (startDays = 0, endDays = 90) => {
    const start = new Date()
    start.setDate(start.getDate() + startDays)
    const end = new Date()
    end.setDate(end.getDate() + endDays)

    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    ).toISOString()
}

// Generate random number between min and max
const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generate random performance data
const generatePerformanceData = (count: number): PerformanceData[] => {
    const data: PerformanceData[] = []
    const today = new Date()

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const month = date.toLocaleString('default', { month: 'short' })
        const day = date.getDate()

        data.push({
            label: `${month} ${day}`,
            value: randomNumber(30, 100),
        })
    }

    return data
}

// Generate random failure records
const generateFailureRecords = (count: number): FailureRecord[] => {
    const reasons = [
        'Power failure',
        'Weather damage',
        'Hardware malfunction',
        'Software issue',
        'Signal interference',
        'Antenna misalignment',
        'Maintenance error',
        'Vandalism',
    ]

    const records: FailureRecord[] = []

    for (let i = 0; i < count; i++) {
        records.push({
            date: randomDate(300, 5),
            reason: reasons[randomNumber(0, reasons.length - 1)],
            duration: randomNumber(1, 48),
        })
    }

    // Sort by date
    return records.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
}

// Generate mock tower data
export const generateMockTowers = (count: number): Tower[] => {
    const towers: Tower[] = []
    const locations = [
        'North Region',
        'South Region',
        'East Region',
        'West Region',
        'Central District',
        'Coastal Area',
        'Mountain Range',
        'Urban Zone',
        'Rural Area',
        'Highway Junction',
    ]

    for (let i = 0; i < count; i++) {
        const signalStrength = randomNumber(50, 100)
        const failureProbability = randomNumber(0, 100)

        // Determine status based on signal strength and failure probability
        let status: 'operational' | 'at-risk' | 'failed' = 'operational'
        if (failureProbability > 75 || signalStrength < 60) {
            status = 'failed'
        } else if (failureProbability > 30 || signalStrength < 80) {
            status = 'at-risk'
        }

        // Generate random position on the map
        const position = {
            x: randomNumber(200, 1800),
            y: randomNumber(200, 1300),
        }

        // Determine if there should be a next maintenance date
        const hasNextMaintenance = Math.random() > 0.3

        towers.push({
            id: generateId(),
            name: `Tower #${randomNumber(1000, 9999)}`,
            location: locations[randomNumber(0, locations.length - 1)],
            status,
            position,
            signalStrength,
            failureProbability,
            lastMaintenance: randomDate(180, 0),
            nextMaintenance: hasNextMaintenance
                ? randomFutureDate(1, 60)
                : null,
            performanceHistory: generatePerformanceData(10),
            failureHistory: generateFailureRecords(randomNumber(0, 5)),
            visible: true,
        })
    }

    return towers
}
