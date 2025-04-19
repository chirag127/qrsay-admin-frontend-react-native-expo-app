import React, { createContext, useState, useEffect, useContext } from 'react';
import orderService from '../services/order.service';
import socketService from '../services/socket.service';
import { useRestaurant } from './RestaurantContext';

// Create the context
const OrderContext = createContext();

// Create a provider component
export const OrderProvider = ({ children }) => {
  const { restaurantData } = useRestaurant();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [processingOrders, setProcessingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeDineIn, setActiveDineIn] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders when restaurant data is available
  useEffect(() => {
    if (restaurantData && restaurantData._id) {
      loadOrders();
      loadActiveDineIn();
      
      // Setup socket listeners for order updates
      const socket = socketService.getSocket();
      
      socket.on('orderUpdate', (updatedOrder) => {
        console.log('Order update received:', updatedOrder);
        loadOrders();
      });
      
      // Clean up on unmount
      return () => {
        socket.off('orderUpdate');
      };
    }
  }, [restaurantData]);

  // Load orders
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      
      // Load pending orders
      const pendingResponse = await orderService.getRestaurantOrdersByStatus({ orderStatus: 'pending' });
      if (pendingResponse && pendingResponse.data && pendingResponse.data.orders) {
        setPendingOrders(pendingResponse.data.orders);
      }
      
      // Load processing orders
      const processingResponse = await orderService.getRestaurantOrdersByStatus({ orderStatus: 'processing' });
      if (processingResponse && processingResponse.data && processingResponse.data.orders) {
        setProcessingOrders(processingResponse.data.orders);
      }
      
      // Load completed orders
      const completedResponse = await orderService.getRestaurantOrdersByStatus({ orderStatus: 'completed' });
      if (completedResponse && completedResponse.data && completedResponse.data.orders) {
        setCompletedOrders(completedResponse.data.orders);
      }
    } catch (error) {
      console.error('Load orders error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load active dine-in
  const loadActiveDineIn = async () => {
    try {
      const response = await orderService.getActiveDineIn();
      if (response && response.data && response.data.activeDineIn) {
        setActiveDineIn(response.data.activeDineIn);
      }
    } catch (error) {
      console.error('Load active dine-in error:', error);
    }
  };

  // Accept order
  const acceptOrder = async (orderId, data) => {
    try {
      setIsLoading(true);
      await orderService.acceptOrder(orderId, data);
      
      // Emit socket event
      if (restaurantData && restaurantData._id) {
        socketService.emitEvent('orderAcceptedOrRejected', {
          orderId,
          orderStatus: 'processing',
          restaurantId: restaurantData._id,
          customerId: data.customerId,
        });
      }
      
      // Reload orders
      await loadOrders();
      
      return { success: true };
    } catch (error) {
      console.error('Accept order error:', error);
      return { success: false, message: 'An error occurred while accepting the order' };
    } finally {
      setIsLoading(false);
    }
  };

  // Reject order
  const rejectOrder = async (orderId, data) => {
    try {
      setIsLoading(true);
      await orderService.rejectOrder(orderId, data);
      
      // Emit socket event
      if (restaurantData && restaurantData._id) {
        socketService.emitEvent('orderAcceptedOrRejected', {
          orderId,
          orderStatus: 'rejected',
          restaurantId: restaurantData._id,
          customerId: data.customerId,
        });
      }
      
      // Reload orders
      await loadOrders();
      
      return { success: true };
    } catch (error) {
      console.error('Reject order error:', error);
      return { success: false, message: 'An error occurred while rejecting the order' };
    } finally {
      setIsLoading(false);
    }
  };

  // Complete order
  const completeOrder = async (orderId) => {
    try {
      setIsLoading(true);
      await orderService.completeOrder(orderId);
      
      // Reload orders
      await loadOrders();
      
      return { success: true };
    } catch (error) {
      console.error('Complete order error:', error);
      return { success: false, message: 'An error occurred while completing the order' };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    pendingOrders,
    processingOrders,
    completedOrders,
    activeDineIn,
    isLoading,
    loadOrders,
    loadActiveDineIn,
    acceptOrder,
    rejectOrder,
    completeOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

// Custom hook to use the order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
