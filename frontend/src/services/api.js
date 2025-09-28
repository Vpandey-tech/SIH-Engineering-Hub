// src/services/api.ts
import axios from 'axios';
import { auth } from '../firebaseClient';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // backend URL
  headers: { 'Content-Type': 'application/json' },
});

// attach token automatically
API.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
