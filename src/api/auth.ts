import axios from "axios";
import { API_BASE_URL } from "../config/api.config";

// tworzymy instancję axios z base URL (można ustawić wspólny endpoint)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * Set the Authorization header for future requests and optionally persist token
 */
export const setAuthToken = (token?: string, persist = true) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (persist) localStorage.setItem(TOKEN_KEY, token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem(TOKEN_KEY);
  }
  // notify app about auth changes so components (same window) can update immediately
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    const user = storedUser ? JSON.parse(storedUser) : null;
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { token: token || null, user } }));
  } catch {}
};

export const initAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  if (token) {
    setAuthToken(token, false);
  }
  if (user) {
    try {
      // keep user in localStorage for other components
      JSON.parse(user);
    } catch {}
  }
};

export const logout = () => {
  setAuthToken(undefined);
  localStorage.removeItem(USER_KEY);
  try {
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { token: null, user: null } }));
  } catch {}
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });

    const data = response.data;

    if (!data) {
      throw new Error("Pusta odpowiedź z serwera podczas logowania");
    }

    // Expected shape: { token: string, user: { id, email, roles } }
    let token: string | null = null;
    let user: any = null;

    if (typeof data === "string") {
      token = data;
    } else if (typeof data === "object") {
      token = (data as any).token || (data as any).accessToken || null;
      user = (data as any).user || null;
    }

    if (!token) {
      const msg = (data as any)?.message || "Nie otrzymano tokenu z serwera";
      throw new Error(msg);
    }

    // persist token and user, and set default header
    setAuthToken(token, true);
    if (user) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch {}
    }

    // dispatch authChanged with both token and user (helps same-window listeners)
    try {
      window.dispatchEvent(new CustomEvent('authChanged', { detail: { token, user } }));
    } catch {}

    return { token, user };
  } catch (error: any) {
    const message =
      typeof error?.response?.data === "string"
        ? error.response.data
        : error?.message || "Wystąpił błąd podczas logowania";
    throw new Error(message);
  }
};

export default api;
