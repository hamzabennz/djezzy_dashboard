import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { useTower } from '../context/TowerContext';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

const Terminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { towers } = useTower();

  useEffect(() => {
    // Monitor towers and generate logs
    const failedTowers = towers.filter(t => t.status === 'failed');
    const atRiskTowers = towers.filter(t => t.status === 'at-risk');

    const newLogs: LogEntry[] = [];

    failedTowers.forEach(tower => {
      const recoverySteps = getRecoverySteps(tower.failureHistory[0]?.reason || 'Unknown');
      newLogs.push({
        timestamp: new Date().toLocaleTimeString(),
        type: 'error',
        message: `${tower.name} has failed: ${tower.failureHistory[0]?.reason || 'Unknown reason'}`
      });
      newLogs.push({
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        message: `Recovery steps for ${tower.name}:\n${recoverySteps}`
      });
    });

    atRiskTowers.forEach(tower => {
      newLogs.push({
        timestamp: new Date().toLocaleTimeString(),
        type: 'warning',
        message: `${tower.name} is at risk. Preventive maintenance recommended.`
      });
    });

    setLogs(prev => [...newLogs, ...prev].slice(0, 100));
  }, [towers]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getRecoverySteps = (failureReason: string): string => {
    const recoverySteps = {
      'Power failure': `1. Check power supply unit
2. Verify backup battery status
3. Inspect circuit breakers
4. Test voltage levels
5. Replace faulty components if needed`,

      'Weather damage': `1. Assess physical damage
2. Check antenna alignment
3. Test signal strength
4. Replace damaged components
5. Reinforce weather protection`,

      'Hardware malfunction': `1. Run diagnostic tests
2. Identify faulty components
3. Replace or repair hardware
4. Verify system stability
5. Update maintenance schedule`,

      'Software issue': `1. Check system logs
2. Restart network services
3. Update firmware if needed
4. Verify configuration
5. Test network connectivity`,

      'Signal interference': `1. Scan for interference sources
2. Adjust antenna direction
3. Change frequency if possible
4. Install signal filters
5. Monitor signal quality`,

      'Antenna misalignment': `1. Check physical alignment
2. Measure signal strength
3. Adjust antenna position
4. Verify connection quality
5. Lock mounting hardware`,

      'Maintenance error': `1. Review maintenance logs
2. Verify recent changes
3. Rollback if necessary
4. Update procedures
5. Retrain maintenance team`,

      'Vandalism': `1. Document damage
2. File incident report
3. Repair physical damage
4. Enhance security measures
5. Install surveillance`
    };

    return recoverySteps[failureReason as keyof typeof recoverySteps] ||
      `1. Run system diagnostics\n2. Check physical components\n3. Verify network connectivity\n4. Test signal strength\n5. Contact maintenance team`;
  };

  return (
    <>
      {/* Terminal toggle button */}
      <button
        className="fixed bottom-6 left-6 bg-primary hover:bg-primary-deep text-white rounded-lg p-3 shadow-lg transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TerminalIcon className="h-5 w-5" />
      </button>

      {/* Terminal window */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 w-[600px] h-[400px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">System Logs</span>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            className="flex-1 overflow-auto p-4 font-mono text-sm"
          >
            {logs.map((log, i) => (
              <div key={i} className="mb-2">
                <span className="text-gray-500">[{log.timestamp}] </span>
                <span className={`
                  ${log.type === 'error' ? 'text-error' : ''}
                  ${log.type === 'warning' ? 'text-warning' : ''}
                  ${log.type === 'success' ? 'text-success' : ''}
                  ${log.type === 'info' ? 'text-info' : ''}
                `}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Terminal;