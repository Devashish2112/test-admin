// Added updateAlertStatus API call for updating alert status

import axios from 'axios';

// Update this URL to your current backend API endpoint
const API_URL = 'http://localhost:8000/api/';
// If your backend is running on a different port, update the URL accordingly
// const API_URL = 'https://hong-tumor-signs-mess.trycloudflare.com/api/';

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
    console.log('Response data:', response.data);
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
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

// Helper for incident ID handling
const extractIdString = (idField: string | { $oid: string } | undefined): string => {
  if (!idField) return '';
  if (typeof idField === 'string') return idField;
  if (typeof idField === 'object' && '$oid' in idField) return idField.$oid;
  return String(idField);
};

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
export const getIncidents = (params: { skip?: number; limit?: number; status?: string; search?: string; category?: string }) => {
  console.log('Calling getIncidents API with params:', params);
  return api.get('/incidents', { params });
};

export const getIncidentById = (incidentId: string) => {
  const id = extractIdString(incidentId);
  if (!id) {
    console.error('Invalid incident ID:', incidentId);
    return Promise.reject(new Error('Invalid incident ID'));
  }
  
  console.log('Fetching incident details for ID:', id);
  return api.get(`/incidents/${id}`);
};

export const updateIncident = (incidentId: string, data: any) => {
  console.log('Calling updateIncident API with:', incidentId, data);
  
  // Ensure we have a proper string ID
  const id = extractIdString(incidentId);
  if (!id) {
    console.error('Invalid incident ID:', incidentId);
    return Promise.reject(new Error('Invalid incident ID'));
  }
  
  return api.put(`/incidents/${id}/status`, data);
};

export const verifyIncident = (incidentId: string) => {
  console.log('Calling verifyIncident API with:', incidentId);
  
  // Ensure we have a proper string ID
  const id = extractIdString(incidentId);
  if (!id) {
    console.error('Invalid incident ID:', incidentId);
    return Promise.reject(new Error('Invalid incident ID'));
  }
  
  return api.put(`/incidents/${id}/verify`);
};

export const resolveIncident = (incidentId: string) => {
  console.log('Calling resolveIncident API with:', incidentId);
  
  // Ensure we have a proper string ID
  const id = extractIdString(incidentId);
  if (!id) {
    console.error('Invalid incident ID:', incidentId);
    return Promise.reject(new Error('Invalid incident ID'));
  }
  
  return api.put(`/incidents/${id}/resolve`);
};

// Alerts
export const getAlerts = (params: { skip?: number; limit?: number; severity?: string; search?: string }) =>
  api.get('/admin/alerts', { params });

export const createAlert = (data: any) =>
  api.post('/alerts', data);

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
