import api from "./api";
import { API_ENDPOINTS } from "../constants";

export const getDishes = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_DISHES);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDishById = async (dishId) => {
    try {
        const response = await api.get(
            `/v1/restaurant/dishes/getDishById/${dishId}`
        );
        return response.data;
    } catch (error) {
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
