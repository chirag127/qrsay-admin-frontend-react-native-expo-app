import api from "./api";
import { API_ENDPOINTS } from "../constants";

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
        console.log(`Updating waiter call status: ${callId} to ${status}`);
        const response = await api.patch(
            API_ENDPOINTS.UPDATE_WAITER_CALL_STATUS,
            {
                callId,
                status,
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating waiter call status: ${error.message}`);
        throw error;
    }
};

export const acknowledgeWaiterCall = async (callId) => {
    try {
        console.log(`Acknowledging waiter call with ID: ${callId}`);
        const response = await api.patch(
            API_ENDPOINTS.ACKNOWLEDGE_WAITER_CALL,
            {
                callId,
                status: "acknowledged",
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error acknowledging waiter call: ${error.message}`);
        throw error;
    }
};

export const resolveWaiterCall = async (callId) => {
    try {
        console.log(`Resolving waiter call with ID: ${callId}`);
        const response = await api.patch(API_ENDPOINTS.RESOLVE_WAITER_CALL, {
            callId,
            status: "resolved",
        });
        return response.data;
    } catch (error) {
        console.error(`Error resolving waiter call: ${error.message}`);
        throw error;
    }
};
