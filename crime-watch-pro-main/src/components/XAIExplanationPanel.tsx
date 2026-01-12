import { useState } from 'react';
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  AlertCircle,
  Database,
  Target,
  Clock,
  MapPin,
  Repeat,
  Lightbulb
} from 'lucide-react';
import { CrimeHotspot } from '@/data/crimeData';
import { 
  generateRiskExplanation, 
  estimateNearRepeatPatterns,
  createTriggerJustification,
  RiskExplanation,
  NearRepeatPattern
} from '@/data/xaiEngine';
import { Progress } from '@/components/ui/progress';

interface XAIExplanationPanelProps {
  hotspot: CrimeHotspot | null;
}

const XAIExplanationPanel = ({ hotspot }: XAIExplanationPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'factors' | 'patterns' | 'justification'>('factors');
  
  if (!hotspot) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">XAI Risk Explanation</h3>
            <p className="text-xs text-muted-foreground">Select a hotspot to view AI reasoning</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No hotspot selected</p>
        </div>
      </div>
    );
  }
  
  const explanations = generateRiskExplanation(hotspot);
  const nearRepeatPatterns = estimateNearRepeatPatterns(hotspot);
  const justification = createTriggerJustification(hotspot, 'alert');
  
  const getSourceIcon = (source: RiskExplanation['source']) => {
    switch (source) {
      case 'historical': return <Database className="h-3.5 w-3.5" />;
      case 'temporal': return <Clock className="h-3.5 w-3.5" />;
      case 'spatial': return <MapPin className="h-3.5 w-3.5" />;
      case 'near-repeat': return <Repeat className="h-3.5 w-3.5" />;
      case 'environmental': return <Lightbulb className="h-3.5 w-3.5" />;
    }
  };
  
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 relative">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">XAI Risk Explanation</h3>
              <p className="text-xs text-muted-foreground">{hotspot.name} - Why this risk score?</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-border">
            {[
              { id: 'factors', label: 'Risk Factors' },
              { id: 'patterns', label: 'Near-Repeat' },
              { id: 'justification', label: 'Trigger Logic' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-primary border-b-2 border-primary bg-primary/5' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-4 max-h-[350px] overflow-y-auto">
            {/* Risk Factors Tab */}
            {activeTab === 'factors' && (
              <div className="space-y-4">
                {explanations.map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-secondary">
                          {getSourceIcon(exp.source)}
                        </div>
                        <span className="text-sm font-medium">{exp.factor}</span>
                      </div>
                      <span className="text-xs font-mono text-primary">
                        +{exp.contribution} pts ({Math.round(exp.weight * 100)}%)
                      </span>
                    </div>
                    <Progress value={exp.weight * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>Total risk score: {hotspot.risk}/100 based on weighted factor analysis</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Near-Repeat Patterns Tab */}
            {activeTab === 'patterns' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-medium text-amber-400">Data Quality Notice</p>
                      <p className="text-muted-foreground mt-1">
                        Some records may have estimated values due to missing coordinates or timestamps in source data.
                      </p>
                    </div>
                  </div>
                </div>
                
                {nearRepeatPatterns.map((pattern, idx) => (
                  <div key={idx} className="p-3 bg-secondary/30 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{pattern.categoryMapping}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        pattern.confidence >= 0.8 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : pattern.confidence >= 0.6 
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {Math.round(pattern.confidence * 100)}% confidence
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Based on:</strong> {pattern.basedOn.join(', ')}</p>
                      {pattern.dataGaps.length > 0 && (
                        <p className="text-amber-400">
                          <strong>Data gaps:</strong> {pattern.dataGaps.join('; ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Trigger Justification Tab */}
            {activeTab === 'justification' && (
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Trigger ID</span>
                    <code className="text-xs bg-secondary px-2 py-1 rounded font-mono">
                      {justification.id.slice(0, 20)}...
                    </code>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-2 capitalize">{justification.triggerType.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="ml-2">{Math.round(justification.confidence * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Data Quality:</span>
                      <span className={`ml-2 capitalize ${
                        justification.dataQuality === 'high' ? 'text-emerald-400' :
                        justification.dataQuality === 'medium' ? 'text-amber-400' : 'text-red-400'
                      }`}>{justification.dataQuality}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Risk Level:</span>
                      <span className={`ml-2 capitalize ${
                        justification.riskLevel === 'critical' ? 'text-red-400' :
                        justification.riskLevel === 'high' ? 'text-orange-400' :
                        justification.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{justification.riskLevel}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    AI Decision Logic
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-2 p-3 bg-secondary/30 rounded-lg">
                    <p>1. Analyzed {justification.explanations.length} risk factors</p>
                    <p>2. Weighted contribution calculated for each factor</p>
                    <p>3. Near-repeat patterns checked within 500m/14 days</p>
                    <p>4. Environmental conditions factored ({justification.dataQuality} data quality)</p>
                    <p>5. Alert triggered at {justification.riskLevel.toUpperCase()} threshold</p>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground p-2 border border-border rounded">
                  <strong>Audit Trail:</strong> This decision is logged for accountability and model improvement.
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default XAIExplanationPanel;
