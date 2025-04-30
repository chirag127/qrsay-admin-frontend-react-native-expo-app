import api from "./api";
import { API_ENDPOINTS } from "../constants";

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

export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(
            `/v1/orders/getOrderwithOrderId/${orderId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changeOrderStatus = async (orderId, status, reason = "") => {
    try {
        const response = await api.patch(API_ENDPOINTS.CHANGE_ORDER_STATUS, {
            orderId,
            status,
            reason,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteOrder = async (orderId) => {
    try {
        const response = await api.delete(
            `/v1/orders/deleteOrderById/${orderId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
