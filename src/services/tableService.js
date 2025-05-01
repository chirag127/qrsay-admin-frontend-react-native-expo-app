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
 * @param {Object} tableData - The table data to update including the table ID
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const editTable = async (tableData) => {
    try {
        if (!tableData._id) {
            throw new Error("Table ID is required for editing a table");
        }

        // For editTableById endpoint, we need to include the ID in the URL or body
        // Check the backend implementation to determine the correct approach
        // Option 1: Include ID in URL
        // const url = `${API_ENDPOINTS.EDIT_TABLE}/${tableData._id}`;
        // const { _id, ...tableDataWithoutId } = tableData;
        // const response = await api.patch(url, tableDataWithoutId);

        // Option 2: Include ID in body (more common)
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
        if (!tableId) {
            throw new Error("Table ID is required for deleting a table");
        }

        // For deleteTableById endpoint, we need to include the ID in the URL
        const url = `${API_ENDPOINTS.DELETE_TABLE}/${tableId}`;
        const response = await api.delete(url);

        return response.data;
    } catch (error) {
        console.error("Error deleting table:", error);
        throw error;
    }
};
