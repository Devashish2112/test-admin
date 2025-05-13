// Added updateAlertStatus API call for updating alert status

import axios from 'axios';

const API_URL = 'https://db4f-2409-40d2-1008-5502-2149-560a-7e5-856a.ngrok-free.app/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Ensure the token is properly formatted
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    config.headers.Authorization = formattedToken;
    console.log('Request headers:', config.headers);
  }
  return config;
});

// Add response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => {
    console.log('Response status:', response.status);
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      headers: error.config?.headers,
    });
    
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials: { email: string; password: string }) =>
  api.post('/auth/login', credentials);

// Dashboard
export const getDashboardStats = () => api.get('/admin/dashboard/stats');

// Users
export const getUsers = (params: { skip?: number; limit?: number; search?: string }) =>
  api.get('/admin/users', { params });

export const updateUser = (userId: number, data: any) =>
  api.put(`/admin/users/${userId}`, data);

// Incidents
export const getIncidents = (params: { skip?: number; limit?: number; status?: string; search?: string; category?: string }) =>
  api.get('/incidents', { params });

export const updateIncident = (incidentId: string, data: any) =>
  api.put(`/admin/incidents/${incidentId}/status`, data);

// Alerts
export const getAlerts = (params: { skip?: number; limit?: number; severity?: string; search?: string }) =>
  api.get('/admin/alerts', { params });

export const createAlert = (data: any) =>
  api.post('/incidents', data);

export const updateAlertStatus = (alertId: number, data: any) =>
  api.put(`/admin/alerts/${alertId}/status`, data);


// Volunteers
export const getVolunteers = (params: { skip?: number; limit?: number; status?: string; search?: string }) =>
  api.get('/admin/volunteers', { params });

export const updateVolunteer = (volunteerId: string, data: any) =>
  api.put(`/admin/volunteers/${volunteerId}/status`, data);

// Analytics
export const getIncidentAnalytics = (period: '7d' | '30d' | '90d' | '1y') =>
  api.get('/admin/analytics/incidents', { params: { period } });

export const getAlertAnalytics = (period: '7d' | '30d' | '90d' | '1y') =>
  api.get('/admin/analytics/alerts', { params: { period } });

export default api;
