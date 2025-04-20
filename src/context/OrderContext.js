import React, { createContext, useState, useEffect, useContext } from 'react';
import * as orderService from '../services/orderService';
import socketService from '../services/socketService';
import { useAuth } from './AuthContext';
import { ORDER_STATUS } from '../constants';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { restaurant } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [processingOrders, setProcessingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [activeDineIn, setActiveDineIn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (restaurant && restaurant._id) {
      // Initialize socket
      const socket = socketService.initializeSocket();
      
      // Join restaurant room
      socketService.joinRestaurantRoom(restaurant._id);
      
      // Listen for order updates
      socketService.listenForOrderUpdates((orderData) => {
        refreshOrders();
      });
      
      // Load initial orders
      refreshOrders();
      
      // Cleanup on unmount
      return () => {
        socketService.disconnectSocket();
      };
    }
  }, [restaurant]);

  const refreshOrders = async () => {
    try {
      setLoading(true);
      await fetchOrdersByStatus(ORDER_STATUS.PENDING);
      await fetchOrdersByStatus(ORDER_STATUS.PROCESSING);
      await fetchOrdersByStatus(ORDER_STATUS.COMPLETED);
      await fetchOrdersByStatus(ORDER_STATUS.CANCELLED);
      await fetchActiveDineIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByStatus = async (status) => {
    try {
      const response = await orderService.getOrdersByStatus(status);
      
      if (response && response.data && response.data.orders) {
        const orders = response.data.orders;
        
        switch (status) {
          case ORDER_STATUS.PENDING:
            setPendingOrders(orders);
            break;
          case ORDER_STATUS.PROCESSING:
            setProcessingOrders(orders);
            break;
          case ORDER_STATUS.COMPLETED:
            setCompletedOrders(orders);
            break;
          case ORDER_STATUS.CANCELLED:
            setCancelledOrders(orders);
            break;
          default:
            break;
        }
      }
    } catch (err) {
      console.error(`Error fetching ${status} orders:`, err);
      throw err;
    }
  };

  const fetchActiveDineIn = async () => {
    try {
      // This endpoint might be different in your API
      const response = await orderService.getOrdersByStatus('dineIn');
      
      if (response && response.data && response.data.orders) {
        setActiveDineIn(response.data.orders);
      }
    } catch (err) {
      console.error('Error fetching active dine-in:', err);
      throw err;
    }
  };

  const changeOrderStatus = async (orderId, status, reason = '') => {
    try {
      setLoading(true);
      setError(null);
      
      await orderService.changeOrderStatus(orderId, status, reason);
      
      // Refresh orders after status change
      await refreshOrders();
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      
      await orderService.deleteOrder(orderId);
      
      // Refresh orders after deletion
      await refreshOrders();
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        activeDineIn,
        loading,
        error,
        refreshOrders,
        changeOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
