import api from "./api";
import { User, LoginData, RegisterData, AuthResponse } from "../types";

export const authService = {
  // Регистрация пользователя
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Ошибка регистрации";
      throw new Error(message);
    }
  },

  // Авторизация пользователя
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Ошибка входа";
      throw new Error(message);
    }
  },

  // Выход из системы
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Получение текущего пользователя
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Ошибка парсинга данных пользователя:", error);
      return null;
    }
  },

  // Проверка авторизации
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Проверяем, не истек ли токен (базовая проверка)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Ошибка проверки токена:", error);
      this.logout();
      return false;
    }
  },

  // Получение токена
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  // Обновление данных пользователя в localStorage
  updateUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  },
};
