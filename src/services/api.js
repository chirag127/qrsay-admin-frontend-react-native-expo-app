import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

// Log the API URL being used
console.log(`API URL: ${API_URL || "http://localhost:3000/api"}`);

const api = axios.create({
    baseURL: API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    // Increase timeout for slower connections
    timeout: 15000,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
    async (config) => {
        try {
            // Log the request for debugging
            console.log(
                `API Request: ${config.method.toUpperCase()} ${config.url}`
            );

            const token = await AsyncStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error("Error in request interceptor:", error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        // Log successful responses for debugging
        console.log(
            `API Response: ${
                response.status
            } ${response.config.method.toUpperCase()} ${response.config.url}`
        );
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error has a response
        if (error.response) {
            // Log detailed error information
            console.error("API Error:", {
                url: originalRequest?.url,
                method: originalRequest?.method,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
            });

            // Handle 401 Unauthorized errors
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                console.log("Unauthorized access, clearing credentials");

                // Clear token and redirect to login
                try {
                    await AsyncStorage.removeItem("token");
                    await AsyncStorage.removeItem("user");
                } catch (storageError) {
                    console.error("Error clearing storage:", storageError);
                }

                // The navigation to login will be handled by the auth context
                return Promise.reject(error);
            }

            // Handle 400 Bad Request errors with more details
            if (error.response.status === 400) {
                console.error(
                    "Bad Request Error Details:",
                    error.response.data
                );
            }

            // Handle 404 Not Found errors
            if (error.response.status === 404) {
                console.error("Resource Not Found:", originalRequest?.url);
            }

            // Handle 500 Server errors
            if (error.response.status >= 500) {
                console.error("Server Error:", error.response.data);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", {
                url: originalRequest?.url,
                method: originalRequest?.method,
                error: error.message,
            });
        } else {
            // Something happened in setting up the request
            console.error("Request setup error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
