import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Camera, 
  Lightbulb, 
  Play, 
  RotateCcw,
  TrendingDown,
  Shield,
  Zap
} from 'lucide-react';
import { CrimeHotspot, getRiskLevel } from '@/data/crimeData';

interface SimulationPanelProps {
  selectedHotspot: CrimeHotspot | null;
  onSimulate?: (newRisk: number) => void;
}

const SimulationPanel = ({ selectedHotspot, onSimulate }: SimulationPanelProps) => {
  const [patrols, setPatrols] = useState(0);
  const [cctv, setCctv] = useState(0);
  const [lighting, setLighting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedRisk, setSimulatedRisk] = useState<number | null>(null);

  const baseRisk = selectedHotspot?.risk || 75;

  // Reset simulation when hotspot changes
  useEffect(() => {
    setPatrols(0);
    setCctv(0);
    setLighting(false);
    setSimulatedRisk(null);
  }, [selectedHotspot?.id]);

  const calculateNewRisk = () => {
    let reduction = 0;
    reduction += patrols * 7; // Each patrol reduces 7%
    reduction += cctv * 10; // Each CCTV reduces 10%
    reduction += lighting ? 8 : 0; // Lighting reduces 8%
    
    return Math.max(10, baseRisk - reduction);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const newRisk = calculateNewRisk();
      setSimulatedRisk(newRisk);
      setIsSimulating(false);
      onSimulate?.(newRisk);
    }, 1500);
  };

  const handleReset = () => {
    setPatrols(0);
    setCctv(0);
    setLighting(false);
    setSimulatedRisk(null);
  };

  const totalReduction = simulatedRisk !== null ? baseRisk - simulatedRisk : 0;
  const reductionPercent = simulatedRisk !== null ? Math.round((totalReduction / baseRisk) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">What-If Simulation</h3>
            <p className="text-xs text-muted-foreground">
              {selectedHotspot ? selectedHotspot.name : 'Select a hotspot to simulate'}
            </p>
          </div>
        </div>
      </div>

      {/* Current Risk Display */}
      <div className="p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Risk Level</span>
          <div className="flex items-center gap-3">
            <div className={`
              px-3 py-1.5 rounded-lg font-mono font-bold text-lg
              ${getRiskLevel(baseRisk) === 'critical' ? 'bg-red-500/20 text-red-400' :
                getRiskLevel(baseRisk) === 'high' ? 'bg-orange-500/20 text-orange-400' :
                getRiskLevel(baseRisk) === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'}
            `}>
              {baseRisk}/100
            </div>
            {simulatedRisk !== null && (
              <>
                <TrendingDown className="h-5 w-5 text-emerald-400" />
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 font-mono font-bold text-lg text-emerald-400">
                  {simulatedRisk}/100
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Patrol Units */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Patrol Units</span>
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {patrols} units (-{patrols * 7}%)
            </span>
          </div>
          <Slider
            value={[patrols]}
            onValueChange={(value) => setPatrols(value[0])}
            max={5}
            step={1}
            className="w-full"
            disabled={!selectedHotspot}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>5 units</span>
          </div>
        </div>

        {/* CCTV Cameras */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">CCTV Cameras</span>
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {cctv} cameras (-{cctv * 10}%)
            </span>
          </div>
          <Slider
            value={[cctv]}
            onValueChange={(value) => setCctv(value[0])}
            max={4}
            step={1}
            className="w-full"
            disabled={!selectedHotspot}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>4 cameras</span>
          </div>
        </div>

        {/* Street Lighting */}
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Lightbulb className={`h-5 w-5 ${lighting ? 'text-amber-400' : 'text-muted-foreground'}`} />
            <div>
              <span className="text-sm font-medium">Enhanced Street Lighting</span>
              <p className="text-xs text-muted-foreground">Reduces risk by 8%</p>
            </div>
          </div>
          <Switch
            checked={lighting}
            onCheckedChange={setLighting}
            disabled={!selectedHotspot}
          />
        </div>
      </div>

      {/* Simulation Result */}
      {simulatedRisk !== null && (
        <div className="p-4 border-t border-border bg-emerald-500/10 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-500/20">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-emerald-400">
                Risk Reduced by {reductionPercent}%
              </p>
              <p className="text-xs text-muted-foreground">
                From {baseRisk} to {simulatedRisk} risk score
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 border-t border-border flex gap-3">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1"
          disabled={patrols === 0 && cctv === 0 && !lighting}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={handleSimulate}
          className="flex-1"
          disabled={!selectedHotspot || isSimulating}
        >
          {isSimulating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Simulating...
            </div>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Simulate
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SimulationPanel;
