import { CrimeHotspot } from '@/data/crimeData';
import { generateSuggestedActions, SuggestedAction } from '@/data/xaiEngine';
import { 
  Wand2, 
  Users, 
  Camera, 
  Lightbulb, 
  Megaphone, 
  Siren,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SuggestedActionsPanelProps {
  hotspot: CrimeHotspot | null;
}

const SuggestedActionsPanel = ({ hotspot }: SuggestedActionsPanelProps) => {
  const [acceptedActions, setAcceptedActions] = useState<Set<string>>(new Set());
  
  if (!hotspot) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Wand2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold">AI Suggested Actions</h3>
            <p className="text-xs text-muted-foreground">Select a hotspot for recommendations</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Wand2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No hotspot selected</p>
        </div>
      </div>
    );
  }
  
  const actions = generateSuggestedActions(hotspot);
  
  const getActionIcon = (type: SuggestedAction['type']) => {
    switch (type) {
      case 'patrol': return <Users className="h-4 w-4" />;
      case 'cctv': return <Camera className="h-4 w-4" />;
      case 'lighting': return <Lightbulb className="h-4 w-4" />;
      case 'awareness': return <Megaphone className="h-4 w-4" />;
      case 'backup': return <Siren className="h-4 w-4" />;
    }
  };
  
  const getPriorityStyle = (priority: SuggestedAction['priority']) => {
    switch (priority) {
      case 'immediate': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };
  
  const toggleAction = (actionId: string) => {
    setAcceptedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };
  
  const totalImpact = actions
    .filter(a => acceptedActions.has(a.id))
    .reduce((sum, a) => sum + a.expectedImpact, 0);
  
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-emerald-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20">
            <Wand2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold">AI Suggested Actions</h3>
            <p className="text-xs text-muted-foreground">{hotspot.name} - Not just predictions</p>
          </div>
        </div>
      </div>
      
      {/* Actions List */}
      <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
        {actions.map((action) => {
          const isAccepted = acceptedActions.has(action.id);
          
          return (
            <div 
              key={action.id} 
              className={`p-4 transition-colors ${isAccepted ? 'bg-emerald-500/5' : 'hover:bg-secondary/30'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isAccepted ? 'bg-emerald-500/20' : 'bg-secondary'}`}>
                  {getActionIcon(action.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium">{action.title}</h4>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityStyle(action.priority)}`}>
                      {action.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>Impact: {action.expectedImpact}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 p-2 bg-secondary/50 rounded text-xs text-muted-foreground">
                    <strong>Why:</strong> {action.justification}
                  </div>
                </div>
                
                <Button
                  variant={isAccepted ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAction(action.id)}
                  className={isAccepted ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  {isAccepted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    'Accept'
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Footer */}
      {acceptedActions.size > 0 && (
        <div className="p-4 border-t border-border bg-emerald-500/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {acceptedActions.size} action{acceptedActions.size > 1 ? 's' : ''} accepted
            </span>
            <span className="font-bold text-emerald-400">
              Expected Impact: {totalImpact}% risk reduction
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedActionsPanel;
