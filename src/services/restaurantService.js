import api from "./api";
import { API_ENDPOINTS } from "../constants";

export const getRestaurantDetail = async () => {
    try {
        console.log(
            "Fetching restaurant details from:",
            API_ENDPOINTS.RESTAURANT_PROFILE
        );
        const response = await api.get(API_ENDPOINTS.RESTAURANT_PROFILE);
        console.log("Restaurant details response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching restaurant details:", error);
        // If the error is a 404, it might be because the user doesn't have a restaurant yet
        if (error.response && error.response.status === 404) {
            // Return an empty restaurant object to prevent app crashes
            return { data: { restaurantDetail: {} } };
        }
        throw error;
    }
};

export const updateRestaurantDetail = async (restaurantData) => {
    try {
        // The endpoint expects a POST request according to the backend route
        const response = await api.post(
            API_ENDPOINTS.UPDATE_RESTAURANT,
            restaurantData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating restaurant details:", error);
        throw error;
    }
};

export const changeRestaurantStatus = async (status) => {
    try {
        const response = await api.patch(
            API_ENDPOINTS.CHANGE_RESTAURANT_STATUS,
            {
                restaurantStatus: status,
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const toggleDineInStatus = async (isDineInAvailable) => {
    try {
        const response = await api.patch(API_ENDPOINTS.UPDATE_RESTAURANT, {
            isDineInAvailableRestaurant: isDineInAvailable,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
