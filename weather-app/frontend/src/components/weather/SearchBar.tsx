import React, { useState, useEffect, useCallback } from 'react';
import { weatherService } from '../../services/weatherService';
import { CitySearchResult, SearchBarProps } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';

const SearchBar: React.FC<SearchBarProps> = ({ 
  onCitySelect, 
  placeholder = "Поиск города...", 
  className = "" 
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Debounced search
  const debounceDelay = 500;
  
  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cities = await weatherService.searchCities(searchQuery);
      setResults(cities);
      setShowResults(true);
    } catch (err) {
      setError('Ошибка поиска городов');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, searchCities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleCitySelect = (city: CitySearchResult) => {
    onCitySelect(city);
    setQuery(`${city.name}, ${city.country}`);
    setShowResults(false);
    setResults([]);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Задержка чтобы клик по результату успел сработать
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Поле поиска */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="form-input pl-10 pr-10 w-full shadow-lg focus:shadow-xl"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {/* Результаты поиска */}
      {showResults && (results.length > 0 || error) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto z-50">
          {error ? (
            <div className="p-4 text-red-600 text-center">
              {error}
            </div>
          ) : (
            <div className="py-2">
              {results.map((city, index) => (
                <button
                  key={`${city.name}-${city.country}-${index}`}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {city.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {city.state && `${city.state}, `}{city.country}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Подсказка */}
      {query.length > 0 && query.length < 2 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-sm text-gray-500 z-50">
          Введите минимум 2 символа для поиска
        </div>
      )}
    </div>
  );
};

export default SearchBar;