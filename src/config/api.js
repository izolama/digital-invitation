// API Configuration
// Base URL for backend API

// In development, Vite proxy handles /api requests
// In production, use environment variable or detect from window.location
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development, use proxy (empty string = same origin)
  if (import.meta.env.DEV) {
    return ''; // Vite proxy will handle /api requests
  }
  
  // In production, try to detect backend URL
  // If frontend and backend are on same domain but different ports
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  
  // If we have VITE_API_BASE_URL, use it
  // Otherwise, try to construct from current location
  // For Docker: use same hostname with port 5001
  if (host && !host.includes('localhost')) {
    // Production: use same hostname, different port
    return `${protocol}//${host}:5001`;
  }
  
  // Fallback: localhost with port 5001
  return `${protocol}//localhost:5001`;
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

