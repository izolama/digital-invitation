// API Configuration
// Base URL for backend API

const getApiBaseUrl = () => {
  // Check for environment variable first (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development, use localhost:5001
  if (import.meta.env.DEV) {
    return 'http://localhost:5001';
  }
  
  // Production: Use localhost:5001 (same server)
  return 'http://localhost:5001';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Public endpoints
  REGISTRATIONS: `${API_BASE_URL}/api/registrations`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_LOGOUT: `${API_BASE_URL}/api/admin/logout`,
  ADMIN_REGISTRATIONS: `${API_BASE_URL}/api/admin/registrations`,
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
};

export default API_BASE_URL;

