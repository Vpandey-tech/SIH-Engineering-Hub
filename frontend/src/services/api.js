// src/utils/api.js
import axios from 'axios';
import { auth } from '../firebaseClient.ts';

const api = axios.create({
  baseURL:  'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// attach token to requests when available
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
