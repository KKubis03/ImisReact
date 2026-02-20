import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
interface User {
  id: string | number;
  email: string;
  roles: string[];
  username: string;
  fullName: string;
  patientId?: number;
  doctorId?: number;
}
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  refreshUser: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType>(null!);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      const { accessToken } = response.data;
      if (!accessToken) throw new Error("No access token returned from server");
      localStorage.setItem("auth_token", accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setToken(accessToken);
      const userResponse = await api.get("/Users/me");
      const userData = userResponse.data;
      localStorage.setItem("auth_user", JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || error.message || "Login error";
      throw new Error(message);
    }
  };
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string) => user?.roles?.includes(role) || false;
  const refreshUser = async () => {
    try {
      const userResponse = await api.get("/Users/me");
      const userData = userResponse.data;
      localStorage.setItem("auth_user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        hasRole,
        refreshUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Check your main.tsx!",
    );
  }
  return context;
};
