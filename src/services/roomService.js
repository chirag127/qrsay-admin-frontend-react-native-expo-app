import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Fetches all rooms from the API
 * @returns {Promise<Object>} Promise that resolves to the rooms data
 */
export const getRooms = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_ROOMS);
        return response.data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
};

/**
 * Adds a new room
 * @param {Object} roomData - The room data to add
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const addRoom = async (roomData) => {
    try {
        const response = await api.post(API_ENDPOINTS.ADD_ROOM, roomData);
        return response.data;
    } catch (error) {
        console.error("Error adding room:", error);
        throw error;
    }
};

/**
 * Edits an existing room
 * @param {Object} roomData - The room data to update
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const editRoom = async (roomData) => {
    try {
        const response = await api.patch(API_ENDPOINTS.EDIT_ROOM, roomData);
        return response.data;
    } catch (error) {
        console.error("Error editing room:", error);
        throw error;
    }
};

/**
 * Deletes a room
 * @param {string} roomId - The ID of the room to delete
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const deleteRoom = async (roomId) => {
    try {
        const response = await api.delete(`${API_ENDPOINTS.DELETE_ROOM}/${roomId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting room:", error);
        throw error;
    }
};
