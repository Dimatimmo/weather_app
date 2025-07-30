import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import { CitySearchResult, CurrentWeather, FavoriteCityData } from '../../types';
import { weatherService } from '../../services/weatherService';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import SearchBar from '../weather/SearchBar';
import WeatherCard from '../weather/WeatherCard';


const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  // Получение погоды по текущему местоположению
  const getCurrentLocationWeather = async () => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером');
      return;
    }

    setLocationLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await weatherService.getWeatherByCoords(latitude, longitude);
          setWeather(weatherData);
        } catch (err) {
          setError('Ошибка получения погоды по вашему местоположению');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setError('Не удалось получить ваше местоположение');
        setLocationLoading(false);
      }
    );
  };

  // Обработка выбора города из поиска
  const handleCitySelect = async (city: CitySearchResult) => {
    setLoading(true);
    setError('');
    
    try {
      const weatherData = await weatherService.getCurrentWeather(city.name);
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка получения погоды');
    } finally {
      setLoading(false);
    }
  };

  // Добавление города в избранное
  const handleAddToFavorites = async (cityData: FavoriteCityData) => {
    if (!isAuthenticated) {
      setError('Войдите в систему, чтобы добавить город в избранное');
      return;
    }

    try {
      await weatherService.favorites.addToFavorites(cityData);
      // Можно добавить уведомление об успехе
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления в избранное');
    }
  };

  // Загрузка погоды по умолчанию (например, Киев)
  useEffect(() => {
    const loadDefaultWeather = async () => {
      try {
        const weatherData = await weatherService.getCurrentWeather('Киев');
        setWeather(weatherData);
      } catch (err) {
        console.error('Ошибка загрузки погоды по умолчанию:', err);
      }
    };

    if (!weather) {
      loadDefaultWeather();
    }
  }, [weather]);

  return (
    <div className="container-custom py-8">
      {/* Hero секция */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow-lg">
          Прогноз погоды
        </h1>
        <p className="text-xl text-blue-100 mb-8 text-shadow">
          Получайте актуальную информацию о погоде в любой точке мира
        </p>

        {/* Поиск */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onCitySelect={handleCitySelect}
            placeholder="Введите название города..."
            className="w-full"
          />
        </div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={getCurrentLocationWeather}
            loading={locationLoading}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Моё местоположение</span>
          </Button>

          {!isAuthenticated && (
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white border-white/20 hover:bg-white/10">
                  Войти
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">
                  Регистрация
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Ошибки */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Загрузка */}
      {loading && (
        <div className="flex justify-center mb-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Карточка погоды */}
      {weather && !loading && (
        <div className="max-w-4xl mx-auto">
          <WeatherCard
            weather={weather}
            onAddToFavorites={isAuthenticated ? handleAddToFavorites : undefined}
            showAddToFavorites={isAuthenticated}
          />
        </div>
      )}

      {/* Дополнительная информация для неавторизованных пользователей */}
      {!isAuthenticated && (
        <div className="max-w-4xl mx-auto mt-12">
          <div className="glass-effect rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Хотите больше возможностей?</h2>
            <p className="text-blue-100 mb-6">
              Зарегистрируйтесь, чтобы сохранять любимые города, просматривать расширенные прогнозы и получать персональные рекомендации.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Создать аккаунт
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10">
                  У меня уже есть аккаунт
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Информационные карточки */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="glass-effect rounded-xl p-6 text-center text-white">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Точные прогнозы</h3>
          <p className="text-blue-100">
            Получайте самую актуальную информацию о погоде из надежных источников
          </p>
        </div>

        <div className="glass-effect rounded-xl p-6 text-center text-white">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Избранные города</h3>
          <p className="text-blue-100">
            Сохраняйте любимые города для быстрого доступа к прогнозу погоды
          </p>
        </div>

        <div className="glass-effect rounded-xl p-6 text-center text-white">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Поиск городов</h3>
          <p className="text-blue-100">
            Найдите погоду в любом городе мира с помощью удобного поиска
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;