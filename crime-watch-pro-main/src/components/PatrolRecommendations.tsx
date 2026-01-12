import { CrimeHotspot, getRiskLevel, getPatrolRecommendations } from '@/data/crimeData';
import { 
  Bot, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PatrolRecommendationsProps {
  hotspots: CrimeHotspot[];
}

const PatrolRecommendations = ({ hotspots }: PatrolRecommendationsProps) => {
  const recommendations = getPatrolRecommendations(hotspots);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 relative">
            <Bot className="h-5 w-5 text-primary" />
            <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1" />
          </div>
          <div>
            <h3 className="font-semibold">AI Patrol Recommendations</h3>
            <p className="text-xs text-muted-foreground">Optimized deployment based on risk analysis</p>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="divide-y divide-border">
        {recommendations.map((rec, index) => (
          <div
            key={rec.id}
            className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Priority Badge */}
              <div className={`
                px-2 py-1 rounded-md text-xs font-bold border
                ${getPriorityStyle(rec.priority)}
              `}>
                {rec.priority}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <h4 className="font-semibold text-sm truncate">{rec.name}</h4>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{rec.peakHours}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{rec.crimes.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">
                    Suggested: {rec.suggestedPatrols} patrol unit{rec.suggestedPatrols > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Risk Score */}
              <div className="text-right flex-shrink-0">
                <div className={`
                  font-mono font-bold text-xl
                  ${getRiskLevel(rec.risk) === 'critical' ? 'text-red-400' :
                    getRiskLevel(rec.risk) === 'high' ? 'text-orange-400' :
                    getRiskLevel(rec.risk) === 'medium' ? 'text-amber-400' :
                    'text-emerald-400'}
                `}>
                  {rec.risk}
                </div>
                <p className="text-xs text-muted-foreground">Risk Score</p>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-border bg-secondary/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Total units needed:</span>
          </div>
          <span className="font-bold text-primary">
            {recommendations.reduce((sum, r) => sum + r.suggestedPatrols, 0)} officers
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatrolRecommendations;
