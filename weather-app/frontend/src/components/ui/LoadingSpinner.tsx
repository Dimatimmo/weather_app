import React from 'react';
import { LoadingSpinnerProps } from '../../types';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4'
  };

  const spinnerClass = `${sizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin ${className}`;

  return (
    <div className="flex justify-center items-center">
      <div className={spinnerClass}></div>
    </div>
  );
};

// Компонент полноэкранной загрузки
export const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 animate-pulse">Загрузка...</p>
      </div>
    </div>
  );
};

// Компонент загрузки для карточек
export const CardLoader: React.FC = () => {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-12 w-12 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;