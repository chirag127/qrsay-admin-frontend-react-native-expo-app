import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Fetches dishes from the restaurant profile data
 * This is a workaround since there's no direct getDishes endpoint
 */
export const getDishes = async () => {
    try {
        // Get restaurant details which includes dishes data
        const response = await api.get(API_ENDPOINTS.RESTAURANT_PROFILE);

        // Extract dishes from restaurant data
        if (response.data && response.data.data) {
            const restaurantData = response.data.data;

            // Transform the data to match the expected format
            const dishes = [];

            // Check if cuisine array exists and has items
            if (restaurantData.cuisine && restaurantData.cuisine.length > 0) {
                // Iterate through each category
                restaurantData.cuisine.forEach((category) => {
                    // Check if this category has items
                    if (category.items && category.items.length > 0) {
                        // Add each dish with its category information
                        category.items.forEach((dish) => {
                            dishes.push({
                                ...dish,
                                category: {
                                    _id: category._id,
                                    name: category.categoryName,
                                },
                            });
                        });
                    }
                });
            }

            // Return in the expected format
            return {
                data: {
                    dishes: dishes,
                },
            };
        }

        // If no data is found, return an empty array
        return { data: { dishes: [] } };
    } catch (error) {
        console.error("Error in getDishes:", error);
        throw error;
    }
};

/**
 * Gets a specific dish by ID by first fetching all dishes
 * and then filtering for the requested dish
 */
export const getDishById = async (dishId) => {
    try {
        // Get all dishes first
        const allDishesResponse = await getDishes();
        const allDishes = allDishesResponse.data.dishes;

        // Find the specific dish by ID
        const dish = allDishes.find((d) => d._id === dishId);

        if (dish) {
            return {
                data: {
                    dish: dish,
                },
            };
        } else {
            throw new Error("Dish not found");
        }
    } catch (error) {
        console.error("Error in getDishById:", error);
        throw error;
    }
};

export const addDish = async (dishData) => {
    try {
        const response = await api.post(API_ENDPOINTS.ADD_DISH, dishData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editDish = async (dishData) => {
    try {
        const response = await api.patch(API_ENDPOINTS.EDIT_DISH, dishData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteDish = async (dishId) => {
    try {
        const response = await api.delete(
            `${API_ENDPOINTS.DELETE_DISH}/${dishId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_CATEGORIES);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await api.post(
            API_ENDPOINTS.ADD_CATEGORY,
            categoryData
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editCategory = async (categoryData) => {
    try {
        const response = await api.patch(
            API_ENDPOINTS.EDIT_CATEGORY,
            categoryData
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const response = await api.delete(
            `${API_ENDPOINTS.DELETE_CATEGORY}/${categoryId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
