import React, { useState, useEffect } from 'react';
import { Clock, Signal, AlertTriangle, Wifi } from 'lucide-react';
import { useTower } from '../context/TowerContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const { towers } = useTower();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const activeTowers = towers.filter(t => t.status === 'operational').length;
  const atRiskTowers = towers.filter(t => t.status !== 'operational').length;
  
  return (
    <header className="bg-navy-900/50 backdrop-blur-sm px-6 py-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3 mr-auto">
        <Logo className="h-8 w-8 text-teal-500" />
        <div>
          <h1 className="text-xl font-bold">NetTowerGuard</h1>
          <p className="text-xs text-gray-400">Network Monitoring</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-sm">
          <div className="text-gray-400">{currentTime.toLocaleDateString()}</div>
          <div className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-500" />
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="flex gap-4">
          <Stat icon={<Wifi />} label="Total" value={towers.length} />
          <Stat icon={<Signal />} label="Active" value={activeTowers} color="text-green-500" />
          <Stat icon={<AlertTriangle />} label="At Risk" value={atRiskTowers} color="text-amber-500" />
        </div>
      </div>
    </header>
  );
};

const Stat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}> = ({ icon, label, value, color = "text-teal-500" }) => (
  <div className="bg-navy-900 rounded-lg px-4 py-2">
    <div className={`${color} mb-1`}>{icon}</div>
    <div className="text-xs text-gray-400">{label}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>
);

export default Header;