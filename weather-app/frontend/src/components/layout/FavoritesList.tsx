import React from "react";
import { FavoriteCity, FavoritesListProps } from "../../types";
import LoadingSpinner from "../ui/LoadingSpinner";

const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  onRemove,
  onCityClick,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <p className="text-blue-100 mb-2">Нет избранных городов</p>
        <p className="text-blue-200 text-sm">
          Найдите город и добавьте его в избранное
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {favorites.map((city) => (
        <FavoriteCityCard
          key={city.id}
          city={city}
          onRemove={onRemove}
          onCityClick={onCityClick}
        />
      ))}
    </div>
  );
};

// Компонент карточки избранного города
interface FavoriteCityCardProps {
  city: FavoriteCity;
  onRemove: (cityId: number) => void;
  onCityClick: (city: FavoriteCity) => void;
}

const FavoriteCityCard: React.FC<FavoriteCityCardProps> = ({
  city,
  onRemove,
  onCityClick,
}) => {
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    try {
      await onRemove(city.id);
    } catch (error) {
      console.error("Ошибка удаления города:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleClick = () => {
    onCityClick(city);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-all duration-200 group"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-white group-hover:text-blue-100 transition-colors">
              {city.city_name}
            </h3>
            <span className="text-blue-200 text-sm">{city.country}</span>
          </div>
          <p className="text-blue-100 text-xs mt-1">
            {city?.lat ? Number(city.lat).toFixed(2) : "N/A"},{" "}
            {city?.lon ? Number(city.lon).toFixed(2) : "N/A"}
          </p>
          <p className="text-blue-200 text-xs">
            Добавлен: {new Date(city.created_at).toLocaleDateString("ru-RU")}
          </p>
        </div>

        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
          title="Удалить из избранного"
        >
          {isRemoving ? (
            <LoadingSpinner size="sm" />
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default FavoritesList;
