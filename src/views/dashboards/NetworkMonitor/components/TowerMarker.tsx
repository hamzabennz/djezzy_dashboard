import React, { useState } from 'react'
import { useTower } from '../context/TowerContext'
import { Tower } from '../types'
import { Radio } from 'lucide-react'

interface TowerMarkerProps {
    tower: Tower
    position: { x: number; y: number }
    onClick: () => void
}

const TowerMarker: React.FC<TowerMarkerProps> = ({
    tower,
    position,
    onClick,
}) => {
    const { selectedTower } = useTower()
    const [isHovered, setIsHovered] = useState(false)

    // Determine color based on status
    const getStatusColor = () => {
        switch (tower.status) {
            case 'operational':
                return 'text-success'
            case 'at-risk':
                return 'text-warning'
            case 'failed':
                return 'text-error'
            default:
                return 'text-info'
        }
    }

    // Is this tower selected?
    const isSelected = selectedTower?.id === tower.id

    return (
        <div
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 
        ${isHovered || isSelected ? 'scale-125 z-10' : 'scale-100'}
        ${isSelected ? 'ring-2 ring-primary ring-opacity-50 rounded-full' : ''}
      `}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Radio Icon */}
            <div className={`${getStatusColor()}`}>
                <Radio size={24} />
            </div>

            {/* Pulse animation for at-risk or failed towers */}
            {(tower.status === 'at-risk' || tower.status === 'failed') && (
                <div
                    className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                        tower.status === 'at-risk'
                            ? 'bg-warning/50'
                            : 'bg-error/50'
                    }`}
                ></div>
            )}

            {/* Tower info tooltip */}
            {isHovered && (
                <div className="absolute left-1/2 bottom-full -translate-x-1/2 -translate-y-2 bg-gray-800 text-white p-2 rounded-lg shadow-lg text-xs whitespace-nowrap z-20 pointer-events-none">
                    <div className="font-bold">{tower.name}</div>
                    <div className="text-gray-300">ID: {tower.id}</div>
                    <div className={`font-medium ${getStatusColor()}`}>
                        Status: {tower.status}
                    </div>
                    <div>Signal: {tower.signalStrength}%</div>
                    <div
                        className={`text-xs mt-1 ${
                            tower.failureProbability > 50
                                ? 'text-error'
                                : 'text-gray-400'
                        }`}
                    >
                        Failure Probability: {tower.failureProbability}%
                    </div>
                    <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-t-gray-800 border-l-transparent border-r-transparent"></div>
                </div>
            )}
        </div>
    )
}

export default TowerMarker
