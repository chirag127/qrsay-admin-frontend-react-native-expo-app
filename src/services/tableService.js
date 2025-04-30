import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Fetches all tables from the API
 * @returns {Promise<Object>} Promise that resolves to the tables data
 */
export const getTables = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_TABLES);
        return response.data;
    } catch (error) {
        console.error("Error fetching tables:", error);
        throw error;
    }
};

/**
 * Adds a new table
 * @param {Object} tableData - The table data to add
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const addTable = async (tableData) => {
    try {
        const response = await api.post(API_ENDPOINTS.ADD_TABLE, tableData);
        return response.data;
    } catch (error) {
        console.error("Error adding table:", error);
        throw error;
    }
};

/**
 * Edits an existing table
 * @param {Object} tableData - The table data to update
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const editTable = async (tableData) => {
    try {
        const response = await api.patch(API_ENDPOINTS.EDIT_TABLE, tableData);
        return response.data;
    } catch (error) {
        console.error("Error editing table:", error);
        throw error;
    }
};

/**
 * Deletes a table
 * @param {string} tableId - The ID of the table to delete
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const deleteTable = async (tableId) => {
    try {
        const response = await api.delete(`${API_ENDPOINTS.DELETE_TABLE}/${tableId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting table:", error);
        throw error;
    }
};
