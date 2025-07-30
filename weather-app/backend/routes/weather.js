const express = require('express');
const {
  getCurrentWeather,
  getForecast,
  searchCities,
  getWeatherByCoords
} = require('../controllers/weatherController');

const router = express.Router();

// GET /api/weather/current/:city
router.get('/current/:city', getCurrentWeather);

// GET /api/weather/forecast/:city
router.get('/forecast/:city', getForecast);

// GET /api/weather/search/:query
router.get('/search/:query', searchCities);

// GET /api/weather/coords/:lat/:lon
router.get('/coords/:lat/:lon', getWeatherByCoords);

module.exports = router;