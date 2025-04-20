import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants';

export const login = async (email, password) => {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    
    if (response.data && response.data.data && response.data.data.token) {
      await AsyncStorage.setItem('token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      return response.data.data;
    }
    
    throw new Error('Invalid response from server');
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (password, token) => {
  try {
    const response = await api.patch(`${API_ENDPOINTS.RESET_PASSWORD}/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.patch(API_ENDPOINTS.UPDATE_PASSWORD, {
      passwordCurrent: currentPassword,
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    return false;
  }
};
