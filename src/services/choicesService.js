import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Fetches all choices from the API
 * @returns {Promise<Object>} Promise that resolves to the choices data
 */
export const getChoices = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_CHOICES);
        return response.data;
    } catch (error) {
        console.error("Error fetching choices:", error);
        throw error;
    }
};

/**
 * Adds a new choice
 * @param {Object} choiceData - The choice data to add
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const addChoice = async (choiceData) => {
    try {
        const response = await api.post(API_ENDPOINTS.ADD_CHOICE, choiceData);
        return response.data;
    } catch (error) {
        console.error("Error adding choice:", error);
        throw error;
    }
};

/**
 * Edits an existing choice
 * @param {Object} choiceData - The choice data to update
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const editChoice = async (choiceData) => {
    try {
        const response = await api.patch(API_ENDPOINTS.EDIT_CHOICE, choiceData);
        return response.data;
    } catch (error) {
        console.error("Error editing choice:", error);
        throw error;
    }
};

/**
 * Deletes a choice
 * @param {string} choiceId - The ID of the choice to delete
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const deleteChoice = async (choiceId) => {
    try {
        const response = await api.delete(
            `${API_ENDPOINTS.DELETE_CHOICE}/${choiceId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting choice:", error);
        throw error;
    }
};

/**
 * Adds a new option to a choice
 * @param {Object} optionData - The option data to add including choiceId, name, and price
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const addOption = async (optionData) => {
    try {
        const response = await api.post(
            `${API_ENDPOINTS.ADD_CHOICE}/options`,
            optionData
        );
        return response.data;
    } catch (error) {
        console.error("Error adding option:", error);
        throw error;
    }
};

/**
 * Edits an existing option
 * @param {Object} optionData - The option data to update including choiceId, optionId, name, and price
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const editOption = async (optionData) => {
    try {
        const response = await api.patch(
            `${API_ENDPOINTS.EDIT_CHOICE}/options`,
            optionData
        );
        return response.data;
    } catch (error) {
        console.error("Error editing option:", error);
        throw error;
    }
};

/**
 * Deletes an option from a choice
 * @param {string} choiceId - The ID of the choice
 * @param {string} optionId - The ID of the option to delete
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const deleteOption = async (choiceId, optionId) => {
    try {
        const response = await api.delete(
            `${API_ENDPOINTS.DELETE_CHOICE}/options/${choiceId}/${optionId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting option:", error);
        throw error;
    }
};
