import React from 'react';
import { useTower } from '../context/TowerContext';
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
  ChevronUp
} from 'lucide-react';
import PerformanceChart from './PerformanceChart';

const TowerStatisticsPanel: React.FC = () => {
  const { selectedTower, deselectTower } = useTower();
  const [expanded, setExpanded] = React.useState(true);
  
  if (!selectedTower) return null;
  
  // Determine status color
  const getStatusColor = () => {
    switch (selectedTower.status) {
      case 'operational':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-amber-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="bg-navy-900 border-b border-navy-800">
      {/* Header with toggle */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${getStatusColor()}`}></div>
          <h2 className="text-lg font-bold">{selectedTower.name}</h2>
        </div>
        <div className="flex gap-2">
          <button 
            className="bg-navy-800 hover:bg-navy-700 rounded-lg p-1.5 text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              deselectTower();
            }}
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            className="bg-navy-800 hover:bg-navy-700 rounded-lg p-1.5"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? 
              <ChevronUp className="h-5 w-5" /> : 
              <ChevronDown className="h-5 w-5" />
            }
          </button>
        </div>
      </div>
      
      {/* Expandable content */}
      {expanded && (
        <div className="px-4 pb-4 animate-fadeIn space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem 
              icon={<MapPin className="h-4 w-4 text-teal-500" />}
              label="Location"
              value={selectedTower.location}
            />
            <InfoItem 
              icon={<Signal className="h-4 w-4 text-blue-500" />}
              label="Signal Strength"
              value={`${selectedTower.signalStrength}%`}
            />
            <InfoItem 
              icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
              label="Failure Probability"
              value={`${selectedTower.failureProbability}%`}
            />
            <InfoItem 
              icon={<Calendar className="h-4 w-4 text-gray-400" />}
              label="Last Maintenance"
              value={formatDate(selectedTower.lastMaintenance)}
            />
          </div>
          
          {/* Performance chart */}
          <div className="mt-4">
            <h3 className="text-sm font-medium flex items-center mb-2">
              <BarChart className="h-4 w-4 text-teal-500 mr-1" />
              Performance Metrics
            </h3>
            <div className="rounded-lg overflow-hidden bg-navy-800 p-4 h-40">
              <PerformanceChart data={selectedTower.performanceHistory} />
            </div>
          </div>
          
          {/* Historical failures */}
          {selectedTower.failureHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium flex items-center mb-2">
                <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                Historical Failures
              </h3>
              <div className="rounded-lg overflow-hidden bg-navy-800 p-2">
                {selectedTower.failureHistory.map((failure, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-navy-700 last:border-0">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-gray-400 mr-2" />
                      <span className="text-xs">{formatDate(failure.date)}</span>
                    </div>
                    <div className="text-xs text-gray-300">{failure.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Maintenance schedule */}
          <div className="mt-4">
            <h3 className="text-sm font-medium flex items-center mb-2">
              <Wrench className="h-4 w-4 text-blue-500 mr-1" />
              Upcoming Maintenance
            </h3>
            <div className="rounded-lg overflow-hidden bg-navy-800 p-4 text-center">
              <div className="text-sm">
                {selectedTower.nextMaintenance ? 
                  `Scheduled for ${formatDate(selectedTower.nextMaintenance)}` : 
                  'No upcoming maintenance scheduled'
                }
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-3 py-2 text-sm flex-1 flex items-center justify-center">
              <Wrench className="h-4 w-4 mr-1" />
              Schedule Maintenance
            </button>
            <button className={`${
              selectedTower.status === 'failed' ? 'bg-red-600 hover:bg-red-700' : 'bg-navy-700 hover:bg-navy-600'
            } text-white rounded-lg px-3 py-2 text-sm flex-1 flex items-center justify-center`}>
              <AlertCircle className="h-4 w-4 mr-1" />
              {selectedTower.status === 'failed' ? 'Report Issue' : 'Run Diagnostics'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  return (
    <div className="bg-navy-800 rounded-lg p-2">
      <div className="text-xs text-gray-400 flex items-center">
        {icon}
        <span className="ml-1">{label}</span>
      </div>
      <div className="text-sm font-medium mt-1">{value}</div>
    </div>
  );
};

export default TowerStatisticsPanel;