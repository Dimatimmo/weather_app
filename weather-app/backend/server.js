const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createTables } = require("./config/database");
const authRoutes = require("./routes/auth");
const weatherRoutes = require("./routes/weather");
const favoritesRoutes = require("./routes/favorites");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/favorites", favoritesRoutes);

// Базовый маршрут
app.get("/", (req, res) => {
  res.json({ message: "Weather API Server запущен!" });
});

// Инициализация БД и запуск сервера
const startServer = async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
  }
};

startServer();
