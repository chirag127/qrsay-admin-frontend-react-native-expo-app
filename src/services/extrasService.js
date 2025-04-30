import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Fetches all extras from the API
 * @returns {Promise<Object>} Promise that resolves to the extras data
 */
export const getExtras = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_EXTRAS);
        return response.data;
    } catch (error) {
        console.error("Error fetching extras:", error);
        throw error;
    }
};

/**
 * Adds a new extra
 * @param {Object} extraData - The extra data to add
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const addExtra = async (extraData) => {
    try {
        const response = await api.post(API_ENDPOINTS.ADD_EXTRA, extraData);
        return response.data;
    } catch (error) {
        console.error("Error adding extra:", error);
        throw error;
    }
};

/**
 * Edits an existing extra
 * @param {Object} extraData - The extra data to update
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const editExtra = async (extraData) => {
    try {
        const response = await api.patch(API_ENDPOINTS.EDIT_EXTRA, extraData);
        return response.data;
    } catch (error) {
        console.error("Error editing extra:", error);
        throw error;
    }
};

/**
 * Deletes an extra
 * @param {string} extraId - The ID of the extra to delete
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const deleteExtra = async (extraId) => {
    try {
        const response = await api.delete(`${API_ENDPOINTS.DELETE_EXTRA}/${extraId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting extra:", error);
        throw error;
    }
};
