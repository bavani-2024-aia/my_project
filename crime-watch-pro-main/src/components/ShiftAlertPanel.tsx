import { CrimeHotspot } from '@/data/crimeData';
import { generateShiftAlerts, ShiftAlert } from '@/data/xaiEngine';
import { Clock, AlertTriangle, Users, ChevronRight } from 'lucide-react';

interface ShiftAlertPanelProps {
  hotspots: CrimeHotspot[];
}

const ShiftAlertPanel = ({ hotspots }: ShiftAlertPanelProps) => {
  const shiftAlerts = generateShiftAlerts(hotspots);
  
  const getShiftIcon = (shift: ShiftAlert['shiftType']) => {
    switch (shift) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
    }
  };
  
  const getPriorityColor = (priority: ShiftAlert['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };
  
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-amber-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold">Shift-Level Planning</h3>
            <p className="text-xs text-muted-foreground">Time-window based risk alerts</p>
          </div>
        </div>
      </div>
      
      {/* Shift Cards */}
      <div className="divide-y divide-border">
        {shiftAlerts.map((alert) => (
          <div key={alert.shiftType} className="p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getShiftIcon(alert.shiftType)}</span>
                <div>
                  <h4 className="font-medium capitalize">{alert.shiftType} Shift</h4>
                  <p className="text-xs text-muted-foreground">{alert.shiftHours}</p>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getPriorityColor(alert.priority)}`}>
                {alert.priority.toUpperCase()}
              </div>
            </div>
            
            {alert.hotspots.length > 0 ? (
              <div className="space-y-2">
                {alert.hotspots.slice(0, 3).map((hs) => (
                  <div key={hs.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-3.5 w-3.5 flex-shrink-0 ${
                          hs.risk >= 80 ? 'text-red-400' :
                          hs.risk >= 60 ? 'text-orange-400' : 'text-amber-400'
                        }`} />
                        <span className="text-sm font-medium truncate">{hs.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {hs.explanation}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-sm font-mono font-bold">{hs.risk}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
                
                {alert.hotspots.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center py-1">
                    +{alert.hotspots.length - 3} more hotspots
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No high-risk hotspots in this shift</p>
              </div>
            )}
            
            {alert.hotspots.length > 0 && (
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>Suggested officers: {Math.ceil(alert.totalRisk / 20)}</span>
                </div>
                <span className="text-primary font-medium">
                  Avg Risk: {alert.totalRisk}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftAlertPanel;
