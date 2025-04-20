import api from './api';
import { API_ENDPOINTS } from '../constants';

export const getWaiterCalls = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_WAITER_CALLS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWaiterCallStatus = async (callId, status) => {
  try {
    const response = await api.patch(API_ENDPOINTS.UPDATE_WAITER_CALL_STATUS, {
      callId,
      status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
