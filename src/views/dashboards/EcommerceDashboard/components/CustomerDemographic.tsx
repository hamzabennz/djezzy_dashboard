import { useState } from 'react'
import Card from '@/components/ui/Card'
import Algeria from '@react-map/algeria'

const redCluster = [
    'Alger', 'Blida', 'Boumerdès', 'Tizi Ouzou', 'Bouira'
]

const orangeCluster = [
    'Oran', 'Mascara', 'Relizane', 'Mostaganem', 'Chlef'
]

const highlightColors: Record<string, string> = {
    red: '#F87171',     // Soft Red
    orange: '#FDBA74'   // Soft Orange
}

// Build cityColors map
const cityColors: Record<string, string> = {}

redCluster.forEach(w => {
    cityColors[w] = highlightColors.red
})

orangeCluster.forEach(w => {
    cityColors[w] = highlightColors.orange
})

const CustomerDemographic = () => {
    const [selected, setSelected] = useState<string | null>(null)

    return (
        <Card>
            <h4 className="mb-4 text-lg font-semibold">Highlighted Wilaya Clusters</h4>
            <div className="flex flex-col xl:flex-row items-start gap-6">
                <div className="flex-1">
                    <Algeria
                        type="select-single"
                        size={500}
                        hoverColor="orange"
                        cityColors={cityColors}
                        strokeWidth={0} // No borders
                        strokeColor="transparent"
                        onSelect={(city) => setSelected(city)}
                    />
                    {selected && (
                        <p className="mt-3 text-sm text-center text-gray-600">
                            Selected Wilaya: <strong>{selected}</strong>
                        </p>
                    )}
                </div>

                {/* Legend */}
                <div className="min-w-[200px]">
                    <h5 className="text-base font-medium mb-3">Highlighted Clusters</h5>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: highlightColors.red }} />
                            <span>Central Cluster</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: highlightColors.orange }} />
                            <span>Western Cluster</span>
                        </li>
                    </ul>
                </div>
            </div>
        </Card>
    )
}

export default CustomerDemographic
