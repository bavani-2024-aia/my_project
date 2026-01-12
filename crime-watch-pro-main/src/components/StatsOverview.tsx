import { CrimeHotspot, TimeRisk } from '@/data/crimeData';
import { MapPin, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  cityName: string;
  hotspots: CrimeHotspot[];
  timeRisk: TimeRisk[];
}

const StatsOverview = ({ cityName, hotspots, timeRisk }: StatsOverviewProps) => {
  const totalHotspots = hotspots.length;
  const criticalHotspots = hotspots.filter(h => h.risk >= 80).length;
  const avgRisk = Math.round(hotspots.reduce((a, b) => a + b.risk, 0) / hotspots.length);
  const peakHour = timeRisk.reduce((a, b) => a.risk > b.risk ? a : b);

  const stats = [
    {
      label: 'Hotspot Zones',
      value: totalHotspots,
      subtext: `in ${cityName}`,
      icon: MapPin,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Critical Areas',
      value: criticalHotspots,
      subtext: 'Risk > 80',
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Avg Risk Score',
      value: avgRisk,
      subtext: 'Across all zones',
      icon: TrendingUp,
      color: avgRisk >= 60 ? 'text-orange-400' : 'text-amber-400',
      bg: avgRisk >= 60 ? 'bg-orange-500/10' : 'bg-amber-500/10',
    },
    {
      label: 'Peak Risk Time',
      value: peakHour.label,
      subtext: `${peakHour.risk}% risk`,
      icon: Clock,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card p-4 bg-card rounded-xl border border-border animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          <div className="text-sm font-medium mt-1">{stat.label}</div>
          <div className="text-xs text-muted-foreground">{stat.subtext}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
