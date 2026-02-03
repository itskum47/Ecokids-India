import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          toast.error(data?.message || 'Access denied');
          break;
          
        case 404:
          // Not found
          toast.error(data?.message || 'Resource not found');
          break;
          
        case 422:
          // Validation errors
          if (data?.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => {
              toast.error(`${err.field}: ${err.message}`);
            });
          } else {
            toast.error(data?.message || 'Validation failed');
          }
          break;
          
        case 429:
          // Rate limit exceeded
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Generic error
          toast.error(data?.message || 'An error occurred');
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      toast.error('Request timeout. Please check your connection.');
    } else if (error.message === 'Network Error') {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Unknown error
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  deleteAccount: (password) => api.delete('/auth/account', { data: { password } }),
};

export const topicsAPI = {
  getTopics: (params) => api.get('/topics', { params }),
  getTopic: (id) => api.get(`/topics/${id}`),
  createTopic: (topicData) => api.post('/topics', topicData),
  updateTopic: (id, topicData) => api.put(`/topics/${id}`, topicData),
  deleteTopic: (id) => api.delete(`/topics/${id}`),
  getTopicsByCategory: (category, params) => api.get(`/topics/category/${category}`, { params }),
  getPopularTopics: (limit) => api.get('/topics/popular', { params: { limit } }),
  searchTopics: (query, params) => api.get('/topics/search', { params: { query, ...params } }),
  likeTopic: (id) => api.post(`/topics/${id}/like`),
  completeTopic: (id, score) => api.post(`/topics/${id}/complete`, { score }),
};

export const gamesAPI = {
  getGames: (params) => api.get('/games', { params }),
  getGame: (id) => api.get(`/games/${id}`),
  createGame: (gameData) => api.post('/games', gameData),
  updateGame: (id, gameData) => api.put(`/games/${id}`, gameData),
  deleteGame: (id) => api.delete(`/games/${id}`),
  getGamesByCategory: (category, params) => api.get(`/games/category/${category}`, { params }),
  getPopularGames: (limit) => api.get('/games/popular', { params: { limit } }),
  submitGameScore: (id, scoreData) => api.post(`/games/${id}/score`, scoreData),
  getGameLeaderboard: (id, params) => api.get(`/games/${id}/leaderboard`, { params }),
  rateGame: (id, rating) => api.post(`/games/${id}/rate`, { rating }),
};

export const experimentsAPI = {
  getExperiments: (params) => api.get('/experiments', { params }),
  getExperiment: (id) => api.get(`/experiments/${id}`),
  createExperiment: (experimentData) => api.post('/experiments', experimentData),
  updateExperiment: (id, experimentData) => api.put(`/experiments/${id}`, experimentData),
  deleteExperiment: (id) => api.delete(`/experiments/${id}`),
  getExperimentsByCategory: (category, params) => api.get(`/experiments/category/${category}`, { params }),
  getPopularExperiments: (limit) => api.get('/experiments/popular', { params: { limit } }),
  submitExperimentResult: (id, resultData) => api.post(`/experiments/${id}/submit`, resultData),
  getExperimentSubmissions: (id, params) => api.get(`/experiments/${id}/submissions`, { params }),
  rateExperiment: (id, rating) => api.post(`/experiments/${id}/rate`, { rating }),
};

export const quizzesAPI = {
  getQuizzes: (params) => api.get('/quizzes', { params }),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  getQuizzesByTopic: (topicId, params) => api.get(`/quizzes/topic/${topicId}`, { params }),
  startQuizAttempt: (id) => api.post(`/quizzes/${id}/start`),
  submitQuizAnswer: (id, answerData) => api.post(`/quizzes/${id}/answer`, answerData),
  completeQuizAttempt: (id, completionData) => api.post(`/quizzes/${id}/complete`, completionData),
  getQuizResults: (id, params) => api.get(`/quizzes/${id}/results`, { params }),
  getQuizAnalytics: (id) => api.get(`/quizzes/${id}/analytics`),
};

export const progressAPI = {
  getUserProgress: () => api.get('/progress'),
  updateProgress: (progressData) => api.put('/progress', progressData),
  getProgressAnalytics: () => api.get('/progress/analytics'),
  getStreakInfo: () => api.get('/progress/streak'),
  updateStreak: () => api.put('/progress/streak'),
  getAchievements: () => api.get('/progress/achievements'),
  awardBadge: (userId, badgeData) => api.post(`/progress/badge/${userId}`, badgeData),
};

export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserProgress: () => api.get('/users/progress'),
  getUserAchievements: () => api.get('/users/achievements'),
  getLeaderboard: (params) => api.get('/users/leaderboard', { params }),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getContentManagement: (params) => api.get('/admin/content', { params }),
  getUserManagement: (params) => api.get('/admin/users', { params }),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getSystemHealth: () => api.get('/admin/system-health'),
  moderateContent: (type, id, action) => api.put(`/admin/content/${type}/${id}/moderate`, { action }),
  bulkOperations: (operations) => api.post('/admin/content/bulk', { operations }),
};

export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadVideo: (formData) => api.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadDocument: (formData) => api.post('/upload/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadMultiple: (formData) => api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getUploadedFiles: (params) => api.get('/upload/files', { params }),
  deleteFile: (publicId) => api.delete(`/upload/files/${publicId}`),
};

// Generic API request function
export const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method: method.toLowerCase(),
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;