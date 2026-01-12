import { useState } from 'react';
import { MapPin, AlertTriangle, Clock, Filter, Crosshair } from 'lucide-react';
import { CrimeHotspot, CrimeType, getRiskLevel, getRiskColor } from '@/data/crimeData';

interface CrimeMapProps {
  hotspots: CrimeHotspot[];
  selectedHotspot: CrimeHotspot | null;
  onSelectHotspot: (hotspot: CrimeHotspot | null) => void;
  filterCrime: CrimeType | 'All';
  onFilterChange: (filter: CrimeType | 'All') => void;
}

const CrimeMap = ({ hotspots, selectedHotspot, onSelectHotspot, filterCrime, onFilterChange }: CrimeMapProps) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const filteredHotspots = filterCrime === 'All' 
    ? hotspots 
    : hotspots.filter(h => h.crimes.includes(filterCrime));

  const crimeTypes: (CrimeType | 'All')[] = ['All', 'Theft', 'Harassment', 'Fight', 'Robbery', 'Vandalism'];

  const getMarkerStyle = (risk: number) => {
    const size = Math.max(40, Math.min(70, risk * 0.7));
    const level = getRiskLevel(risk);
    
    let bgColor = '';
    let glowClass = '';
    
    switch (level) {
      case 'critical':
        bgColor = 'bg-red-500';
        glowClass = 'marker-glow-high animate-pulse';
        break;
      case 'high':
        bgColor = 'bg-orange-500';
        glowClass = 'marker-glow-high';
        break;
      case 'medium':
        bgColor = 'bg-amber-400';
        glowClass = 'marker-glow-medium';
        break;
      default:
        bgColor = 'bg-emerald-400';
        glowClass = 'marker-glow-low';
    }
    
    return { size, bgColor, glowClass };
  };

  // Generate random but consistent positions for hotspots on the map view
  const getPosition = (hotspot: CrimeHotspot, index: number) => {
    // Create a visual spread based on index
    const positions = [
      { top: '25%', left: '35%' },
      { top: '45%', left: '65%' },
      { top: '60%', left: '25%' },
      { top: '35%', left: '75%' },
      { top: '70%', left: '55%' },
      { top: '20%', left: '50%' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card/50">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        <div className="flex flex-wrap gap-2">
          {crimeTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200
                ${filterCrime === type 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 bg-card/30 bg-grid-pattern overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Stylized road network */}
            <path d="M0,50 L100,50" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            <path d="M50,0 L50,100" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            <path d="M25,0 L25,100" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <path d="M75,0 L75,100" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <path d="M0,25 L100,25" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <path d="M0,75 L100,75" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            {/* Curved roads */}
            <path d="M0,30 Q50,40 100,20" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" fill="none" />
            <path d="M20,100 Q40,50 80,0" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" fill="none" />
          </svg>
        </div>

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <Crosshair className="h-32 w-32 text-primary" strokeWidth={0.5} />
        </div>

        {/* Hotspot Markers */}
        {filteredHotspots.map((hotspot, index) => {
          const position = getPosition(hotspot, index);
          const { size, bgColor, glowClass } = getMarkerStyle(hotspot.risk);
          const isSelected = selectedHotspot?.id === hotspot.id;
          const isHovered = hoveredHotspot === hotspot.id;
          
          return (
            <div
              key={hotspot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{ top: position.top, left: position.left }}
              onClick={() => onSelectHotspot(isSelected ? null : hotspot)}
              onMouseEnter={() => setHoveredHotspot(hotspot.id)}
              onMouseLeave={() => setHoveredHotspot(null)}
            >
              {/* Marker */}
              <div
                className={`
                  relative rounded-full ${bgColor} ${glowClass}
                  flex items-center justify-center
                  transition-transform duration-300
                  ${isSelected || isHovered ? 'scale-125 z-20' : 'z-10'}
                `}
                style={{ width: size, height: size, opacity: 0.9 }}
              >
                <span className="font-mono font-bold text-sm text-white drop-shadow-lg">
                  {hotspot.risk}
                </span>
              </div>

              {/* Tooltip */}
              {(isHovered || isSelected) && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-4 bg-popover border border-border rounded-xl shadow-xl animate-fade-in z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{hotspot.name}</h4>
                    <span className={`font-mono font-bold ${getRiskColor(hotspot.risk)}`}>
                      {hotspot.risk}/100
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      <span>{hotspot.crimes.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>Peak: {hotspot.peakHours}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {hotspot.description}
                  </p>

                  {/* Arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 p-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
          <p className="text-xs font-medium mb-2 text-muted-foreground">Risk Level</p>
          <div className="space-y-1.5">
            {[
              { label: 'Critical (80-100)', color: 'bg-red-500' },
              { label: 'High (60-79)', color: 'bg-orange-500' },
              { label: 'Medium (40-59)', color: 'bg-amber-400' },
              { label: 'Low (0-39)', color: 'bg-emerald-400' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspot count badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{filteredHotspots.length} Hotspots</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;
