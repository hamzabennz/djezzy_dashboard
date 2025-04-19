import React from 'react';
import { Radio, AlertTriangle, AlertCircle } from 'lucide-react';

interface MapLegendProps {
  className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg text-sm border border-gray-200 shadow-sm ${className}`}>
      <h3 className="font-bold text-gray-800 mb-2">Tower Status</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Radio className="h-4 w-4 text-success mr-2" />
          <span className="text-gray-600">Operational</span>
        </div>
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-warning mr-2" />
          <span className="text-gray-600">At Risk</span>
        </div>
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-error mr-2" />
          <span className="text-gray-600">Failed</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;