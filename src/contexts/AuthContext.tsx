import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCurrentUser } from "../api/services/user.service";
import type { UserInfo } from "../api/services/user.service";
import { initAuth, setAuthToken } from "../api/auth";
import axiosClient from "../api/axiosClient";

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setUser(null);
        return;
      }

      // Ustawienie tokena w axios
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Błąd podczas pobierania danych użytkownika:", error);
      setUser(null);
      localStorage.removeItem("auth_token");
      delete axiosClient.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
    fetchUser();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("auth_token", token);
    setAuthToken(token, true);
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    delete axiosClient.defaults.headers.common["Authorization"];
    setUser(null);

    try {
      window.dispatchEvent(
        new CustomEvent("authChanged", { detail: { token: null, user: null } })
      );
    } catch {}
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles) return false;

    if (Array.isArray(role)) {
      return role.some((r) => user.roles.includes(r));
    }

    return user.roles.includes(role);
  };

  const refetchUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    hasRole,
    login,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
