import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import env from "../config/environment";

// Base URL for API requests
const API_URL = env.apiUrl;

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});     

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors (token expired)
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            // Clear token and redirect to login
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("userDetail");

            // Navigation will be handled by the auth context

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
