// API Configuration
// Base URL for backend API

const getApiBaseUrl = () => {
  // Check for environment variable first (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development, use IP address
  if (import.meta.env.DEV) {
    return 'https://backend-digital-invitation.nahsbyte.my.id';
  }
  
  // Production: Use IP address
  return 'https://backend-digital-invitation.nahsbyte.my.id';
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

