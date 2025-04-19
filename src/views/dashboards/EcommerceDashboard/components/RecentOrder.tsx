import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

const failureData = [
    { name: 'HARDWARE PROBLEM', value: 24.2 },
    { name: '2G cell down', value: 16.3 },
    { name: 'Power problem', value: 15.65 },
    { name: 'LOSS-OF-ALL CHANNEL', value: 15.5 },
    { name: '4G cell down', value: 14.0 },
    { name: '3G cell down', value: 7.35 },
    { name: 'Temperature_alarm', value: 7.0 },
]

const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#00C49F',
    '#FFBB28',
    '#FF6666',
]

const RecentOrder = () => {
    const navigate = useNavigate()

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Failure Type Distribution</h4>
                <Button
                    size="sm"
                    onClick={() => navigate('/concepts/orders/order-list')}
                >
                    View Details
                </Button>
            </div>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={failureData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                        >
                            {failureData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

export default RecentOrder
