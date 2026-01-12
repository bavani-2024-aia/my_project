import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { getAllCities } from '@/data/crimeData';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const cities = getAllCities();

  useEffect(() => {
    if (query.length > 0) {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setQuery(city);
    onSearch(city);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            relative flex items-center gap-3 px-5 py-4 
            bg-card border-2 rounded-xl transition-all duration-300
            ${isFocused 
              ? 'border-primary shadow-lg shadow-primary/10' 
              : 'border-border hover:border-muted-foreground/30'
            }
          `}
        >
          <Search className={`h-5 w-5 transition-colors ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search location (e.g., Coimbatore, Chennai, cbe...)"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 hover:bg-secondary rounded-md transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="
              px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg
              hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center gap-2
            "
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-card border border-border rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden">
          {suggestions.map((city) => (
            <button
              key={city}
              onClick={() => handleSuggestionClick(city)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-secondary transition-colors text-left"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{city}</span>
              <span className="text-xs text-muted-foreground ml-auto">Tamil Nadu</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick Tags */}
      <div className="flex flex-wrap items-center gap-2 mt-3 justify-center">
        <span className="text-xs text-muted-foreground">Quick search:</span>
        {['Coimbatore', 'Chennai', 'Madurai'].map((city) => (
          <button
            key={city}
            onClick={() => handleSuggestionClick(city)}
            className="px-3 py-1 text-xs font-medium bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
