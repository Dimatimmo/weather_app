const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Создание таблиц при первом запуске
const createTables = async () => {
  try {
    // Таблица пользователей
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица избранных городов
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorite_cities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        city_name VARCHAR(100) NOT NULL,
        country VARCHAR(50),
        lat DECIMAL(10, 8),
        lon DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, city_name)
      )
    `);

    console.log("Таблицы созданы успешно");
  } catch (error) {
    console.error("Ошибка создания таблиц:", error);
  }
};

module.exports = { pool, createTables };
