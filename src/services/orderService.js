import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Get orders by status
 * @param {string|string[]} status - The order status or array of statuses to filter by
 * @returns {Promise<Object>} Promise that resolves to the orders data
 */
export const getOrdersByStatus = async (status) => {
    try {
        // Ensure status is sent as an array named 'orderStatus' as expected by the backend
        const response = await api.put(API_ENDPOINTS.GET_ORDERS_BY_STATUS, {
            orderStatus: Array.isArray(status) ? status : [status],
        });
        return response.data;
    } catch (error) {
        console.error("Error in getOrdersByStatus:", error);
        throw error;
    }
};

/**
 * Get order by ID
 * @param {string} orderId - The ID of the order
 * @returns {Promise<Object>} Promise that resolves to the order data
 */
export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(
            `${API_ENDPOINTS.GET_ORDER_BY_ID}/${orderId}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error getting order ${orderId}:`, error);
        throw error;
    }
};

/**
 * Change order status
 * @param {string} orderId - The ID of the order
 * @param {string} status - The new status
 * @param {string} reason - Optional reason for status change
 * @returns {Promise<Object>} Promise that resolves to the updated order data
 */
export const changeOrderStatus = async (orderId, status, reason = "") => {
    try {
        console.log(`Changing order ${orderId} status to ${status}`);
        const response = await api.patch(API_ENDPOINTS.CHANGE_ORDER_STATUS, {
            orderId,
            status,
            reason,
        });
        return response.data;
    } catch (error) {
        console.error(`Error changing order status:`, error);
        throw error;
    }
};

/**
 * Delete order
 * @param {string} orderId - The ID of the order to delete
 * @returns {Promise<Object>} Promise that resolves to the deletion confirmation
 */
export const deleteOrder = async (orderId) => {
    try {
        console.log(`Deleting order ${orderId}`);
        const response = await api.delete(
            `${API_ENDPOINTS.DELETE_ORDER}/${orderId}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error);
        throw error;
    }
};

/**
 * Generate bill for an order
 * @param {string} orderId - The ID of the order
 * @returns {Promise<Object>} Promise that resolves to the bill data
 */
export const generateBill = async (orderId) => {
    try {
        console.log(`Generating bill for order ${orderId}`);
        const response = await api.get(
            `${API_ENDPOINTS.GENERATE_BILL}/${orderId}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error generating bill for order ${orderId}:`, error);
        throw error;
    }
};
