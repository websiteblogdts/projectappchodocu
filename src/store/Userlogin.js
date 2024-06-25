import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config/config';

const storeToken = async (token, role, userId) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userRole', role);
    await AsyncStorage.setItem('userId', userId);
  } catch (error) {
    console.error('Error storing token:', error);
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

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const role = await AsyncStorage.getItem('userRole');
    const userId = await AsyncStorage.getItem('userId');
    return { token, role, userId };
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return null;
};

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

export { storeToken, removeToken, getToken, validateToken };
