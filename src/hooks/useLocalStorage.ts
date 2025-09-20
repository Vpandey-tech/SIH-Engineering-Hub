import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App'; // Assuming App.tsx is in the root

export const useLocalStorage = () => {
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    return !!(authToken && userData);
  });

  useEffect(() => {
    const syncAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      setIsAuthenticated(!!(authToken && userData));
    };

    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const checkAuthentication = () => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!(authToken && userData));
    return !!(authToken && userData);
  };

  const saveData = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  };

  const loadData = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  };

  const removeData = (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  };

  const clearAuthData = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('onboardingComplete');
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      return false;
    }
  };

  const clearAll = () => {
    try {
      localStorage.clear();
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  };

  const authenticateUser = (userData: any) => {
    const authToken = 'authenticated_' + Date.now();
    saveData('user', userData);
    localStorage.setItem('authToken', authToken);
    setIsAuthenticated(true);
    return true;
  };

  const loadActivity = (): Array<{ title: string; time: string }> => {
    const activityKey = user ? `recentActivity_${user.uid}` : 'recentActivity';
    return loadData(activityKey) || [];
  };

  const addActivity = (title: string) => {
    const activityKey = user ? `recentActivity_${user.uid}` : 'recentActivity';
    const newActivity = { title, time: new Date().toISOString() };
    const currentActivities = loadActivity();
    const updatedActivities = [newActivity, ...currentActivities].slice(0, 5);
    saveData(activityKey, updatedActivities);
  };

  return {
    saveData,
    loadData,
    removeData,
    clearAll,
    clearAuthData,
    authenticateUser,
    isAuthenticated,
    checkAuthentication,
    loadActivity,
    addActivity,
  };
};