import api from './api';

class DishService {
  async getDishes() {
    try {
      const response = await api.get('/v1/restaurant/dishes/getDishes');
      return response.data;
    } catch (error) {
      console.error('Get dishes error:', error);
      throw error;
    }
  }

  async getDishById(dishId) {
    try {
      const response = await api.get(`/v1/restaurant/dishes/getDishById/${dishId}`);
      return response.data;
    } catch (error) {
      console.error('Get dish by ID error:', error);
      throw error;
    }
  }

  async addDish(data) {
    try {
      const response = await api.post('/v1/restaurant/dishes/addDish', data);
      return response.data;
    } catch (error) {
      console.error('Add dish error:', error);
      throw error;
    }
  }

  async updateDish(dishId, data) {
    try {
      const response = await api.patch(`/v1/restaurant/dishes/updateDish/${dishId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update dish error:', error);
      throw error;
    }
  }

  async deleteDish(dishId) {
    try {
      const response = await api.delete(`/v1/restaurant/dishes/deleteDish/${dishId}`);
      return response.data;
    } catch (error) {
      console.error('Delete dish error:', error);
      throw error;
    }
  }

  async uploadDishImage(formData) {
    try {
      const response = await api.post('/v1/restaurant/dishes/uploadDishImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload dish image error:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await api.get('/v1/restaurant/dishes/getCategories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  async addCategory(data) {
    try {
      const response = await api.post('/v1/restaurant/dishes/addCategory', data);
      return response.data;
    } catch (error) {
      console.error('Add category error:', error);
      throw error;
    }
  }

  async updateCategory(categoryId, data) {
    try {
      const response = await api.patch(`/v1/restaurant/dishes/updateCategory/${categoryId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const response = await api.delete(`/v1/restaurant/dishes/deleteCategory/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }

  async getExtras() {
    try {
      const response = await api.get('/v1/restaurant/dishes/getExtras');
      return response.data;
    } catch (error) {
      console.error('Get extras error:', error);
      throw error;
    }
  }

  async addExtra(data) {
    try {
      const response = await api.post('/v1/restaurant/dishes/addExtra', data);
      return response.data;
    } catch (error) {
      console.error('Add extra error:', error);
      throw error;
    }
  }

  async updateExtra(extraId, data) {
    try {
      const response = await api.patch(`/v1/restaurant/dishes/updateExtra/${extraId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update extra error:', error);
      throw error;
    }
  }

  async deleteExtra(extraId) {
    try {
      const response = await api.delete(`/v1/restaurant/dishes/deleteExtra/${extraId}`);
      return response.data;
    } catch (error) {
      console.error('Delete extra error:', error);
      throw error;
    }
  }

  async getChoices() {
    try {
      const response = await api.get('/v1/restaurant/dishes/getChoices');
      return response.data;
    } catch (error) {
      console.error('Get choices error:', error);
      throw error;
    }
  }

  async addChoice(data) {
    try {
      const response = await api.post('/v1/restaurant/dishes/addChoice', data);
      return response.data;
    } catch (error) {
      console.error('Add choice error:', error);
      throw error;
    }
  }

  async updateChoice(choiceId, data) {
    try {
      const response = await api.patch(`/v1/restaurant/dishes/updateChoice/${choiceId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update choice error:', error);
      throw error;
    }
  }

  async deleteChoice(choiceId) {
    try {
      const response = await api.delete(`/v1/restaurant/dishes/deleteChoice/${choiceId}`);
      return response.data;
    } catch (error) {
      console.error('Delete choice error:', error);
      throw error;
    }
  }
}

export default new DishService();
