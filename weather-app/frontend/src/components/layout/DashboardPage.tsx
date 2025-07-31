import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContexts';
import { weatherService } from '../../services/weatherService';
import { CurrentWeather, FavoriteCity, CitySearchResult, FavoriteCityData } from '../../types';
import Button from '../ui/Button';
import { CardLoader } from '../ui/LoadingSpinner';
import SearchBar from '../weather/SearchBar';
import WeatherCard from '../weather/WeatherCard';
import FavoritesList from './FavoritesList';


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Загрузка избранных городов
  const loadFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const favoriteCities = await weatherService.favorites.getFavorites();
      setFavorites(favoriteCities);
    } catch (err) {
      console.error('Ошибка загрузки избранных городов:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Обработка выбора города из поиска
  const handleCitySelect = async (city: CitySearchResult) => {
    setLoading(true);
    setError('');
    
    try {
      const weatherData = await weatherService.getCurrentWeather(city.name);
      setCurrentWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка получения погоды');
    } finally {
      setLoading(false);
    }
  };

  // Обработка клика по избранному городу
  const handleFavoriteCityClick = async (city: FavoriteCity) => {
    setLoading(true);
    setError('');
    
    try {
      const weatherData = await weatherService.getCurrentWeather(city.city_name);
      setCurrentWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка получения погоды');
    } finally {
      setLoading(false);
    }
  };

  // Добавление города в избранное
  const handleAddToFavorites = async (cityData: FavoriteCityData) => {
    try {
      await weatherService.favorites.addToFavorites(cityData);
      await loadFavorites(); // Перезагружаем список избранных
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления в избранное');
    }
  };

  // Удаление города из избранного
  const handleRemoveFromFavorites = async (cityId: number) => {
    try {
      await weatherService.favorites.removeFromFavorites(cityId);
      await loadFavorites(); // Перезагружаем список избранных
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления из избранного');
    }
  };

  // Получение погоды по местоположению
  const getCurrentLocationWeather = async () => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await weatherService.getWeatherByCoords(latitude, longitude);
          setCurrentWeather(weatherData);
        } catch (err) {
          setError('Ошибка получения погоды по вашему местоположению');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError('Не удалось получить ваше местоположение');
        setLoading(false);
      }
    );
  };

  return (
    <div className="container-custom py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-shadow">
          Добро пожаловать, {user?.username}!
        </h1>
        <p className="text-blue-100 text-shadow">
          Управляйте своими избранными городами и отслеживайте погоду
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Левая колонка - Поиск и текущая погода */}
        <div className="lg:col-span-2 space-y-6">
          {/* Поиск */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Поиск города
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  onCitySelect={handleCitySelect}
                  placeholder="Введите название города..."
                />
              </div>
              <Button
                onClick={getCurrentLocationWeather}
                loading={loading}
                variant="secondary"
                className="flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Моя геопозиция</span>
              </Button>
            </div>
          </div>

          {/* Ошибки */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Текущая погода */}
          {loading && (
            <CardLoader />
          )}

          {currentWeather && !loading && (
            <WeatherCard
              weather={currentWeather}
              onAddToFavorites={handleAddToFavorites}
              showAddToFavorites={true}
            />
          )}

          {/* Приглашение к поиску */}
          {!currentWeather && !loading && (
            <div className="glass-effect rounded-xl p-12 text-center text-white">
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Найдите город</h3>
              <p className="text-blue-100">
                Используйте поиск выше или нажмите на один из ваших избранных городов
              </p>
            </div>
          )}
        </div>

        {/* Правая колонка - Избранные города */}
        <div className="space-y-6">
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Избранные города
            </h2>
            
            <FavoritesList
              favorites={favorites}
              onRemove={handleRemoveFromFavorites}
              onCityClick={handleFavoriteCityClick}
              loading={favoritesLoading}
            />
          </div>

          {/* Статистика */}
          <div className="glass-effect rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Статистика</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Избранных городов:</span>
                <span className="font-semibold">{favorites.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Аккаунт создан:</span>
                <span className="font-semibold">
                  {new Date().toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;