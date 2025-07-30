const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Получение текущей погоды
const getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=ru`
    );

    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Город не найден' });
    }
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения данных о погоде' });
  }
};

// Получение прогноза на 5 дней
const getForecast = async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=ru`
    );

    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Город не найден' });
    }
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения прогноза погоды' });
  }
};

// Поиск городов
const searchCities = async (req, res) => {
  try {
    const { query } = req.params;
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.WEATHER_API_KEY}`
    );

    const cities = response.data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon
    }));

    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка поиска городов' });
  }
};

// Получение погоды по координатам
const getWeatherByCoords = async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=ru`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения данных о погоде' });
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  searchCities,
  getWeatherByCoords
};