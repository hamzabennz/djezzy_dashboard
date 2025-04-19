import Card from '@/components/ui/Card'
import Algeria from '@react-map/algeria'

// Define 6 region clusters
const regionClusters: Record<string, string[]> = {
    North_Center: ['Alger', 'Blida', 'Boumerdès', 'Tizi Ouzou', 'Bouira'],
    North_West: ['Oran', 'Mascara', 'Relizane', 'Mostaganem', 'Chlef', 'Aïn Témouchent'],
    North_East: ['Constantine', 'Annaba', 'Skikda', 'Guelma', 'Souk Ahras'],
    High_Plateau: ['Sétif', 'M’Sila', 'Batna', 'Bordj Bou Arreridj', 'Tébessa'],
    
}

// Assign color to each region (alternating red and orange)
const regionColors = ['#F87171', '#FDBA74'] // red, orange

// Build color map for wilayas
const cityColors: Record<string, string> = {}
Object.entries(regionClusters).forEach(([_, wilayas], index) => {
    const color = regionColors[index % regionColors.length]
    wilayas.forEach(wilaya => {
        cityColors[wilaya] = color
    })
})

const CustomerDemographic = () => {
    return (
        <Card>
            <h4 className="mb-4 text-lg font-semibold">Algeria Regions (Static View)</h4>
            <div className="flex flex-col xl:flex-row items-start gap-6">
                <div className="flex-1">
                    <Algeria
                        type="select-single"
                        size={500}
                        cityColors={cityColors}
                        strokeWidth={0}
                        strokeColor="transparent"
                        disableClick
                        disableHover
                    />
                </div>

                {/* Legend */}
                <div className="min-w-[200px]">
                    <h5 className="text-base font-medium mb-3">Regions</h5>
                    <ul className="space-y-2">
                        {Object.keys(regionClusters).map((region, index) => (
                            <li key={region} className="flex items-center gap-3">
                                <span
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: regionColors[index % regionColors.length] }}
                                />
                                <span>{region.replace('_', ' ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    )
}

export default CustomerDemographic
