import React from 'react';
import { useTower } from '../context/TowerContext';

const RiskTimeline: React.FC = () => {
  const { towers } = useTower();

  // Get towers with high risk for the timeline
  const highRiskTowers = towers
    .filter(tower => tower.failureProbability > 30)
    .sort((a, b) => a.failureProbability - b.failureProbability)
    .slice(0, 5);

  // Time intervals in hours
  const timeIntervals = [6, 12, 24, 48, 72];

  return (
    <div className="w-full">
      {/* Timeline header */}
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <div>Now</div>
        {timeIntervals.map((hours, i) => (
          <div key={i} className={i === timeIntervals.length - 1 ? 'text-right' : ''}>
            {hours}h
          </div>
        ))}
      </div>

      {/* Timeline for each high-risk tower */}
      <div className="space-y-3">
        {highRiskTowers.map(tower => {
          // Calculate at which point the tower is likely to fail
          // Higher probability = sooner failure
          const failurePoint = (1 - tower.failureProbability / 100) * 100;

          return (
            <div key={tower.id} className="relative">
              {/* Tower info */}
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium text-gray-800">{tower.name}</div>
                <div className={`text-xs ${tower.failureProbability > 70 ? 'text-error' : 'text-warning'}`}>
                  {tower.failureProbability}% risk
                </div>
              </div>

              {/* Timeline bar */}
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success via-warning to-error"
                  style={{ width: `${failurePoint}%` }}
                ></div>
              </div>

              {/* Time markers */}
              <div className="flex justify-between mt-1">
                {timeIntervals.map((_, i) => (
                  <div key={i} className="w-px h-1 bg-gray-300"></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskTimeline;