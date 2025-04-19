import api from './api';

class UserService {
  async getUsers() {
    try {
      const response = await api.get('/v1/user/getUsers');
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const response = await api.get(`/v1/user/getUserById/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  async addUser(data) {
    try {
      const response = await api.post('/v1/user/addUser', data);
      return response.data;
    } catch (error) {
      console.error('Add user error:', error);
      throw error;
    }
  }

  async updateUser(userId, data) {
    try {
      const response = await api.patch(`/v1/user/updateUser/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/v1/user/deleteUser/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  async updateUserProfile(data) {
    try {
      const response = await api.patch('/v1/user/updateUserProfile', data);
      return response.data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }
}

export default new UserService();
