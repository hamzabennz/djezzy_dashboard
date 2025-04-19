import { useState } from 'react'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import classNames from '@/utils/classNames'
import {
    TbDeviceDesktopAnalytics,
    TbBolt,
    TbBug,
    TbCloudStorm,
    TbUsers,
} from 'react-icons/tb'

// Simplified options
const periodOptions = [
    { value: 'thisWeek', label: 'This Week' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'thisMonth', label: 'This Month' },
]

// Hard-coded failure data
const failureTypes = [
    {
        id: 1,
        type: 'Hardware Malfunction',
        icon: <TbDeviceDesktopAnalytics className="text-lg" />,
        color: 'bg-orange-100 text-orange-600',
        percentage: 32,
        count: {
            thisWeek: 5,
            lastWeek: 7,
            thisMonth: 12
        },
        avgDowntime: '4.2h'
    },
    {
        id: 2,
        type: 'Power Outage',
        icon: <TbBolt className="text-lg" />,
        color: 'bg-red-100 text-red-600',
        percentage: 28,
        count: {
            thisWeek: 3,
            lastWeek: 8,
            thisMonth: 11
        },
        avgDowntime: '6.5h'
    },
    {
        id: 3,
        type: 'Software Issue',
        icon: <TbBug className="text-lg" />,
        color: 'bg-blue-100 text-blue-600',
        percentage: 20,
        count: {
            thisWeek: 4,
            lastWeek: 5,
            thisMonth: 8
        },
        avgDowntime: '2.1h'
    },
    {
        id: 4,
        type: 'Environmental',
        icon: <TbCloudStorm className="text-lg" />,
        color: 'bg-green-100 text-green-600',
        percentage: 15,
        count: {
            thisWeek: 1,
            lastWeek: 2,
            thisMonth: 6
        },
        avgDowntime: '5.8h'
    },
    {
        id: 5,
        type: 'Human Error',
        icon: <TbUsers className="text-lg" />,
        color: 'bg-purple-100 text-purple-600',
        percentage: 5,
        count: {
            thisWeek: 1,
            lastWeek: 1,
            thisMonth: 2
        },
        avgDowntime: '1.5h'
    }
]

const RevenueByChannel = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('thisWeek')
    
    const getTotalFailures = (period) => {
        return failureTypes.reduce((total, type) => total + type.count[period], 0)
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="font-semibold text-lg">Failure Analysis</h4>
                    <p className="text-gray-500 text-sm">Distribution by failure type</p>
                </div>
                <Select
                    className="w-[140px]"
                    size="sm"
                    placeholder="Select period"
                    value={periodOptions.filter(option => option.value === selectedPeriod)}
                    options={periodOptions}
                    isSearchable={false}
                    onChange={(option) => {
                        if (option?.value) {
                            setSelectedPeriod(option.value)
                        }
                    }}
                />
            </div>
            
            <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">
                    Total Failures: <span className="text-xl">{getTotalFailures(selectedPeriod)}</span>
                </div>
                <div className="text-sm text-gray-500">
                    {selectedPeriod === 'thisWeek' ? 'Last 7 days' : 
                     selectedPeriod === 'lastWeek' ? '7-14 days ago' : 'Last 30 days'}
                </div>
            </div>
            
            <div className="space-y-4">
                {failureTypes.map(type => (
                    <div key={type.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`${type.color} p-2 rounded-lg`}>
                                    {type.icon}
                                </div>
                                <div>
                                    <div className="font-medium">{type.type}</div>
                                    <div className="text-xs text-gray-500">Avg. Downtime: {type.avgDowntime}</div>
                                </div>
                            </div>
                            <Badge className={type.color.replace('bg-', 'bg-opacity-20 ')}>
                                {type.count[selectedPeriod]} incidents
                            </Badge>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                                className={`h-2.5 rounded-full ${type.color.split(' ')[0]}`} 
                                style={{ width: `${type.percentage}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-right mt-1">{type.percentage}% of total</div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default RevenueByChannel