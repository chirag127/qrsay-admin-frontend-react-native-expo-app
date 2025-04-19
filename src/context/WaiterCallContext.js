import React, { createContext, useState, useEffect, useContext } from 'react';
import waiterService from '../services/waiter.service';
import socketService from '../services/socket.service';
import { useRestaurant } from './RestaurantContext';

// Create the context
const WaiterCallContext = createContext();

// Create a provider component
export const WaiterCallProvider = ({ children }) => {
  const { restaurantData } = useRestaurant();
  const [waiterCalls, setWaiterCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load waiter calls when restaurant data is available
  useEffect(() => {
    if (restaurantData && restaurantData._id) {
      loadWaiterCalls();
      
      // Setup socket listeners for waiter call updates
      const socket = socketService.getSocket();
      
      socket.on('new_waiter_call', (newCall) => {
        console.log('New waiter call received:', newCall);
        // Add the new call to the top of the list if it doesn't already exist
        setWaiterCalls((prevCalls) => {
          const exists = prevCalls.some((call) => call.callId === newCall.callId);
          if (!exists) {
            return [newCall, ...prevCalls];
          }
          return prevCalls;
        });
      });
      
      socket.on('waiter_call_status_updated', (updatedCall) => {
        console.log('Waiter call status updated:', updatedCall);
        // Update the call in the list
        setWaiterCalls((prevCalls) => {
          return prevCalls.map((call) => {
            if (call.callId === updatedCall.callId) {
              return { ...call, status: updatedCall.status };
            }
            return call;
          });
        });
      });
      
      // Clean up on unmount
      return () => {
        socket.off('new_waiter_call');
        socket.off('waiter_call_status_updated');
      };
    }
  }, [restaurantData]);

  // Load waiter calls
  const loadWaiterCalls = async () => {
    try {
      setIsLoading(true);
      const response = await waiterService.getWaiterCalls();
      
      if (response && response.data && response.data.waiterCalls) {
        // Format the waiter calls to match the socket event format
        const formattedCalls = response.data.waiterCalls.map((call) => ({
          callId: call._id,
          restaurantId: call.restaurantId,
          tableId: call.tableId,
          tableName: call.tableName,
          customerName: call.customerName,
          message: call.message,
          createdAt: new Date(call.createdAt).toLocaleString(),
          status: call.status,
          rawDate: call.createdAt,
        }));
        
        setWaiterCalls(formattedCalls);
      }
    } catch (error) {
      console.error('Load waiter calls error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Acknowledge waiter call
  const acknowledgeWaiterCall = async (callId) => {
    try {
      setIsLoading(true);
      await waiterService.updateWaiterCallStatus({ callId, status: 'acknowledged' });
      
      // Update is handled by socket event
      
      return { success: true };
    } catch (error) {
      console.error('Acknowledge waiter call error:', error);
      return { success: false, message: 'An error occurred while acknowledging the waiter call' };
    } finally {
      setIsLoading(false);
    }
  };

  // Resolve waiter call
  const resolveWaiterCall = async (callId) => {
    try {
      setIsLoading(true);
      await waiterService.updateWaiterCallStatus({ callId, status: 'resolved' });
      
      // Update is handled by socket event
      
      return { success: true };
    } catch (error) {
      console.error('Resolve waiter call error:', error);
      return { success: false, message: 'An error occurred while resolving the waiter call' };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    waiterCalls,
    isLoading,
    loadWaiterCalls,
    acknowledgeWaiterCall,
    resolveWaiterCall,
  };

  return <WaiterCallContext.Provider value={value}>{children}</WaiterCallContext.Provider>;
};

// Custom hook to use the waiter call context
export const useWaiterCall = () => {
  const context = useContext(WaiterCallContext);
  if (!context) {
    throw new Error('useWaiterCall must be used within a WaiterCallProvider');
  }
  return context;
};

export default WaiterCallContext;
