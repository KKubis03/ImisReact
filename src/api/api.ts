import axios from "axios";
import { API_ENDPOINT } from "../config/api.config";
import type { ApiResponse } from "./types/apiResponse";

const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const apiResponse = response.data as ApiResponse;
    if (
      apiResponse &&
      Object.prototype.hasOwnProperty.call(apiResponse, "success")
    ) {
      if (!apiResponse.success) {
        return Promise.reject(apiResponse.message || "Something went wrong");
      }
      response.data = apiResponse.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.title ||
      "Failed to connect to the server";
    return Promise.reject(errorMessage);
  }
);

export default api;
