import { CrimeHotspot, getRiskLevel, getRiskColor } from '@/data/crimeData';
import { MapPin, AlertTriangle, Clock, ChevronRight } from 'lucide-react';

interface HotspotListProps {
  hotspots: CrimeHotspot[];
  selectedHotspot: CrimeHotspot | null;
  onSelectHotspot: (hotspot: CrimeHotspot) => void;
}

const HotspotList = ({ hotspots, selectedHotspot, onSelectHotspot }: HotspotListProps) => {
  const sortedHotspots = [...hotspots].sort((a, b) => b.risk - a.risk);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Crime Hotspots</h3>
          <span className="text-xs text-muted-foreground">{hotspots.length} locations</span>
        </div>
      </div>

      <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
        {sortedHotspots.map((hotspot, index) => {
          const isSelected = selectedHotspot?.id === hotspot.id;
          const riskLevel = getRiskLevel(hotspot.risk);
          
          return (
            <button
              key={hotspot.id}
              onClick={() => onSelectHotspot(hotspot)}
              className={`
                w-full p-4 text-left transition-all duration-200 
                hover:bg-secondary/50 animate-fade-in
                ${isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : ''}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Rank Badge */}
                <div className={`
                  w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                  ${riskLevel === 'critical' || riskLevel === 'high' 
                    ? 'bg-red-500/20 text-red-400' 
                    : riskLevel === 'medium'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                  }
                `}>
                  #{index + 1}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <h4 className="font-medium text-sm truncate">{hotspot.name}</h4>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <AlertTriangle className="h-3 w-3" />
                      <span className="truncate max-w-[100px]">{hotspot.crimes[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{hotspot.peakHours}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-lg ${getRiskColor(hotspot.risk)}`}>
                    {hotspot.risk}
                  </span>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HotspotList;
