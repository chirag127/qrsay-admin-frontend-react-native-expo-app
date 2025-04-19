import api from './api';

class RestaurantService {
  async getRestaurantDetail() {
    try {
      const response = await api.get('/v1/restaurant/getRestaurantDetail');
      return response.data;
    } catch (error) {
      console.error('Get restaurant detail error:', error);
      throw error;
    }
  }

  async updateRestaurantProfile(data) {
    try {
      const response = await api.patch('/v1/restaurant/updateRestaurantProfile', data);
      return response.data;
    } catch (error) {
      console.error('Update restaurant profile error:', error);
      throw error;
    }
  }

  async getRestaurantGallery() {
    try {
      const response = await api.get('/v1/restaurant/getRestaurantGallery');
      return response.data;
    } catch (error) {
      console.error('Get restaurant gallery error:', error);
      throw error;
    }
  }

  async uploadRestaurantImage(formData) {
    try {
      const response = await api.post('/v1/restaurant/uploadRestaurantImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload restaurant image error:', error);
      throw error;
    }
  }

  async deleteRestaurantImage(imageId) {
    try {
      const response = await api.delete(`/v1/restaurant/deleteRestaurantImage/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Delete restaurant image error:', error);
      throw error;
    }
  }

  async getRestaurantTables() {
    try {
      const response = await api.get('/v1/restaurant/getRestaurantTables');
      return response.data;
    } catch (error) {
      console.error('Get restaurant tables error:', error);
      throw error;
    }
  }

  async addRestaurantTable(data) {
    try {
      const response = await api.post('/v1/restaurant/addRestaurantTable', data);
      return response.data;
    } catch (error) {
      console.error('Add restaurant table error:', error);
      throw error;
    }
  }

  async updateRestaurantTable(tableId, data) {
    try {
      const response = await api.patch(`/v1/restaurant/updateRestaurantTable/${tableId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update restaurant table error:', error);
      throw error;
    }
  }

  async deleteRestaurantTable(tableId) {
    try {
      const response = await api.delete(`/v1/restaurant/deleteRestaurantTable/${tableId}`);
      return response.data;
    } catch (error) {
      console.error('Delete restaurant table error:', error);
      throw error;
    }
  }

  async getRestaurantRooms() {
    try {
      const response = await api.get('/v1/restaurant/getRestaurantRooms');
      return response.data;
    } catch (error) {
      console.error('Get restaurant rooms error:', error);
      throw error;
    }
  }

  async addRestaurantRoom(data) {
    try {
      const response = await api.post('/v1/restaurant/addRestaurantRoom', data);
      return response.data;
    } catch (error) {
      console.error('Add restaurant room error:', error);
      throw error;
    }
  }

  async updateRestaurantRoom(roomId, data) {
    try {
      const response = await api.patch(`/v1/restaurant/updateRestaurantRoom/${roomId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update restaurant room error:', error);
      throw error;
    }
  }

  async deleteRestaurantRoom(roomId) {
    try {
      const response = await api.delete(`/v1/restaurant/deleteRestaurantRoom/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Delete restaurant room error:', error);
      throw error;
    }
  }

  async getRestaurantQrCode() {
    try {
      const response = await api.get('/v1/restaurant/getRestaurantQrCode');
      return response.data;
    } catch (error) {
      console.error('Get restaurant QR code error:', error);
      throw error;
    }
  }

  async getRestaurantContactDetails() {
    try {
      const response = await api.get('/v1/restaurant/getRestaurantContactDetails');
      return response.data;
    } catch (error) {
      console.error('Get restaurant contact details error:', error);
      throw error;
    }
  }

  async addRestaurantContactDetail(data) {
    try {
      const response = await api.post('/v1/restaurant/addRestaurantContactDetail', data);
      return response.data;
    } catch (error) {
      console.error('Add restaurant contact detail error:', error);
      throw error;
    }
  }

  async updateRestaurantContactDetail(contactId, data) {
    try {
      const response = await api.patch(`/v1/restaurant/updateRestaurantContactDetail/${contactId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update restaurant contact detail error:', error);
      throw error;
    }
  }

  async deleteRestaurantContactDetail(contactId) {
    try {
      const response = await api.delete(`/v1/restaurant/deleteRestaurantContactDetail/${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Delete restaurant contact detail error:', error);
      throw error;
    }
  }

  async updateRestaurantStatus(status) {
    try {
      const response = await api.patch('/v1/restaurant/updateRestaurantStatus', { restaurantStatus: status });
      return response.data;
    } catch (error) {
      console.error('Update restaurant status error:', error);
      throw error;
    }
  }

  async updateDineInStatus(status) {
    try {
      const response = await api.patch('/v1/restaurant/updateDineInStatus', { isDineInAvailableRestaurant: status });
      return response.data;
    } catch (error) {
      console.error('Update dine-in status error:', error);
      throw error;
    }
  }
}

export default new RestaurantService();
