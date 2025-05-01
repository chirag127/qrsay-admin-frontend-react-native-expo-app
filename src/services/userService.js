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
 * @param {Object} userData - The user data to update including the user ID
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const editUser = async (userData) => {
    try {
        if (!userData._id) {
            throw new Error("User ID is required for editing a user");
        }

        // Replace the :id placeholder with the actual user ID
        const url = API_ENDPOINTS.EDIT_USER.replace(":id", userData._id);

        // Remove the _id from the payload as it's already in the URL
        const { _id, ...userDataWithoutId } = userData;

        const response = await api.patch(url, userDataWithoutId);
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
        if (!userId) {
            throw new Error("User ID is required for deleting a user");
        }

        // Replace the :id placeholder with the actual user ID
        const url = API_ENDPOINTS.DELETE_USER.replace(":id", userId);

        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

/**
 * Gets a specific user by ID
 * @param {string} userId - The ID of the user to get
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const getUser = async (userId) => {
    try {
        if (!userId) {
            throw new Error("User ID is required for getting a user");
        }

        // Replace the :id placeholder with the actual user ID
        const url = API_ENDPOINTS.GET_USER.replace(":id", userId);

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
};
