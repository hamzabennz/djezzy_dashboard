import React, { useState } from 'react';
import { useTower } from '../context/TowerContext';
import { Filter, Clock, Download, Bell, BarChart } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const { setFilterStatus, toggleTowerVisibility } = useTower();
  const [timeRange, setTimeRange] = useState('24h');
  
  return (
    <div className="bg-navy-900 border-t border-navy-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Control Panel</h2>
      </div>
      
      <div className="space-y-4">
        {/* Status Filters */}
        <div>
          <h3 className="text-sm font-medium flex items-center mb-2">
            <Filter className="h-4 w-4 text-teal-500 mr-1" />
            Filter Towers
          </h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton 
              label="All" 
              onClick={() => setFilterStatus(null)} 
              isActive={true}
            />
            <FilterButton 
              label="Operational" 
              onClick={() => setFilterStatus('operational')} 
              color="bg-green-500"
            />
            <FilterButton 
              label="At Risk" 
              onClick={() => setFilterStatus('at-risk')} 
              color="bg-amber-500"
            />
            <FilterButton 
              label="Failed" 
              onClick={() => setFilterStatus('failed')} 
              color="bg-red-500"
            />
          </div>
        </div>
        
        {/* Time Range */}
        <div>
          <h3 className="text-sm font-medium flex items-center mb-2">
            <Clock className="h-4 w-4 text-teal-500 mr-1" />
            Time Range
          </h3>
          <div className="flex">
            <TimeRangeButton 
              label="24h" 
              isActive={timeRange === '24h'} 
              onClick={() => setTimeRange('24h')}
            />
            <TimeRangeButton 
              label="7d" 
              isActive={timeRange === '7d'} 
              onClick={() => setTimeRange('7d')}
            />
            <TimeRangeButton 
              label="30d" 
              isActive={timeRange === '30d'} 
              onClick={() => setTimeRange('30d')}
            />
            <TimeRangeButton 
              label="90d" 
              isActive={timeRange === '90d'} 
              onClick={() => setTimeRange('90d')}
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <ActionButton 
            icon={<Download className="h-4 w-4" />}
            label="Export Data"
          />
          <ActionButton 
            icon={<Bell className="h-4 w-4" />}
            label="Alert Settings"
          />
          <ActionButton 
            icon={<BarChart className="h-4 w-4" />}
            label="Visualization"
          />
        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{
  label: string;
  onClick: () => void;
  isActive?: boolean;
  color?: string;
}> = ({ label, onClick, isActive = false, color = 'bg-teal-500' }) => {
  return (
    <button 
      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center ${
        isActive 
          ? 'bg-teal-600 text-white' 
          : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
      }`}
      onClick={onClick}
    >
      {color && <div className={`h-2 w-2 rounded-full ${color} mr-1.5`}></div>}
      {label}
    </button>
  );
};

const TimeRangeButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button 
      className={`px-3 py-1.5 text-xs font-medium border-t border-b border-r first:border-l first:rounded-l-lg last:rounded-r-lg ${
        isActive 
          ? 'bg-navy-700 text-white border-navy-600' 
          : 'bg-navy-800 text-gray-400 border-navy-700 hover:bg-navy-700'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
}> = ({ icon, label }) => {
  return (
    <button className="flex-1 bg-navy-800 hover:bg-navy-700 rounded-lg py-2 text-xs flex items-center justify-center">
      {icon}
      <span className="ml-1.5">{label}</span>
    </button>
  );
};

export default ControlPanel;