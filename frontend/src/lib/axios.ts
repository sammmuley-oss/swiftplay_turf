import axios from 'axios';
import { API_URL } from './api';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// Add a request interceptor to add the JWT token to headers if it's in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Standard way to set headers in recent Axios
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
