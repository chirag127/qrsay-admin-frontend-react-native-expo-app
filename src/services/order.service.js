import api from './api';

class OrderService {
  async getRestaurantOrdersByStatus(data) {
    try {
      const response = await api.put('/v1/orders/getRestaurantOrdersByStatus', data);
      return response.data;
    } catch (error) {
      console.error('Get restaurant orders by status error:', error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/v1/orders/getOrderById/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/v1/orders/updateOrderStatus/${orderId}`, { orderStatus: status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  async acceptOrder(orderId, data) {
    try {
      const response = await api.patch(`/v1/orders/acceptOrder/${orderId}`, data);
      return response.data;
    } catch (error) {
      console.error('Accept order error:', error);
      throw error;
    }
  }

  async rejectOrder(orderId, data) {
    try {
      const response = await api.patch(`/v1/orders/rejectOrder/${orderId}`, data);
      return response.data;
    } catch (error) {
      console.error('Reject order error:', error);
      throw error;
    }
  }

  async completeOrder(orderId) {
    try {
      const response = await api.patch(`/v1/orders/completeOrder/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Complete order error:', error);
      throw error;
    }
  }

  async getOrderStatistics() {
    try {
      const response = await api.get('/v1/orders/getOrderStatistics');
      return response.data;
    } catch (error) {
      console.error('Get order statistics error:', error);
      throw error;
    }
  }

  async getActiveDineIn() {
    try {
      const response = await api.get('/v1/restaurant/getActiveDineIn');
      return response.data;
    } catch (error) {
      console.error('Get active dine-in error:', error);
      throw error;
    }
  }
}

export default new OrderService();
