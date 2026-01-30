import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Przykładowa strona z różnym widokiem dla różnych ról
 */
const RoleBasedDashboard: React.FC = () => {
  const { user, hasRole, loading } = useAuth();

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Admin - pełny dostęp
  if (hasRole("Admin")) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Panel Administratora</h1>
        <p>Witaj, {user.email}</p>
        <p>Twoje role: {user.roles.join(", ")}</p>

        <div style={{ marginTop: "20px" }}>
          <h2>Dostępne funkcje:</h2>
          <ul>
            <li>Zarządzanie użytkownikami</li>
            <li>Zarządzanie pacjentami</li>
            <li>Zarządzanie lekarzami</li>
            <li>Zarządzanie wizytami</li>
            <li>Zarządzanie działami</li>
            <li>Zarządzanie zniżkami</li>
            <li>Ustawienia systemu</li>
          </ul>
        </div>
      </div>
    );
  }

  // Doctor - ograniczony dostęp
  if (hasRole("Doctor")) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Panel Lekarza</h1>
        <p>Witaj, {user.email}</p>
        <p>Twoje role: {user.roles.join(", ")}</p>

        <div style={{ marginTop: "20px" }}>
          <h2>Dostępne funkcje:</h2>
          <ul>
            <li>Przeglądanie wizyt</li>
            <li>Zarządzanie harmonogramem</li>
            <li>Dostęp do danych pacjentów</li>
          </ul>
        </div>
      </div>
    );
  }

  // User - podstawowy dostęp
  if (hasRole("User")) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Panel Użytkownika</h1>
        <p>Witaj, {user.email}</p>
        <p>Twoje role: {user.roles.join(", ")}</p>

        <div style={{ marginTop: "20px" }}>
          <h2>Dostępne funkcje:</h2>
          <ul>
            <li>Przeglądanie profilu</li>
            <li>Umówienie wizyty</li>
            <li>Historia wizyt</li>
          </ul>
        </div>
      </div>
    );
  }

  // Brak rozpoznanej roli
  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel Użytkownika</h1>
      <p>Witaj, {user.email}</p>
      <p>Brak przypisanych ról.</p>
    </div>
  );
};

export default RoleBasedDashboard;
