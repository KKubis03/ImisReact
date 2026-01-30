/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

// Base URL of the backend API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API endpoint with /api suffix
export const API_ENDPOINT = `${API_BASE_URL}/api`;
