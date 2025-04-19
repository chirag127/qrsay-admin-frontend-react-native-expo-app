import React, { createContext, useState, useEffect, useContext } from 'react';
import restaurantService from '../services/restaurant.service';
import socketService from '../services/socket.service';
import { useAuth } from './AuthContext';

// Create the context
const RestaurantContext = createContext();

// Create a provider component
export const RestaurantProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [restaurantData, setRestaurantData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantStatus, setRestaurantStatus] = useState('online');
  const [dineInStatus, setDineInStatus] = useState(false);

  // Load restaurant data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadRestaurantData();
    }
  }, [isAuthenticated, user]);

  // Setup socket connection
  useEffect(() => {
    if (restaurantData && restaurantData._id) {
      const socket = socketService.connect();
      socketService.joinRestaurantRoom(restaurantData._id);

      // Clean up on unmount
      return () => {
        socketService.disconnect();
      };
    }
  }, [restaurantData]);

  // Load restaurant data
  const loadRestaurantData = async () => {
    try {
      setIsLoading(true);
      const response = await restaurantService.getRestaurantDetail();
      
      if (response && response.data && response.data.restaurantDetail) {
        setRestaurantData(response.data.restaurantDetail);
        setRestaurantStatus(response.data.restaurantDetail.restaurantStatus || 'online');
        setDineInStatus(response.data.restaurantDetail.isDineInAvailableRestaurant || false);
      }
    } catch (error) {
      console.error('Load restaurant data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update restaurant status
  const updateRestaurantStatus = async (status) => {
    try {
      setIsLoading(true);
      await restaurantService.updateRestaurantStatus(status);
      setRestaurantStatus(status);
      return { success: true };
    } catch (error) {
      console.error('Update restaurant status error:', error);
      return { success: false, message: 'An error occurred while updating restaurant status' };
    } finally {
      setIsLoading(false);
    }
  };

  // Update dine-in status
  const updateDineInStatus = async (status) => {
    try {
      setIsLoading(true);
      await restaurantService.updateDineInStatus(status);
      setDineInStatus(status);
      return { success: true };
    } catch (error) {
      console.error('Update dine-in status error:', error);
      return { success: false, message: 'An error occurred while updating dine-in status' };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    restaurantData,
    isLoading,
    restaurantStatus,
    dineInStatus,
    loadRestaurantData,
    updateRestaurantStatus,
    updateDineInStatus,
  };

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
};

// Custom hook to use the restaurant context
export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export default RestaurantContext;
