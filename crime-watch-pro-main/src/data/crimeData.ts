export interface CrimeHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  risk: number;
  crimes: CrimeType[];
  peakHours: string;
  description: string;
}

export interface TimeRisk {
  hour: number;
  risk: number;
  label: string;
  crimeType: CrimeType;
}

export type CrimeType = 'Theft' | 'Harassment' | 'Fight' | 'Robbery' | 'Vandalism';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface CityData {
  city: string;
  aliases: string[];
  hotspots: CrimeHotspot[];
  timeRisk: TimeRisk[];
}

export const getRiskLevel = (risk: number): RiskLevel => {
  if (risk >= 80) return 'critical';
  if (risk >= 60) return 'high';
  if (risk >= 40) return 'medium';
  return 'low';
};

export const getRiskColor = (risk: number): string => {
  if (risk >= 80) return 'text-red-500';
  if (risk >= 60) return 'text-orange-500';
  if (risk >= 40) return 'text-amber-400';
  return 'text-emerald-400';
};

export const getRiskBgColor = (risk: number): string => {
  if (risk >= 80) return 'bg-red-500';
  if (risk >= 60) return 'bg-orange-500';
  if (risk >= 40) return 'bg-amber-400';
  return 'bg-emerald-400';
};

export const crimeDatabase: CityData[] = [
  {
    city: 'Coimbatore',
    aliases: ['cbe', 'coimbatore', 'kovai'],
    hotspots: [
      {
        id: 'cbe-1',
        name: 'Gandhipuram Bus Stand',
        lat: 11.0168,
        lng: 76.9558,
        risk: 85,
        crimes: ['Theft', 'Harassment'],
        peakHours: '6PM - 11PM',
        description: 'Major bus terminal with high footfall. Peak theft incidents during evening rush hours.',
      },
      {
        id: 'cbe-2',
        name: 'RS Puram Market',
        lat: 11.0123,
        lng: 76.9489,
        risk: 72,
        crimes: ['Theft', 'Robbery'],
        peakHours: '5PM - 9PM',
        description: 'Busy commercial area with crowded markets. Pickpocketing common during peak shopping hours.',
      },
      {
        id: 'cbe-3',
        name: 'Railway Station',
        lat: 11.0018,
        lng: 76.9629,
        risk: 68,
        crimes: ['Fight', 'Harassment'],
        peakHours: '10PM - 2AM',
        description: 'Late night altercations near ticket counters and waiting areas.',
      },
      {
        id: 'cbe-4',
        name: 'Ukkadam',
        lat: 10.9925,
        lng: 76.9612,
        risk: 78,
        crimes: ['Robbery', 'Fight'],
        peakHours: '8PM - 12AM',
        description: 'Commercial area with multiple incidents reported during late evening.',
      },
      {
        id: 'cbe-5',
        name: 'Town Hall',
        lat: 11.0059,
        lng: 76.9597,
        risk: 45,
        crimes: ['Vandalism'],
        peakHours: '11PM - 3AM',
        description: 'Occasional vandalism incidents in surrounding areas during late night.',
      },
      {
        id: 'cbe-6',
        name: 'Singanallur',
        lat: 11.0108,
        lng: 77.0266,
        risk: 55,
        crimes: ['Theft', 'Harassment'],
        peakHours: '7PM - 10PM',
        description: 'Residential area with moderate crime rate. Mostly two-wheeler thefts.',
      },
    ],
    timeRisk: [
      { hour: 18, risk: 65, label: '6 PM', crimeType: 'Theft' },
      { hour: 19, risk: 78, label: '7 PM', crimeType: 'Theft' },
      { hour: 20, risk: 85, label: '8 PM', crimeType: 'Harassment' },
      { hour: 21, risk: 90, label: '9 PM', crimeType: 'Theft' },
      { hour: 22, risk: 82, label: '10 PM', crimeType: 'Fight' },
      { hour: 23, risk: 70, label: '11 PM', crimeType: 'Fight' },
      { hour: 0, risk: 55, label: '12 AM', crimeType: 'Robbery' },
      { hour: 1, risk: 40, label: '1 AM', crimeType: 'Vandalism' },
    ],
  },
  {
    city: 'Chennai',
    aliases: ['chennai', 'madras', 'che'],
    hotspots: [
      {
        id: 'che-1',
        name: 'Central Railway Station',
        lat: 13.0827,
        lng: 80.2707,
        risk: 82,
        crimes: ['Theft', 'Harassment', 'Robbery'],
        peakHours: '6PM - 11PM',
        description: 'Major transit hub with high footfall. Frequent pickpocketing and harassment cases.',
      },
      {
        id: 'che-2',
        name: 'T. Nagar',
        lat: 13.0339,
        lng: 80.2340,
        risk: 75,
        crimes: ['Theft', 'Robbery'],
        peakHours: '5PM - 10PM',
        description: 'Shopping district with high density crowds. Chain snatching incidents common.',
      },
      {
        id: 'che-3',
        name: 'Marina Beach',
        lat: 13.0500,
        lng: 80.2824,
        risk: 60,
        crimes: ['Harassment', 'Fight'],
        peakHours: '7PM - 11PM',
        description: 'Popular beach area. Evening harassment cases reported frequently.',
      },
      {
        id: 'che-4',
        name: 'Koyambedu',
        lat: 13.0694,
        lng: 80.1948,
        risk: 70,
        crimes: ['Theft', 'Fight'],
        peakHours: '4AM - 8AM',
        description: 'Major bus terminus and market. Early morning theft incidents.',
      },
    ],
    timeRisk: [
      { hour: 18, risk: 60, label: '6 PM', crimeType: 'Theft' },
      { hour: 19, risk: 75, label: '7 PM', crimeType: 'Harassment' },
      { hour: 20, risk: 82, label: '8 PM', crimeType: 'Theft' },
      { hour: 21, risk: 88, label: '9 PM', crimeType: 'Robbery' },
      { hour: 22, risk: 80, label: '10 PM', crimeType: 'Fight' },
      { hour: 23, risk: 65, label: '11 PM', crimeType: 'Fight' },
      { hour: 0, risk: 50, label: '12 AM', crimeType: 'Vandalism' },
      { hour: 1, risk: 35, label: '1 AM', crimeType: 'Vandalism' },
    ],
  },
  {
    city: 'Madurai',
    aliases: ['madurai', 'mdu'],
    hotspots: [
      {
        id: 'mdu-1',
        name: 'Periyar Bus Stand',
        lat: 9.9252,
        lng: 78.1198,
        risk: 80,
        crimes: ['Theft', 'Harassment'],
        peakHours: '5PM - 10PM',
        description: 'Central bus terminus with heavy passenger traffic.',
      },
      {
        id: 'mdu-2',
        name: 'Meenakshi Temple Area',
        lat: 9.9195,
        lng: 78.1193,
        risk: 55,
        crimes: ['Theft'],
        peakHours: '4PM - 8PM',
        description: 'Tourist area with pickpocketing incidents during peak hours.',
      },
      {
        id: 'mdu-3',
        name: 'Anna Bus Stand',
        lat: 9.9390,
        lng: 78.1290,
        risk: 72,
        crimes: ['Fight', 'Robbery'],
        peakHours: '9PM - 1AM',
        description: 'Late night incidents common in surrounding areas.',
      },
    ],
    timeRisk: [
      { hour: 17, risk: 55, label: '5 PM', crimeType: 'Theft' },
      { hour: 18, risk: 68, label: '6 PM', crimeType: 'Theft' },
      { hour: 19, risk: 80, label: '7 PM', crimeType: 'Harassment' },
      { hour: 20, risk: 85, label: '8 PM', crimeType: 'Theft' },
      { hour: 21, risk: 78, label: '9 PM', crimeType: 'Fight' },
      { hour: 22, risk: 65, label: '10 PM', crimeType: 'Fight' },
      { hour: 23, risk: 50, label: '11 PM', crimeType: 'Robbery' },
    ],
  },
];

export const searchCity = (query: string): CityData | null => {
  const normalizedQuery = query.toLowerCase().trim();
  return crimeDatabase.find(
    city => city.aliases.some(alias => alias.includes(normalizedQuery))
  ) || null;
};

export const getAllCities = (): string[] => {
  return crimeDatabase.map(city => city.city);
};

export const getPatrolRecommendations = (hotspots: CrimeHotspot[]) => {
  return hotspots
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 4)
    .map((hotspot, index) => ({
      ...hotspot,
      priority: index === 0 ? 'CRITICAL' : index === 1 ? 'HIGH' : index === 2 ? 'MEDIUM' : 'LOW',
      suggestedPatrols: Math.ceil(hotspot.risk / 25),
    }));
};
