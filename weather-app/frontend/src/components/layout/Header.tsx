import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContexts';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="glass-effect text-white shadow-lg sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Логотип */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" 
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-shadow">WeatherApp</span>
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="hover:text-blue-200 transition-colors text-shadow"
            >
              Главная
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="hover:text-blue-200 transition-colors text-shadow"
              >
                Панель управления
              </Link>
            )}
          </nav>

          {/* Пользовательское меню */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <span className="text-sm text-blue-100">
                    Привет, <span className="font-semibold">{user?.username}</span>
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="text-white border-white/20 hover:bg-white/10">
                      Профиль
                    </Button>
                  </Link>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    Выйти
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white border-white/20 hover:bg-white/10">
                    Войти
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" size="sm">
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Мобильное меню (упрощенное) */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;