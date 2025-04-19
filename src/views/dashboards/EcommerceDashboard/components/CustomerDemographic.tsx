import { useState } from 'react'
import Card from '@/components/ui/Card'
import Algeria from '@react-map/algeria'

const wilayaFailureData: Record<string, number> = {
    'Adrar': 2,
    'Chlef': 6,
    'Laghouat': 4,
    'Oum El Bouaghi': 7,
    'Batna': 9,
    'Béjaïa': 1,
    'Biskra': 8,
    'Béchar': 3,
    'Blida': 5,
    'Bouira': 10,
    'Tamanrasset': 2,
    'Tébessa': 6,
    'Tlemcen': 1,
    'Tiaret': 4,
    'Tizi Ouzou': 7,
    'Alger': 10,
    'Djelfa': 3,
    'Jijel': 1,
    'Sétif': 8,
    'Saïda': 2,
    'Skikda': 6,
    'Sidi Bel Abbès': 3,
    'Annaba': 5,
    'Guelma': 4,
    'Constantine': 7,
    'Médéa': 3,
    'Mostaganem': 2,
    'M’Sila': 9,
    'Mascara': 3,
    'Ouargla': 5,
    'Oran': 7,
    'El Bayadh': 1,
    'Illizi': 0,
    'Bordj Bou Arreridj': 6,
    'Boumerdès': 4,
    'El Tarf': 2,
    'Tindouf': 1,
    'Tissemsilt': 5,
    'El Oued': 2,
    'Khenchela': 3,
    'Souk Ahras': 6,
    'Tipaza': 4,
    'Mila': 7,
    'Aïn Defla': 2,
    'Naâma': 1,
    'Aïn Témouchent': 3,
    'Ghardaïa': 5,
    'Relizane': 4,
}

// Assign color based on failure ranges
const getColorFromFailures = (failures: number): string => {
    if (failures >= 8) return '#FCA5A5' // light red
    if (failures >= 4) return '#FDE68A' // light yellow
    return '#BBF7D0' // light green
}

// Generate the cityColors prop
const cityColors: Record<string, string> = Object.fromEntries(
    Object.entries(wilayaFailureData).map(([wilaya, failures]) => [
        wilaya,
        getColorFromFailures(failures),
    ])
)

const CustomerDemographic = () => {
    const [selected, setSelected] = useState<string | null>(null)

    return (
        <Card>
            <h4 className="mb-4 text-lg font-semibold">Wilaya Network Failures</h4>
            <div className="flex flex-col xl:flex-row items-start gap-6">
                <div className="flex-1">
                    <Algeria
                        type="select-single"
                        size={500}
                        hoverColor="orange"
                        cityColors={cityColors}
                        onSelect={(city) => setSelected(city)}
                    />
                    {selected && (
                        <p className="mt-3 text-sm text-center text-gray-600">
                            Selected Wilaya: <strong>{selected}</strong> —{' '}
                            <span>
                                {wilayaFailureData[selected] ?? 'N/A'} failures
                            </span>
                        </p>
                    )}
                </div>

                {/* Legend */}
                <div className="min-w-[200px]">
                    <h5 className="text-base font-medium mb-3">Legend</h5>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded-full bg-green-500" />
                            <span>0–3 Failures</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded-full bg-yellow-500" />
                            <span>4–15 Failures</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded-full bg-red-500" />
                            <span>15+ Failures</span>
                        </li>
                    </ul>
                </div>
            </div>
        </Card>
    )
}

export default CustomerDemographic
