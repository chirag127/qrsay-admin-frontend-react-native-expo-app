import api from './api';

class WaiterService {
  async getWaiterCalls() {
    try {
      const response = await api.get('/v1/waiter/getWaiterCalls');
      return response.data;
    } catch (error) {
      console.error('Get waiter calls error:', error);
      throw error;
    }
  }

  async updateWaiterCallStatus(data) {
    try {
      const response = await api.patch('/v1/waiter/updateStatus', data);
      return response.data;
    } catch (error) {
      console.error('Update waiter call status error:', error);
      throw error;
    }
  }
}

export default new WaiterService();
