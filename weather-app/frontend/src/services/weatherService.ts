import api from "./api";
import {
  CurrentWeather,
  WeatherForecast,
  CitySearchResult,
  FavoriteCity,
  FavoriteCityData,
} from "../types";

export const weatherService = {
  // Получение текущей погоды
  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    try {
      const response = await api.get<CurrentWeather>(
        `/weather/current/${encodeURIComponent(city)}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Ошибка получения погоды";
      throw new Error(message);
    }
  },

  // Получение прогноза погоды
  async getForecast(city: string): Promise<WeatherForecast> {
    try {
      const response = await api.get<WeatherForecast>(
        `/weather/forecast/${encodeURIComponent(city)}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Ошибка получения прогноза";
      throw new Error(message);
    }
  },

  // Поиск городов
  async searchCities(query: string): Promise<CitySearchResult[]> {
    try {
      const response = await api.get<CitySearchResult[]>(
        `/weather/search/${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Ошибка поиска городов";
      throw new Error(message);
    }
  },

  // Получение погоды по координатам
  async getWeatherByCoords(lat: number, lon: number): Promise<CurrentWeather> {
    try {
      const response = await api.get<CurrentWeather>(
        `/weather/coords/${lat}/${lon}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Ошибка получения погоды по координатам";
      throw new Error(message);
    }
  },

  // Управление избранными городами
  favorites: {
    // Получение избранных городов
    async getFavorites(): Promise<FavoriteCity[]> {
      try {
        const response = await api.get<FavoriteCity[]>("/favorites");
        return response.data;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Ошибка получения избранных городов";
        throw new Error(message);
      }
    },

    // Добавление в избранное
    async addToFavorites(
      cityData: FavoriteCityData
    ): Promise<{ message: string; favorite: FavoriteCity }> {
      try {
        const response = await api.post<{
          message: string;
          favorite: FavoriteCity;
        }>("/favorites", cityData);
        return response.data;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Ошибка добавления в избранное";
        throw new Error(message);
      }
    },

    // Удаление из избранного
    async removeFromFavorites(cityId: number): Promise<{ message: string }> {
      try {
        const response = await api.delete<{ message: string }>(
          `/favorites/${cityId}`
        );
        return response.data;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Ошибка удаления из избранного";
        throw new Error(message);
      }
    },
  },

  // Утилитарные функции
  utils: {
    // Получение иконки погоды
    getWeatherIconUrl(iconCode: string): string {
      return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    },

    // Форматирование температуры
    formatTemperature(temp: number): string {
      return `${Math.round(temp)}°C`;
    },

    // Определение описания погоды на русском
    getWeatherDescription(weatherMain: string): string {
      const descriptions: { [key: string]: string } = {
        Clear: "Ясно",
        Clouds: "Облачно",
        Rain: "Дождь",
        Drizzle: "Морось",
        Thunderstorm: "Гроза",
        Snow: "Снег",
        Mist: "Туман",
        Smoke: "Смог",
        Haze: "Дымка",
        Dust: "Пыль",
        Fog: "Туман",
        Sand: "Песок",
        Ash: "Пепел",
        Squall: "Шквал",
        Tornado: "Торнадо",
      };

      return descriptions[weatherMain] || weatherMain;
    },

    // Форматирование даты и времени
    formatDateTime(timestamp: number): string {
      return new Date(timestamp * 1000).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    // Форматирование только времени
    formatTime(timestamp: number): string {
      return new Date(timestamp * 1000).toLocaleString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    // Получение направления ветра
    getWindDirection(degrees: number): string {
      const directions = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
      const index = Math.round(degrees / 45) % 8;
      return directions[index];
    },
  },
};
