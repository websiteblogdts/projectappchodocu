// hooks/useAuth.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config/config';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');

        if (token) {
          const isValid = await validateToken(token);
          if (isValid) {
            setIsLoggedIn(true);
            setRole(role);
          } else {
            await removeToken();
          }
        }
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${config.apiBaseURL}/auth/validate-token`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return { isLoggedIn, role, loading };
};

export default useAuth;
