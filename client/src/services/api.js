import axios from 'axios';

// Configuration de base d'axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API d'authentification
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/me', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  createAdmin: () => api.post('/auth/create-admin'),
};

// API des destinations
export const destinationsAPI = {
  getAll: (params) => api.get('/destinations', { params }),
  getById: (id, params) => api.get(`/destinations/${id}`, { params }),
  search: (params) => api.get('/destinations/search', { params }),
  getPopular: (params) => api.get('/destinations/popular', { params }),
  getCategories: () => api.get('/destinations/categories'),
  getCountries: () => api.get('/destinations/countries'),
};

// API des réservations
export const reservationsAPI = {
  create: (reservationData) => api.post('/reservations', reservationData),
  getUserReservations: (userId, params) => 
    api.get(`/reservations/user/${userId}`, { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  cancel: (id) => api.put(`/reservations/${id}/cancel`),
  getStats: () => api.get('/reservations/stats'),
};

// API d'administration
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Destinations
  getAllDestinations: (params) => api.get('/admin/destinations', { params }),
  createDestination: (destinationData) => 
    api.post('/admin/destinations', destinationData),
  updateDestination: (id, destinationData) => 
    api.put(`/admin/destinations/${id}`, destinationData),
  deleteDestination: (id) => api.delete(`/admin/destinations/${id}`),
  
  // Réservations
  getAllReservations: (params) => api.get('/admin/reservations', { params }),
  updateReservationStatus: (id, status) => 
    api.put(`/admin/reservations/${id}/status`, { statut: status }),
};

// API des utilisateurs
export const usersAPI = {
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  deactivate: (id) => api.put(`/users/${id}/deactivate`),
  activate: (id) => api.put(`/users/${id}/activate`),
};

// Fonction utilitaire pour formater les erreurs
export const formatError = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.details) {
    return error.response.data.details.map(d => d.message).join(', ');
  }
  return error.message || 'Une erreur est survenue';
};

// Fonction utilitaire pour formater les dates
export const formatDate = (date, locale = 'fr-FR') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Fonction utilitaire pour formater les prix
export const formatPrice = (price, currency = 'EUR', locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price);
};

export default api; 