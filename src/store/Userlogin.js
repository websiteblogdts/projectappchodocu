import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import config from '../config/config';

// Lưu token dựa trên môi trường
const storeToken = async (token, role, userId, account_status) => {
  try {
    if (Platform.OS === 'web') {
      // Lưu token vào localStorage nếu là trình duyệt web
      localStorage.setItem('userToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('account_status', account_status); // Lưu trạng thái OTP
    } else {
      // Lưu token vào AsyncStorage nếu là môi trường Android/iOS
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('account_status', account_status); // Lưu trạng thái OTP
    }
  } catch (error) {
    console.error('Error storing token:', error);
  }
};
// Xóa token dựa trên môi trường
const removeToken = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
    } else {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userId');
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Lấy token dựa trên môi trường
const getToken = async () => {
  try {
    if (Platform.OS === 'web') {
      const token = localStorage.getItem('userToken');
      const role = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const account_status = localStorage.getItem('otpVerified'); // Lấy trạng thái OTP
      return { token, role, userId, account_status }; // Trả về trạng thái OTP
    } else {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      const userId = await AsyncStorage.getItem('userId');
      const account_status = await AsyncStorage.getItem('otpVerified'); // Lấy trạng thái OTP
      return { token, role, userId, account_status}; // Trả về trạng thái OTP
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return null;
};


// Xác thực token
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
