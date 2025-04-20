import api from './api';
import { API_ENDPOINTS } from '../constants';

export const getRestaurantDetail = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.RESTAURANT_PROFILE);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRestaurantDetail = async (restaurantData) => {
  try {
    const response = await api.patch(API_ENDPOINTS.UPDATE_RESTAURANT, restaurantData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeRestaurantStatus = async (status) => {
  try {
    const response = await api.patch(API_ENDPOINTS.CHANGE_RESTAURANT_STATUS, {
      restaurantStatus: status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleDineInStatus = async (isDineInAvailable) => {
  try {
    const response = await api.patch(API_ENDPOINTS.UPDATE_RESTAURANT, {
      isDineInAvailableRestaurant: isDineInAvailable,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
