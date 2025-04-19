import api from './api';

class CustomerService {
  async getCustomers() {
    try {
      const response = await api.get('/v1/customer/getCustomers');
      return response.data;
    } catch (error) {
      console.error('Get customers error:', error);
      throw error;
    }
  }

  async getCustomerById(customerId) {
    try {
      const response = await api.get(`/v1/customer/getCustomerById/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Get customer by ID error:', error);
      throw error;
    }
  }

  async getCustomerOrders(customerId) {
    try {
      const response = await api.get(`/v1/customer/getCustomerOrders/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Get customer orders error:', error);
      throw error;
    }
  }
}

export default new CustomerService();
