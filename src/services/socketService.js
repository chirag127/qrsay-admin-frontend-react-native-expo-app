import io from 'socket.io-client';
import { SOCKET_URL } from '@env';
import { SOCKET_EVENTS } from '../constants';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity,
    });
    
    socket.on('connect', () => {
      console.log('Socket connected');
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
    });
  }
  
  return socket;
};

export const joinRestaurantRoom = (restaurantId) => {
  if (socket && restaurantId) {
    socket.emit(SOCKET_EVENTS.JOIN_RESTAURANT_ROOM, restaurantId);
    console.log(`Joining restaurant room: ${restaurantId}`);
  }
};

export const listenForOrderUpdates = (callback) => {
  if (socket) {
    socket.on(SOCKET_EVENTS.ORDER_UPDATE, (data) => {
      callback(data);
    });
  }
};

export const listenForWaiterCalls = (callback) => {
  if (socket) {
    socket.on(SOCKET_EVENTS.NEW_WAITER_CALL, (data) => {
      callback(data);
    });
  }
};

export const listenForWaiterCallStatusUpdates = (callback) => {
  if (socket) {
    socket.on(SOCKET_EVENTS.WAITER_CALL_STATUS_UPDATED, (data) => {
      callback(data);
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  joinRestaurantRoom,
  listenForOrderUpdates,
  listenForWaiterCalls,
  listenForWaiterCallStatusUpdates,
  disconnectSocket,
};
