import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Fetches all customers from the API
 * @returns {Promise<Object>} Promise that resolves to the customers data
 */
export const getCustomers = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_CUSTOMERS);
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

/**
 * Fetches details for a specific customer
 * @param {string} customerId - The ID of the customer
 * @returns {Promise<Object>} Promise that resolves to the customer details
 */
export const getCustomerDetails = async (customerId) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.GET_CUSTOMER_DETAILS}/${customerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching customer details:", error);
        throw error;
    }
};
