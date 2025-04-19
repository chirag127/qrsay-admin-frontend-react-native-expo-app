import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/v1/user/login', { email, password });
      
      if (response.data && response.data.data && response.data.data.token) {
        await this.setUserToken(response.data.data.token);
        await this.setUserDetail(response.data.data.user);
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userDetail');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async setUserToken(token) {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  }

  async setUserDetail(data) {
    try {
      await AsyncStorage.setItem('userDetail', JSON.stringify(data));
    } catch (error) {
      console.error('Error setting user detail:', error);
      throw error;
    }
  }

  async getUserDetail() {
    try {
      const data = await AsyncStorage.getItem('userDetail');
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error getting user detail:', error);
      return null;
    }
  }

  async checkUserLogin() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  async getUserToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post('/v1/user/forgotPassword', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(password, token) {
    try {
      const response = await api.patch(`/v1/user/resetPassword/${token}`, { password });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async changePassword(requestData) {
    try {
      const response = await api.patch('/v1/user/updatePassword', requestData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async sendEmailVerificationOtp(email) {
    try {
      const response = await api.post('/v1/user/emailVerification', { email });
      return response.data;
    } catch (error) {
      console.error('Send email verification error:', error);
      throw error;
    }
  }

  async verifyEmailOtp(otp, email) {
    try {
      const response = await api.put('/v1/user/verifyEmailOtp', { otp, email });
      return response.data;
    } catch (error) {
      console.error('Verify email OTP error:', error);
      throw error;
    }
  }
}

export default new AuthService();
