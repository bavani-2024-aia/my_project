import { TimeRisk, getRiskColor, getRiskBgColor } from '@/data/crimeData';
import { Clock, TrendingUp } from 'lucide-react';

interface TimeRiskChartProps {
  timeRisk: TimeRisk[];
}

const TimeRiskChart = ({ timeRisk }: TimeRiskChartProps) => {
  const maxRisk = Math.max(...timeRisk.map(t => t.risk));
  const peakTime = timeRisk.find(t => t.risk === maxRisk);

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Time-Based Risk</h3>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded-md">
            <TrendingUp className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs font-medium text-red-400">Peak: {peakTime?.label}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {timeRisk.map((item) => {
          const widthPercent = (item.risk / 100) * 100;
          const isMax = item.risk === maxRisk;
          
          return (
            <div key={item.hour} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-mono ${isMax ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.crimeType}</span>
                  <span className={`text-sm font-mono font-semibold ${getRiskColor(item.risk)}`}>
                    {item.risk}%
                  </span>
                </div>
              </div>
              
              <div className="relative h-6 bg-secondary rounded-md overflow-hidden">
                <div
                  className={`
                    absolute inset-y-0 left-0 ${getRiskBgColor(item.risk)} 
                    transition-all duration-500 ease-out rounded-md
                    ${isMax ? 'animate-pulse' : ''}
                  `}
                  style={{ width: `${widthPercent}%` }}
                />
                <div className="absolute inset-0 flex items-center px-2">
                  <div 
                    className="flex items-center gap-1"
                    style={{ width: `${widthPercent}%` }}
                  >
                    {Array.from({ length: Math.floor(item.risk / 10) }).map((_, i) => (
                      <div key={i} className="w-1.5 h-3 bg-white/30 rounded-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-secondary/30">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Highest Risk</p>
            <p className="text-lg font-bold text-red-400">{maxRisk}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Risk</p>
            <p className="text-lg font-bold text-amber-400">
              {Math.round(timeRisk.reduce((a, b) => a + b.risk, 0) / timeRisk.length)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeRiskChart;
