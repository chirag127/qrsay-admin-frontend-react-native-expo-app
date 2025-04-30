import api from "./api";
import { API_ENDPOINTS } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get all active waiter calls for the restaurant
 * @returns {Promise<Object>} Promise that resolves to the waiter calls data
 */
export const getWaiterCalls = async () => {
    try {
        // Get the restaurant ID from user data in AsyncStorage
        const userDataString = await AsyncStorage.getItem("user");
        const userData = userDataString ? JSON.parse(userDataString) : null;
        const restaurantId = userData?.restaurantKey;

        if (!restaurantId) {
            throw new Error("Restaurant ID not found in user data");
        }

        // Try the authenticated endpoint first
        try {
            const response = await api.get(API_ENDPOINTS.GET_WAITER_CALLS, {
                params: { restaurantId },
            });
            return response.data;
        } catch (error) {
            console.warn(
                "Authenticated waiter calls endpoint failed, trying public endpoint",
                error
            );

            // Fall back to the public endpoint if the authenticated one fails
            const publicResponse = await api.get(
                API_ENDPOINTS.GET_WAITER_CALLS_PUBLIC,
                {
                    params: { restaurantId },
                }
            );
            return publicResponse.data;
        }
    } catch (error) {
        console.error("Error fetching waiter calls:", error);
        throw error;
    }
};

/**
 * Update the status of a waiter call
 * @param {string} callId - The ID of the waiter call
 * @param {string} status - The new status (acknowledged or resolved)
 * @returns {Promise<Object>} Promise that resolves to the updated waiter call data
 */
export const updateWaiterCallStatus = async (callId, status) => {
    try {
        // Get the restaurant ID from user data in AsyncStorage
        const userDataString = await AsyncStorage.getItem("user");
        const userData = userDataString ? JSON.parse(userDataString) : null;
        const restaurantId = userData?.restaurantKey;

        if (!restaurantId) {
            throw new Error("Restaurant ID not found in user data");
        }

        console.log(`Updating waiter call status: ${callId} to ${status}`);
        const response = await api.patch(
            API_ENDPOINTS.UPDATE_WAITER_CALL_STATUS,
            {
                callId,
                status,
                restaurantId,
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating waiter call status: ${error.message}`);
        throw error;
    }
};

/**
 * Acknowledge a waiter call
 * @param {string} callId - The ID of the waiter call
 * @returns {Promise<Object>} Promise that resolves to the updated waiter call data
 */
export const acknowledgeWaiterCall = async (callId) => {
    try {
        console.log(`Acknowledging waiter call with ID: ${callId}`);
        return await updateWaiterCallStatus(callId, "acknowledged");
    } catch (error) {
        console.error(`Error acknowledging waiter call: ${error.message}`);
        throw error;
    }
};

/**
 * Resolve a waiter call
 * @param {string} callId - The ID of the waiter call
 * @returns {Promise<Object>} Promise that resolves to the updated waiter call data
 */
export const resolveWaiterCall = async (callId) => {
    try {
        console.log(`Resolving waiter call with ID: ${callId}`);
        return await updateWaiterCallStatus(callId, "resolved");
    } catch (error) {
        console.error(`Error resolving waiter call: ${error.message}`);
        throw error;
    }
};
