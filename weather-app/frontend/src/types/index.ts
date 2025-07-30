// Пользователь
export interface User {
  id: number;
  username: string;
  email: string;
}

// Регистрация
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Авторизация
export interface LoginData {
  email: string;
  password: string;
}

// Ответ авторизации
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Город для поиска
export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Избранный город
export interface FavoriteCity {
  id: number;
  user_id: number;
  city_name: string;
  country: string;
  lat: number;
  lon: number;
  created_at: string;
}

// Данные для добавления в избранное
export interface FavoriteCityData {
  city_name: string;
  country: string;
  lat: number;
  lon: number;
}

// Текущая погода
export interface CurrentWeather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Элемент прогноза
export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    "3h": number;
  };
  snow?: {
    "3h": number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

// Прогноз погоды
export interface WeatherForecast {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Контекст авторизации
export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginData) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// Состояние API запроса
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Ошибка API
export interface ApiError {
  message: string;
  status?: number;
}

// Пропсы компонентов
export interface WeatherCardProps {
  weather: CurrentWeather;
  onAddToFavorites?: (cityData: FavoriteCityData) => void;
  showAddToFavorites?: boolean;
  className?: string;
}

export interface SearchBarProps {
  onCitySelect: (city: CitySearchResult) => void;
  placeholder?: string;
  className?: string;
}

export interface FavoritesListProps {
  favorites: FavoriteCity[];
  onRemove: (cityId: number) => void;
  onCityClick: (city: FavoriteCity) => void;
  loading?: boolean;
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
