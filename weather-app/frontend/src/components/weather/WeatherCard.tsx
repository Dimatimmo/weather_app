import React, { useState } from 'react';
import { CurrentWeather, WeatherCardProps } from '../../types';
import { weatherService } from '../../services/weatherService';
import Button from '../ui/Button';

const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  onAddToFavorites,
  showAddToFavorites = false,
  className = ""
}) => {
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const handleAddToFavorites = async () => {
    if (!onAddToFavorites) return;

    setIsAddingToFavorites(true);
    try {
      await onAddToFavorites({
        city_name: weather.name,
        country: weather.sys.country,
        lat: weather.coord.lat,
        lon: weather.coord.lon
      });
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return weatherService.utils.getWeatherIconUrl(iconCode);
  };

  const formatTemperature = (temp: number) => {
    return weatherService.utils.formatTemperature(temp);
  };

  const formatTime = (timestamp: number) => {
    return weatherService.utils.formatTime(timestamp);
  };

  const getWindDirection = (degrees: number) => {
    return weatherService.utils.getWindDirection(degrees);
  };

  const getWeatherGradient = (weatherMain: string) => {
    const gradients: { [key: string]: string } = {
      'Clear': 'from-yellow-400 to-orange-500',
      'Clouds': 'from-gray-400 to-gray-600',
      'Rain': 'from-blue-400 to-blue-600',
      'Drizzle': 'from-blue-300 to-blue-500',
      'Thunderstorm': 'from-gray-700 to-gray-900',
      'Snow': 'from-blue-100 to-blue-300',
      'Mist': 'from-gray-300 to-gray-500',
      'Fog': 'from-gray-300 to-gray-500'
    };
    
    return gradients[weatherMain] || 'from-blue-400 to-blue-600';
  };

  return (
    <div className={`weather-card relative overflow-hidden ${className}`}>
      {/* Фоновый градиент */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getWeatherGradient(weather.weather[0].main)} opacity-5`}></div>
      
      {/* Основной контент */}
      <div className="relative z-10">
        {/* Заголовок */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {weather.name}
            </h2>
            <p className="text-gray-600 text-sm">
              {weather.sys.country} • {formatTime(Date.now() / 1000)}
            </p>
          </div>
          
          {showAddToFavorites && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddToFavorites}
              loading={isAddingToFavorites}
              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </Button>
          )}
        </div>

        {/* Основная информация о погоде */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={getWeatherIcon(weather.weather[0].icon)}
              alt={weather.weather[0].description}
              className="w-16 h-16"
            />
            <div>
              <div className="text-4xl font-bold text-gray-800">
                {formatTemperature(weather.main.temp)}
              </div>
              <div className="text-gray-600 capitalize">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Ощущается как</div>
            <div className="text-lg font-semibold text-gray-700">
              {formatTemperature(weather.main.feels_like)}
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Влажность
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {weather.main.humidity}%
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Давление
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {weather.main.pressure} гПа
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Ветер
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {weather.wind.speed} м/с
            </div>
            <div className="text-xs text-gray-500">
              {getWindDirection(weather.wind.deg)}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Видимость
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {Math.round(weather.visibility / 1000)} км
            </div>
          </div>
        </div>

        {/* Восход и закат */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="text-xs text-gray-500">Восход</div>
              <div className="text-sm font-medium">{formatTime(weather.sys.sunrise)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="text-xs text-gray-500">Закат</div>
              <div className="text-sm font-medium">{formatTime(weather.sys.sunset)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;