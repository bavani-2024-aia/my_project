import { useState } from 'react';
import { searchCity, CityData, CrimeHotspot, CrimeType } from '@/data/crimeData';
import SearchBar from './SearchBar';
import CrimeMap from './CrimeMap';
import TimeRiskChart from './TimeRiskChart';
import SimulationPanel from './SimulationPanel';
import PatrolRecommendations from './PatrolRecommendations';
import HotspotList from './HotspotList';
import StatsOverview from './StatsOverview';
import XAIExplanationPanel from './XAIExplanationPanel';
import ShiftAlertPanel from './ShiftAlertPanel';
import SuggestedActionsPanel from './SuggestedActionsPanel';
import HumanOverridePanel from './HumanOverridePanel';
import DataImportPanel from './DataImportPanel';
import { MapPin, Radar } from 'lucide-react';

const Dashboard = () => {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<CrimeHotspot | null>(null);
  const [filterCrime, setFilterCrime] = useState<CrimeType | 'All'>('All');
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchError(null);
    setSelectedHotspot(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = searchCity(query);
    
    if (result) {
      setCityData(result);
    } else {
      setSearchError(`No data found for "${query}". Try: Coimbatore, Chennai, or Madurai`);
      setCityData(null);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Search Section */}
      <div className="p-6 border-b border-border bg-card/30">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {searchError && (
          <div className="max-w-2xl mx-auto mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
            <p className="text-sm text-destructive">{searchError}</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      {cityData ? (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* City Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{cityData.city}</h1>
              <p className="text-sm text-muted-foreground">Crime Hotspot Analysis</p>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsOverview 
            cityName={cityData.city}
            hotspots={cityData.hotspots}
            timeRisk={cityData.timeRisk}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Map Section - Takes 2 columns */}
            <div className="xl:col-span-2 h-[500px] bg-card rounded-xl border border-border overflow-hidden">
              <CrimeMap
                hotspots={cityData.hotspots}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={setSelectedHotspot}
                filterCrime={filterCrime}
                onFilterChange={setFilterCrime}
              />
            </div>

            {/* Time Risk Chart */}
            <div className="h-[500px]">
              <TimeRiskChart timeRisk={cityData.timeRisk} />
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Hotspot List */}
            <div>
              <HotspotList
                hotspots={cityData.hotspots}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={setSelectedHotspot}
              />
            </div>

            {/* Simulation Panel */}
            <div className="h-[450px]">
              <SimulationPanel selectedHotspot={selectedHotspot} />
            </div>

            {/* Patrol Recommendations */}
            <div className="lg:col-span-2 xl:col-span-1">
              <PatrolRecommendations hotspots={cityData.hotspots} />
            </div>
          </div>

          {/* XAI Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* XAI Explanation Panel */}
            <div>
              <XAIExplanationPanel hotspot={selectedHotspot} />
            </div>

            {/* Suggested Actions */}
            <div>
              <SuggestedActionsPanel hotspot={selectedHotspot} />
            </div>

            {/* Human Override Learning */}
            <div>
              <HumanOverridePanel hotspot={selectedHotspot} />
            </div>
          </div>

          {/* Shift & Import Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shift Alerts */}
            <div>
              <ShiftAlertPanel hotspots={cityData.hotspots} />
            </div>

            {/* Data Import */}
            <div>
              <DataImportPanel />
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <div className="relative mb-8">
            <Radar className="h-24 w-24 text-primary/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 animate-ping" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Crime Hotspot Prediction System</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Enter a city name above to analyze crime hotspots, view risk patterns, 
            and get AI-powered patrol recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['Coimbatore', 'Chennai', 'Madurai'].map((city) => (
              <button
                key={city}
                onClick={() => handleSearch(city)}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
              >
                Explore {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
