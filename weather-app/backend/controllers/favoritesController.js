const { pool } = require('../config/database');

// Получение избранных городов пользователя
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favorites = await pool.query(
      'SELECT * FROM favorite_cities WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(favorites.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения избранных городов' });
  }
};

// Добавление города в избранное
const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { city_name, country, lat, lon } = req.body;

    // Проверка, не добавлен ли уже город
    const existingCity = await pool.query(
      'SELECT * FROM favorite_cities WHERE user_id = $1 AND city_name = $2',
      [userId, city_name]
    );

    if (existingCity.rows.length > 0) {
      return res.status(400).json({ message: 'Город уже добавлен в избранное' });
    }

    const newFavorite = await pool.query(
      'INSERT INTO favorite_cities (user_id, city_name, country, lat, lon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, city_name, country, lat, lon]
    );

    res.status(201).json({
      message: 'Город добавлен в избранное',
      favorite: newFavorite.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка добавления города в избранное' });
  }
};

// Удаление города из избранного
const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cityId } = req.params;

    const result = await pool.query(
      'DELETE FROM favorite_cities WHERE id = $1 AND user_id = $2 RETURNING *',
      [cityId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Город не найден в избранном' });
    }

    res.json({ message: 'Город удален из избранного' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка удаления города из избранного' });
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites
};