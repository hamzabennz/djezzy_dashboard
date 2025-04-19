import React from 'react';
import { PerformanceData } from '../types';

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  // Find max value for scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="h-full w-full flex items-end relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
        <div>100%</div>
        <div>50%</div>
        <div>0%</div>
      </div>
      
      {/* Grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full">
        <div className="border-t border-navy-700 h-1/2"></div>
      </div>
      
      {/* Chart bars */}
      <div className="ml-8 flex-1 h-full flex items-end justify-between gap-[2px]">
        {data.map((item, index) => {
          const height = `${(item.value / maxValue) * 100}%`;
          
          // Determine bar color based on value
          let barColor = 'bg-green-500';
          if (item.value < 50) {
            barColor = 'bg-red-500';
          } else if (item.value < 75) {
            barColor = 'bg-amber-500';
          }
          
          return (
            <div 
              key={index} 
              className="group relative flex-1"
              style={{ minWidth: '4px' }}
            >
              <div 
                className={`w-full ${barColor} rounded-t-sm`} 
                style={{ height }}
              ></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-navy-700 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div>{item.label}: {item.value}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceChart;