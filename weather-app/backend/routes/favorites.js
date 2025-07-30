const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites
} = require('../controllers/favoritesController');

const router = express.Router();

// Все маршруты требуют авторизации
router.use(authMiddleware);

// GET /api/favorites
router.get('/', getFavorites);

// POST /api/favorites
router.post('/', addToFavorites);

// DELETE /api/favorites/:cityId
router.delete('/:cityId', removeFromFavorites);

module.exports = router;