import React from 'react';
import { Radio, AlertTriangle, AlertCircle } from 'lucide-react';

interface MapLegendProps {
  className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  return (
    <div className={`bg-navy-800/80 backdrop-blur-sm px-4 py-3 rounded-lg text-sm ${className}`}>
      <h3 className="font-bold text-white mb-2">Tower Status</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Radio className="h-4 w-4 text-green-500 mr-2" />
          <span>Operational</span>
        </div>
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
          <span>At Risk</span>
        </div>
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <span>Failed</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;