import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../constants";

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data including token
 */
export const login = async (email, password) => {
    try {
        console.log(`Attempting login for user: ${email}`);
        const response = await api.post(API_ENDPOINTS.LOGIN, {
            email,
            password,
        });

        if (response.data && response.data.data && response.data.data.token) {
            await AsyncStorage.setItem("token", response.data.data.token);
            await AsyncStorage.setItem(
                "user",
                JSON.stringify(response.data.data.user)
            );
            console.log("Login successful");
            return response.data.data;
        }

        throw new Error("Invalid response from server");
    } catch (error) {
        console.error("Login error:", error);
        // Extract meaningful error message from response if available
        const errorMessage =
            error.response?.data?.message || error.message || "Login failed";
        throw new Error(errorMessage);
    }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
    try {
        console.log("Registering new user");
        const response = await api.post(API_ENDPOINTS.REGISTER, userData);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Registration failed";
        throw new Error(errorMessage);
    }
};

/**
 * Request password reset for a user
 * @param {string} email - User's email
 * @returns {Promise<Object>} Response data
 */
export const forgotPassword = async (email) => {
    try {
        console.log(`Requesting password reset for: ${email}`);
        const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, {
            email,
        });
        return response.data;
    } catch (error) {
        console.error("Forgot password error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Password reset request failed";
        throw new Error(errorMessage);
    }
};

/**
 * Reset password with token
 * @param {string} password - New password
 * @param {string} token - Reset token
 * @returns {Promise<Object>} Response data
 */
export const resetPassword = async (password, token) => {
    try {
        console.log("Resetting password with token");
        const response = await api.patch(
            `${API_ENDPOINTS.RESET_PASSWORD}/${token}`,
            { password }
        );
        return response.data;
    } catch (error) {
        console.error("Reset password error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Password reset failed";
        throw new Error(errorMessage);
    }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response data
 */
export const changePassword = async (currentPassword, newPassword) => {
    try {
        console.log("Changing user password");
        const response = await api.patch(
            API_ENDPOINTS.CHANGE_PASSWORD || "/v1/user/updatePassword",
            {
                passwordCurrent: currentPassword,
                password: newPassword,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Change password error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Password change failed";
        throw new Error(errorMessage);
    }
};

/**
 * Logout user by removing stored credentials
 * @returns {Promise<boolean>} Success status
 */
export const logout = async () => {
    try {
        console.log("Logging out user");
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("restaurant");
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};

/**
 * Get current user data from storage
 * @returns {Promise<Object|null>} User data or null if not logged in
 */
export const getCurrentUser = async () => {
    try {
        const user = await AsyncStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Get current user error:", error);
        return null;
    }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} Authentication status
 */
export const isAuthenticated = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        return !!token;
    } catch (error) {
        console.error("Authentication check error:", error);
        return false;
    }
};
