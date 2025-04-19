import React from 'react';
import { Cloud, BarChart3, Activity, Zap } from 'lucide-react';
import { useTower } from '../context/TowerContext';
import RiskTimeline from './RiskTimeline';

interface MonitoringSectionProps {
  className?: string;
}

const MonitoringSection: React.FC<MonitoringSectionProps> = ({ className = '' }) => {
  const { towers } = useTower();
  
  // Calculate some metrics
  const systemHealth = 82; // Percentage
  const networkLoad = 68; // Percentage
  const highRiskTowers = towers.filter(t => t.failureProbability > 50).length;
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-bold mb-3">Real-time Monitoring</h2>
      
      {/* Risk timeline */}
      <div className="bg-navy-800 rounded-lg p-3 mb-4">
        <h3 className="text-sm font-medium flex items-center mb-2">
          <Activity className="h-4 w-4 text-teal-500 mr-1" />
          Failure Prediction Timeline
        </h3>
        <RiskTimeline />
      </div>
      
      {/* Weather conditions */}
      <div className="bg-navy-800 rounded-lg p-3 mb-4">
        <h3 className="text-sm font-medium flex items-center mb-2">
          <Cloud className="h-4 w-4 text-blue-400 mr-1" />
          Weather Conditions
        </h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <img 
              src="https://images.pexels.com/photos/3032117/pexels-photo-3032117.jpeg?auto=compress&cs=tinysrgb&w=1600" 
              alt="Weather" 
              className="h-10 w-10 rounded mr-2 object-cover"
            />
            <div>
              <div className="font-medium">Heavy Rain</div>
              <div className="text-xs text-gray-400">Affecting {highRiskTowers} towers</div>
            </div>
          </div>
          <div>
            <div className="text-amber-500 font-medium">High Risk</div>
            <div className="text-xs text-gray-400">Wind: 25 mph</div>
          </div>
        </div>
      </div>
      
      {/* System metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricCard 
          icon={<BarChart3 className="h-4 w-4 text-teal-500" />}
          label="System Health"
          value={`${systemHealth}%`}
          color={getHealthColor(systemHealth)}
        />
        <MetricCard 
          icon={<Zap className="h-4 w-4 text-amber-500" />}
          label="Network Load"
          value={`${networkLoad}%`}
          color={getLoadColor(networkLoad)}
        />
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => {
  return (
    <div className="bg-navy-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-400 flex items-center">
          {icon}
          <span className="ml-1">{label}</span>
        </div>
        <div className={`text-sm font-medium ${color}`}>{value}</div>
      </div>
      <div className="w-full bg-navy-700 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${color.replace('text', 'bg')}`}
          style={{ width: value }}
        ></div>
      </div>
    </div>
  );
};

// Helper functions for color coding
const getHealthColor = (health: number) => {
  if (health > 80) return 'text-green-500';
  if (health > 50) return 'text-amber-500';
  return 'text-red-500';
};

const getLoadColor = (load: number) => {
  if (load < 30) return 'text-green-500';
  if (load < 70) return 'text-amber-500';
  return 'text-red-500';
};

export default MonitoringSection;