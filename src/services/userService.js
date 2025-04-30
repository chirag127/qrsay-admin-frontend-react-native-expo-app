import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Fetches all users from the API
 * @returns {Promise<Object>} Promise that resolves to the users data
 */
export const getUsers = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_USERS);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

/**
 * Adds a new user
 * @param {Object} userData - The user data to add
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const addUser = async (userData) => {
    try {
        const response = await api.post(API_ENDPOINTS.ADD_USER, userData);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};

/**
 * Edits an existing user
 * @param {Object} userData - The user data to update
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const editUser = async (userData) => {
    try {
        const response = await api.patch(API_ENDPOINTS.EDIT_USER, userData);
        return response.data;
    } catch (error) {
        console.error("Error editing user:", error);
        throw error;
    }
};

/**
 * Deletes a user
 * @param {string} userId - The ID of the user to delete
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`${API_ENDPOINTS.DELETE_USER}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
