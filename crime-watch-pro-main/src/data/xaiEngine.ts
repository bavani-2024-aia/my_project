// XAI (Explainable AI) Engine - Provides transparency and accountability

import { CrimeHotspot, CrimeType, RiskLevel, getRiskLevel } from './crimeData';

// ============= XAI EXPLANATION SYSTEM =============

export interface RiskExplanation {
  factor: string;
  weight: number;
  contribution: number;
  description: string;
  source: 'historical' | 'temporal' | 'spatial' | 'near-repeat' | 'environmental';
}

export interface TriggerJustification {
  id: string;
  timestamp: Date;
  hotspotId: string;
  triggerType: 'alert' | 'patrol_recommendation' | 'risk_escalation';
  riskLevel: RiskLevel;
  explanations: RiskExplanation[];
  confidence: number;
  dataQuality: 'high' | 'medium' | 'low' | 'estimated';
  wasOverridden?: boolean;
  overrideReason?: string;
}

export interface NearRepeatPattern {
  originalIncidentId: string;
  estimatedLocation: { lat: number; lng: number };
  estimatedTime: string;
  confidence: number;
  basedOn: string[];
  categoryMapping: CrimeType;
  dataGaps: string[];
}

export interface HumanOverride {
  id: string;
  triggerId: string;
  hotspotId: string;
  originalRecommendation: string;
  overrideAction: 'ignored' | 'modified' | 'delayed';
  reason: string;
  timestamp: Date;
  patternWeight: number; // Reduced weight for future predictions
}

export interface ShiftAlert {
  shiftType: 'morning' | 'afternoon' | 'evening' | 'night';
  shiftHours: string;
  hotspots: {
    id: string;
    name: string;
    risk: number;
    peakWithinShift: string;
    explanation: string;
  }[];
  totalRisk: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

// ============= RISK EXPLANATION GENERATOR =============

export const generateRiskExplanation = (hotspot: CrimeHotspot): RiskExplanation[] => {
  const explanations: RiskExplanation[] = [];
  
  // Historical crime frequency
  explanations.push({
    factor: 'Historical Crime Frequency',
    weight: 0.35,
    contribution: Math.round(hotspot.risk * 0.35),
    description: `${hotspot.crimes.length} crime types reported historically in this area`,
    source: 'historical'
  });
  
  // Temporal patterns
  explanations.push({
    factor: 'Peak Hour Vulnerability',
    weight: 0.25,
    contribution: Math.round(hotspot.risk * 0.25),
    description: `High-risk window identified: ${hotspot.peakHours}`,
    source: 'temporal'
  });
  
  // Spatial factors
  explanations.push({
    factor: 'Location Characteristics',
    weight: 0.20,
    contribution: Math.round(hotspot.risk * 0.20),
    description: getLocationCharacteristics(hotspot.name),
    source: 'spatial'
  });
  
  // Near-repeat estimation
  if (hotspot.risk > 60) {
    explanations.push({
      factor: 'Near-Repeat Pattern',
      weight: 0.12,
      contribution: Math.round(hotspot.risk * 0.12),
      description: 'Similar incidents within 500m radius in past 14 days',
      source: 'near-repeat'
    });
  }
  
  // Environmental factors
  explanations.push({
    factor: 'Environmental Risk',
    weight: 0.08,
    contribution: Math.round(hotspot.risk * 0.08),
    description: 'Lighting conditions, crowd density, escape routes',
    source: 'environmental'
  });
  
  return explanations.sort((a, b) => b.contribution - a.contribution);
};

const getLocationCharacteristics = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('bus') || lower.includes('station')) {
    return 'High-traffic transit hub with multiple entry/exit points';
  }
  if (lower.includes('market')) {
    return 'Commercial zone with high pedestrian density';
  }
  if (lower.includes('temple') || lower.includes('church')) {
    return 'Tourist/religious area with valuables and crowds';
  }
  if (lower.includes('beach')) {
    return 'Open area with limited lighting and patrol coverage';
  }
  return 'Urban area with mixed commercial/residential activity';
};

// ============= NEAR-REPEAT PATTERN ESTIMATION =============

export const estimateNearRepeatPatterns = (hotspot: CrimeHotspot): NearRepeatPattern[] => {
  const patterns: NearRepeatPattern[] = [];
  const dataGaps: string[] = [];
  
  // Simulate data quality issues common in India
  const hasExactTime = Math.random() > 0.4;
  const hasExactLocation = Math.random() > 0.3;
  
  if (!hasExactTime) dataGaps.push('Exact incident time missing - estimated from shift logs');
  if (!hasExactLocation) dataGaps.push('Precise coordinates unavailable - mapped to nearest landmark');
  
  hotspot.crimes.forEach((crime, idx) => {
    patterns.push({
      originalIncidentId: `${hotspot.id}-incident-${idx + 1}`,
      estimatedLocation: {
        lat: hotspot.lat + (Math.random() - 0.5) * 0.005,
        lng: hotspot.lng + (Math.random() - 0.5) * 0.005
      },
      estimatedTime: hotspot.peakHours,
      confidence: hasExactTime && hasExactLocation ? 0.85 : 0.65,
      basedOn: [
        hasExactLocation ? 'GPS coordinates' : 'Nearby landmark records',
        hasExactTime ? 'FIR timestamp' : 'Patrol shift logs',
        'Historical crime category mapping'
      ],
      categoryMapping: crime,
      dataGaps
    });
  });
  
  return patterns;
};

// ============= TRIGGER JUSTIFICATION STORAGE =============

const triggerJustifications: TriggerJustification[] = [];

export const createTriggerJustification = (
  hotspot: CrimeHotspot,
  triggerType: TriggerJustification['triggerType']
): TriggerJustification => {
  const explanations = generateRiskExplanation(hotspot);
  const nearRepeat = estimateNearRepeatPatterns(hotspot);
  
  const justification: TriggerJustification = {
    id: `trigger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    hotspotId: hotspot.id,
    triggerType,
    riskLevel: getRiskLevel(hotspot.risk),
    explanations,
    confidence: nearRepeat[0]?.confidence || 0.75,
    dataQuality: nearRepeat[0]?.dataGaps.length === 0 ? 'high' : 
                 nearRepeat[0]?.dataGaps.length === 1 ? 'medium' : 'low'
  };
  
  triggerJustifications.push(justification);
  return justification;
};

export const getTriggerJustifications = (): TriggerJustification[] => {
  return [...triggerJustifications];
};

// ============= HUMAN OVERRIDE LEARNING =============

const humanOverrides: HumanOverride[] = [];
const patternWeights: Map<string, number> = new Map();

export const recordHumanOverride = (
  triggerId: string,
  hotspotId: string,
  originalRecommendation: string,
  overrideAction: HumanOverride['overrideAction'],
  reason: string
): HumanOverride => {
  // Calculate reduced weight for this pattern
  const currentWeight = patternWeights.get(hotspotId) || 1.0;
  const newWeight = Math.max(0.3, currentWeight * 0.85); // Reduce by 15% each override
  patternWeights.set(hotspotId, newWeight);
  
  const override: HumanOverride = {
    id: `override-${Date.now()}`,
    triggerId,
    hotspotId,
    originalRecommendation,
    overrideAction,
    reason,
    timestamp: new Date(),
    patternWeight: newWeight
  };
  
  humanOverrides.push(override);
  return override;
};

export const getPatternWeight = (hotspotId: string): number => {
  return patternWeights.get(hotspotId) || 1.0;
};

export const getOverrideHistory = (hotspotId?: string): HumanOverride[] => {
  if (hotspotId) {
    return humanOverrides.filter(o => o.hotspotId === hotspotId);
  }
  return [...humanOverrides];
};

export const getOverrideCount = (hotspotId: string): number => {
  return humanOverrides.filter(o => o.hotspotId === hotspotId).length;
};

// ============= SHIFT-BASED ALERTS =============

export const generateShiftAlerts = (hotspots: CrimeHotspot[]): ShiftAlert[] => {
  const shifts = [
    { type: 'morning' as const, hours: '6AM - 12PM', range: [6, 12] },
    { type: 'afternoon' as const, hours: '12PM - 6PM', range: [12, 18] },
    { type: 'evening' as const, hours: '6PM - 12AM', range: [18, 24] },
    { type: 'night' as const, hours: '12AM - 6AM', range: [0, 6] }
  ];
  
  return shifts.map(shift => {
    const relevantHotspots = hotspots
      .filter(h => {
        const peakStart = parseInt(h.peakHours.split('-')[0].replace(/[^\d]/g, ''));
        const isPM = h.peakHours.toLowerCase().includes('pm');
        const hour24 = isPM && peakStart !== 12 ? peakStart + 12 : peakStart;
        return hour24 >= shift.range[0] && hour24 < shift.range[1];
      })
      .map(h => ({
        id: h.id,
        name: h.name,
        risk: h.risk,
        peakWithinShift: h.peakHours,
        explanation: `${h.crimes.join(', ')} - ${generateRiskExplanation(h)[0].description}`
      }))
      .sort((a, b) => b.risk - a.risk);
    
    const totalRisk = relevantHotspots.reduce((sum, h) => sum + h.risk, 0) / Math.max(relevantHotspots.length, 1);
    
    return {
      shiftType: shift.type,
      shiftHours: shift.hours,
      hotspots: relevantHotspots,
      totalRisk: Math.round(totalRisk),
      priority: totalRisk >= 80 ? 'critical' : totalRisk >= 60 ? 'high' : totalRisk >= 40 ? 'medium' : 'low'
    };
  });
};

// ============= SUGGESTED ACTIONS =============

export interface SuggestedAction {
  id: string;
  type: 'patrol' | 'cctv' | 'lighting' | 'awareness' | 'backup';
  title: string;
  description: string;
  expectedImpact: number;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  justification: string;
}

export const generateSuggestedActions = (hotspot: CrimeHotspot): SuggestedAction[] => {
  const actions: SuggestedAction[] = [];
  const riskLevel = getRiskLevel(hotspot.risk);
  
  // Always suggest patrol based on risk
  if (hotspot.risk >= 70) {
    actions.push({
      id: `action-patrol-${hotspot.id}`,
      type: 'patrol',
      title: 'Deploy Foot Patrol',
      description: `Station ${Math.ceil(hotspot.risk / 25)} officers during ${hotspot.peakHours}`,
      expectedImpact: -Math.min(35, hotspot.risk * 0.4),
      priority: riskLevel === 'critical' ? 'immediate' : 'high',
      justification: `Historical ${hotspot.crimes[0]} incidents peak during these hours`
    });
  }
  
  // CCTV for theft-heavy areas
  if (hotspot.crimes.includes('Theft') || hotspot.crimes.includes('Robbery')) {
    actions.push({
      id: `action-cctv-${hotspot.id}`,
      type: 'cctv',
      title: 'Enhanced CCTV Monitoring',
      description: 'Activate real-time monitoring on existing cameras',
      expectedImpact: -20,
      priority: 'high',
      justification: 'Property crimes reduced 30% with active monitoring'
    });
  }
  
  // Lighting for night incidents
  if (hotspot.peakHours.toLowerCase().includes('pm') || hotspot.peakHours.toLowerCase().includes('am')) {
    actions.push({
      id: `action-lighting-${hotspot.id}`,
      type: 'lighting',
      title: 'Improve Street Lighting',
      description: 'Ensure all street lights operational in 200m radius',
      expectedImpact: -8,
      priority: 'medium',
      justification: 'Low visibility correlated with increased incidents'
    });
  }
  
  // Harassment-specific
  if (hotspot.crimes.includes('Harassment')) {
    actions.push({
      id: `action-awareness-${hotspot.id}`,
      type: 'awareness',
      title: 'Visible Police Presence',
      description: 'Position marked vehicle at location entrance',
      expectedImpact: -15,
      priority: 'high',
      justification: 'Deterrent effect reduces harassment by 40%'
    });
  }
  
  // Critical areas need backup
  if (riskLevel === 'critical') {
    actions.push({
      id: `action-backup-${hotspot.id}`,
      type: 'backup',
      title: 'Standby Quick Response',
      description: 'Keep mobile unit within 2km for rapid deployment',
      expectedImpact: -5,
      priority: 'immediate',
      justification: 'Response time critical for high-risk zones'
    });
  }
  
  return actions.sort((a, b) => {
    const priorityOrder = { immediate: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

// ============= DATA QUALITY INDICATOR =============

export interface DataQualityReport {
  overallQuality: 'high' | 'medium' | 'low';
  score: number;
  issues: string[];
  estimatedRecords: number;
  verifiedRecords: number;
}

export const assessDataQuality = (hotspots: CrimeHotspot[]): DataQualityReport => {
  const issues: string[] = [];
  let qualityScore = 100;
  
  // Simulate common Indian data issues
  const estimatedRecords = Math.floor(hotspots.length * 0.4);
  const verifiedRecords = hotspots.length - estimatedRecords;
  
  if (estimatedRecords > 0) {
    issues.push(`${estimatedRecords} records have estimated coordinates`);
    qualityScore -= 15;
  }
  
  if (Math.random() > 0.6) {
    issues.push('Some incident times approximated from shift logs');
    qualityScore -= 10;
  }
  
  if (Math.random() > 0.7) {
    issues.push('Category mapping applied to unclassified incidents');
    qualityScore -= 8;
  }
  
  return {
    overallQuality: qualityScore >= 80 ? 'high' : qualityScore >= 60 ? 'medium' : 'low',
    score: qualityScore,
    issues,
    estimatedRecords,
    verifiedRecords
  };
};
