import { useState } from 'react';
import { 
  UserX, 
  MessageSquare, 
  TrendingDown, 
  History,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CrimeHotspot } from '@/data/crimeData';
import { 
  recordHumanOverride, 
  getOverrideHistory, 
  getPatternWeight,
  HumanOverride 
} from '@/data/xaiEngine';
import { toast } from 'sonner';

interface HumanOverridePanelProps {
  hotspot: CrimeHotspot | null;
  triggerId?: string;
  onOverrideRecorded?: (override: HumanOverride) => void;
}

const HumanOverridePanel = ({ hotspot, triggerId, onOverrideRecorded }: HumanOverridePanelProps) => {
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideAction, setOverrideAction] = useState<HumanOverride['overrideAction']>('ignored');
  
  const overrideHistory = hotspot ? getOverrideHistory(hotspot.id) : [];
  const patternWeight = hotspot ? getPatternWeight(hotspot.id) : 1.0;
  const weightReduction = Math.round((1 - patternWeight) * 100);
  
  const handleSubmitOverride = () => {
    if (!hotspot || !overrideReason.trim()) {
      toast.error('Please provide a reason for the override');
      return;
    }
    
    const override = recordHumanOverride(
      triggerId || `trigger-${Date.now()}`,
      hotspot.id,
      `AI recommended patrol for ${hotspot.name}`,
      overrideAction,
      overrideReason
    );
    
    toast.success('Override recorded - model will learn from this decision');
    setShowOverrideForm(false);
    setOverrideReason('');
    onOverrideRecorded?.(override);
  };
  
  if (!hotspot) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <UserX className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold">Human Override Learning</h3>
            <p className="text-xs text-muted-foreground">AI learns from officer decisions</p>
          </div>
        </div>
        <div className="text-center py-6 text-muted-foreground">
          <UserX className="h-10 w-10 mx-auto mb-2 opacity-20" />
          <p className="text-sm">Select a hotspot to override AI</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-violet-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <UserX className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold">Human Override Learning</h3>
              <p className="text-xs text-muted-foreground">{hotspot.name}</p>
            </div>
          </div>
          
          {weightReduction > 0 && (
            <div className="flex items-center gap-2 px-2 py-1 bg-amber-500/20 rounded-md">
              <TrendingDown className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs text-amber-400">
                Weight reduced {weightReduction}%
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Explanation */}
        <div className="p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              When you override AI recommendations, the system learns and reduces the weight of similar patterns in future predictions.
            </p>
          </div>
        </div>
        
        {/* Override Button */}
        {!showOverrideForm && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowOverrideForm(true)}
          >
            <UserX className="h-4 w-4 mr-2" />
            Override AI Recommendation
          </Button>
        )}
        
        {/* Override Form */}
        {showOverrideForm && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex gap-2">
              {(['ignored', 'modified', 'delayed'] as const).map((action) => (
                <button
                  key={action}
                  onClick={() => setOverrideAction(action)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors capitalize ${
                    overrideAction === action 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-secondary border-border hover:bg-secondary/80'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
            
            <Textarea
              placeholder="Why are you overriding this recommendation? (e.g., 'Local festival - crowd is peaceful', 'Already deployed officers elsewhere')"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="min-h-[80px] text-sm"
            />
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowOverrideForm(false);
                  setOverrideReason('');
                }}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSubmitOverride}
                disabled={!overrideReason.trim()}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-1" />
                Submit Override
              </Button>
            </div>
          </div>
        )}
        
        {/* Override History */}
        {overrideHistory.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <History className="h-4 w-4 text-muted-foreground" />
              <span>Override History</span>
            </div>
            
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {overrideHistory.slice(-3).reverse().map((override) => (
                <div key={override.id} className="p-2 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${
                      override.overrideAction === 'ignored' ? 'bg-red-500/20 text-red-400' :
                      override.overrideAction === 'modified' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {override.overrideAction}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Weight: {Math.round(override.patternWeight * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                    <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    {override.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HumanOverridePanel;
