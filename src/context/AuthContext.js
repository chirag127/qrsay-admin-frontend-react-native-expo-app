import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../services/authService";
import * as restaurantService from "../services/restaurantService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const loadUserData = async () => {
            try {
                setLoading(true);
                const userData = await authService.getCurrentUser();

                if (userData) {
                    setUser(userData);

                    // Load restaurant data
                    try {
                        const restaurantData =
                            await restaurantService.getRestaurantDetail();
                        if (
                            restaurantData &&
                            restaurantData.data &&
                            restaurantData.data.restaurantDetail
                        ) {
                            const restaurantDetail =
                                restaurantData.data.restaurantDetail;
                            setRestaurant(restaurantDetail);

                            // Store restaurant data in AsyncStorage for other services to use
                            try {
                                await AsyncStorage.setItem(
                                    "restaurant",
                                    JSON.stringify(restaurantDetail)
                                );
                                console.log(
                                    "Restaurant data stored in AsyncStorage"
                                );
                            } catch (storageError) {
                                console.error(
                                    "Error storing restaurant data in AsyncStorage:",
                                    storageError
                                );
                            }

                            console.log("Restaurant data loaded successfully");
                        } else {
                            console.warn(
                                "Restaurant data structure is not as expected:",
                                restaurantData
                            );
                            // Set an empty restaurant object to prevent null references
                            setRestaurant({});

                            // Store empty restaurant object in AsyncStorage
                            try {
                                await AsyncStorage.setItem(
                                    "restaurant",
                                    JSON.stringify({})
                                );
                            } catch (storageError) {
                                console.error(
                                    "Error storing empty restaurant data in AsyncStorage:",
                                    storageError
                                );
                            }
                        }
                    } catch (restaurantError) {
                        console.error(
                            "Error loading restaurant data:",
                            restaurantError
                        );
                        // Set an empty restaurant object to prevent null references
                        setRestaurant({});
                    }
                }
            } catch (err) {
                console.error("Error loading user data:", err);
                setError(err.message || "Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const data = await authService.login(email, password);

            if (data && data.user) {
                setUser(data.user);

                // Load restaurant data
                try {
                    const restaurantData =
                        await restaurantService.getRestaurantDetail();
                    if (
                        restaurantData &&
                        restaurantData.data &&
                        restaurantData.data.restaurantDetail
                    ) {
                        const restaurantDetail =
                            restaurantData.data.restaurantDetail;
                        setRestaurant(restaurantDetail);

                        // Store restaurant data in AsyncStorage for other services to use
                        try {
                            await AsyncStorage.setItem(
                                "restaurant",
                                JSON.stringify(restaurantDetail)
                            );
                            console.log(
                                "Restaurant data stored in AsyncStorage after login"
                            );
                        } catch (storageError) {
                            console.error(
                                "Error storing restaurant data in AsyncStorage after login:",
                                storageError
                            );
                        }

                        console.log(
                            "Restaurant data loaded successfully after login"
                        );
                    } else {
                        console.warn(
                            "Restaurant data structure is not as expected after login:",
                            restaurantData
                        );
                        // Set an empty restaurant object to prevent null references
                        setRestaurant({});

                        // Store empty restaurant object in AsyncStorage
                        try {
                            await AsyncStorage.setItem(
                                "restaurant",
                                JSON.stringify({})
                            );
                        } catch (storageError) {
                            console.error(
                                "Error storing empty restaurant data in AsyncStorage after login:",
                                storageError
                            );
                        }
                    }
                } catch (restaurantError) {
                    console.error(
                        "Error loading restaurant data after login:",
                        restaurantError
                    );
                    // Set an empty restaurant object to prevent null references
                    setRestaurant({});
                }

                return data.user;
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message || err.message || "Login failed"
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const data = await authService.register(userData);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();

            // Clear restaurant data from AsyncStorage
            try {
                await AsyncStorage.removeItem("restaurant");
                console.log("Restaurant data cleared from AsyncStorage");
            } catch (storageError) {
                console.error(
                    "Error clearing restaurant data from AsyncStorage:",
                    storageError
                );
            }

            setUser(null);
            setRestaurant(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        try {
            setLoading(true);
            setError(null);

            const data = await authService.forgotPassword(email);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (password, token) => {
        try {
            setLoading(true);
            setError(null);

            const data = await authService.resetPassword(password, token);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            setLoading(true);
            setError(null);

            const data = await authService.changePassword(
                currentPassword,
                newPassword
            );
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateRestaurantData = async (restaurantData) => {
        try {
            setLoading(true);
            setError(null);

            const data = await restaurantService.updateRestaurantDetail(
                restaurantData
            );

            // Refresh restaurant data
            const updatedRestaurantData =
                await restaurantService.getRestaurantDetail();
            if (
                updatedRestaurantData &&
                updatedRestaurantData.data &&
                updatedRestaurantData.data.restaurantDetail
            ) {
                setRestaurant(updatedRestaurantData.data.restaurantDetail);
            }

            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changeRestaurantStatus = async (status) => {
        try {
            setLoading(true);
            setError(null);

            const data = await restaurantService.changeRestaurantStatus(status);

            // Update restaurant status in state
            setRestaurant((prev) => ({
                ...prev,
                restaurantStatus: status,
            }));

            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleDineInStatus = async (isDineInAvailable) => {
        try {
            setLoading(true);
            setError(null);

            const data = await restaurantService.toggleDineInStatus(
                isDineInAvailable
            );

            // Update dine-in status in state
            setRestaurant((prev) => ({
                ...prev,
                isDineInAvailableRestaurant: isDineInAvailable,
            }));

            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refreshRestaurantData = async () => {
        try {
            const restaurantData =
                await restaurantService.getRestaurantDetail();
            if (
                restaurantData &&
                restaurantData.data &&
                restaurantData.data.restaurantDetail
            ) {
                setRestaurant(restaurantData.data.restaurantDetail);
            }
        } catch (err) {
            console.error("Error refreshing restaurant data:", err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                restaurant,
                loading,
                error,
                login,
                register,
                logout,
                forgotPassword,
                resetPassword,
                changePassword,
                updateRestaurantData,
                changeRestaurantStatus,
                toggleDineInStatus,
                refreshRestaurantData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
