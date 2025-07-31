# Weather App 🌤️

Полнофункциональное приложение для отслеживания погоды с возможностью регистрации пользователей, поиска городов и сохранения избранных локаций.

## 🚀 Функциональность

- **Регистрация и авторизация** пользователей
- **Поиск городов** по всему миру
- **Просмотр текущей погоды** и детальной информации
- **Сохранение избранных городов**
- **Получение погоды по геолокации**
- **Адаптивный дизайн** для мобильных устройств

## 🛠️ Технологии

### Backend
- **Node.js** + Express.js
- **PostgreSQL** - база данных
- **JWT** - аутентификация
- **bcryptjs** - хеширование паролей
- **OpenWeatherMap API** - данные о погоде

### Frontend
- **React 18** + TypeScript
- **React Router** - маршрутизация
- **Tailwind CSS** - стилизация
- **Axios** - HTTP клиент

## 📦 Установка и запуск

### Предварительные требования

1. **Node.js** (версия 16 или выше)
2. **PostgreSQL** (версия 12 или выше)
3. **API ключ OpenWeatherMap** (бесплатный на [openweathermap.org](https://openweathermap.org/api))

### 1. Клонирование репозитория

```bash
git clone <your-repo-url>
cd weather-app
```

### 2. Настройка базы данных

Создайте базу данных PostgreSQL:

```sql
CREATE DATABASE weather_app;
CREATE USER weather_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE weather_app TO weather_user;
```

### 3. Настройка Backend

```bash
cd backend

# Установка зависимостей
npm install

# Копирование файла переменных окружения
cp ../.env.example .env

# Отредактируйте .env файл со своими значениями:
# - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# - JWT_SECRET (длинная случайная строка)
# - WEATHER_API_KEY (ваш ключ от OpenWeatherMap)
```

Пример `.env` файла:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=weather_app
DB_USER=weather_user
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_123456789
WEATHER_API_KEY=your_openweather_api_key
```

Запуск backend:
```bash
# Разработка
npm run dev

# Продакшен
npm start
```

### 4. Настройка Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Создание файла переменных окружения
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Запуск в режиме разработки
npm start
```

## 🌐 Получение API ключа OpenWeatherMap

1. Перейдите на [openweathermap.org](https://openweathermap.org/api)
2. Зарегистрируйтесь бесплатно
3. Подтвердите email
4. Найдите ваш API ключ в разделе "API keys"
5. Вставьте ключ в файл `.env` как `WEATHER_API_KEY`

**Примечание:** Активация нового API ключа может занять несколько часов.

## 📚 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему

### Погода
- `GET /api/weather/current/:city` - Текущая погода в городе
- `GET /api/weather/forecast/:city` - Прогноз на 5 дней
- `GET /api/weather/search/:query` - Поиск городов
- `GET /api/weather/coords/:lat/:lon` - Погода по координатам

### Избранные города (требует авторизации)
- `GET /api/favorites` - Получить избранные города
- `POST /api/favorites` - Добавить город в избранное
- `DELETE /api/favorites/:cityId` - Удалить город из избранного

## 🗄️ Структура базы данных

### Таблица `users`
- `id` - уникальный идентификатор
- `username` - имя пользователя
- `email` - email (уникальный)
- `password` - хешированный пароль
- `created_at` - дата создания

### Таблица `favorite_cities`
- `id` - уникальный идентификатор
- `user_id` - ссылка на пользователя
- `city_name` - название города
- `country` - страна
- `lat`, `lon` - координаты
- `created_at` - дата добавления

## 🎨 Особенности дизайна

- **Стеклянный эффект (Glass morphism)** для современного вида
- **Градиентные фоны** с погодной тематикой
- **Адаптивная верстка** для всех устройств
- **Анимации загрузки** для лучшего UX
- **Интуитивная навигация**

## 🔧 Разработка

### Структура проекта
```
weather-app/
├── backend/              # Server-side код
│   ├── config/          # Конфигурация БД
│   ├── controllers/     # Контроллеры API
│   ├── middleware/      # Middleware функции
│   ├── routes/          # API маршруты
│   └── server.js        # Точка входа
├── frontend/            # Client-side код
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── contexts/    # React контексты
│   │   ├── pages/       # Страницы приложения
│   │   ├── services/    # API сервисы
│   │   └── types/       # TypeScript типы
│   └── public/          # Статичные файлы
└── README.md
```

### Запуск в режиме разработки

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend  
npm start
```

## 🚀 Деплой

### Backend
1. Настройте переменные окружения на сервере
2. Создайте базу данных PostgreSQL
3. Запустите `npm start`

### Frontend
1. Создайте production build: `npm run build`
2. Разместите файлы из папки `build` на веб-сервере
3. Настройте переменную `REACT_APP_API_URL` на URL вашего API

## 🤝 Вклад в развитие

1. Сделайте Fork репозитория
2. Создайте ветку для новой функции
3. Внесите изменения и сделайте commit
4. Отправьте Pull Request

## 📝 Лицензия

Этот проект создан в образовательных целях. Свободно используйте код для обучения и персональных проектов.

## 🆘 Помощь и поддержка

Если у вас возникли проблемы:

1. Проверьте правильность всех переменных окружения
2. Убедитесь, что PostgreSQL запущен и доступен
3. Проверьте валидность API ключа OpenWeatherMap
4. Убедитесь, что порты 3000 и 5000 свободны

---

**Создано с ❤️ для изучения Full Stack разработки**