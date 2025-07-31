import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import HomePage from "./components/layout/HomePage";
import LoginPage from "./components/layout/LoginPage";
import RegisterPage from "./components/layout/RegisterPage";
import { AuthProvider } from "./contexts/AuthContexts";
import DashboardPage from "./components/layout/DashboardPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-weather">
          <Header />
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
