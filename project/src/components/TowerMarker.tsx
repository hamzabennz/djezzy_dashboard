import React, { useState } from 'react';
import { useTower } from '../context/TowerContext';
import { Tower } from '../types';
import { Radio, AlertTriangle, AlertCircle } from 'lucide-react';

interface TowerMarkerProps {
  tower: Tower;
  position: { x: number; y: number };
  onClick: () => void;
}

const TowerMarker: React.FC<TowerMarkerProps> = ({ tower, position, onClick }) => {
  const { selectedTower } = useTower();
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine color based on status
  const getStatusColor = () => {
    switch (tower.status) {
      case 'operational':
        return 'text-green-500';
      case 'at-risk':
        return 'text-amber-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };
  
  // Get appropriate icon based on status
  const getStatusIcon = () => {
    switch (tower.status) {
      case 'operational':
        return <Radio className="h-6 w-6" />;
      case 'at-risk':
        return <AlertTriangle className="h-6 w-6" />;
      case 'failed':
        return <AlertCircle className="h-6 w-6" />;
      default:
        return <Radio className="h-6 w-6" />;
    }
  };
  
  // Is this tower selected?
  const isSelected = selectedTower?.id === tower.id;
  
  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 
        ${isHovered || isSelected ? 'scale-125 z-10' : 'scale-100'}
        ${isSelected ? 'ring-2 ring-white ring-opacity-50 rounded-full' : ''}
      `}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${getStatusColor()}`}>
        {getStatusIcon()}
      </div>
      
      {/* Pulse animation for at-risk or failed towers */}
      {(tower.status === 'at-risk' || tower.status === 'failed') && (
        <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
          tower.status === 'at-risk' ? 'bg-amber-500' : 'bg-red-500'
        }`}></div>
      )}
      
      {/* Tower info tooltip */}
      {isHovered && (
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 -translate-y-2 bg-navy-800 text-white p-2 rounded-lg shadow-lg text-xs whitespace-nowrap z-20 pointer-events-none">
          <div className="font-bold">{tower.name}</div>
          <div className="text-gray-300">ID: {tower.id}</div>
          <div className={`font-medium ${getStatusColor()}`}>
            Status: {tower.status}
          </div>
          <div>Signal: {tower.signalStrength}%</div>
          <div className={`text-xs mt-1 ${tower.failureProbability > 50 ? 'text-red-400' : 'text-gray-400'}`}>
            Failure Probability: {tower.failureProbability}%
          </div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-t-navy-800 border-l-transparent border-r-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default TowerMarker;