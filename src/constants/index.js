import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

export const COLORS = {
    primary: "#FF8C00", // Orange color to match QRSay theme
    secondary: "#FFA500",
    background: "#F8F8F8",
    white: "#FFFFFF",
    black: "#000000",
    gray: "#808080",
    lightGray: "#D3D3D3",
    error: "#FF0000",
    success: "#4BB543",
    warning: "#FFC107",
    info: "#2196F3",
    text: "#333333",
    border: "#E0E0E0",
};

export const FONTS = {
    regular: "System",
    medium: "System",
    bold: "System",
};

export const SIZES = {
    base: 8,
    small: 12,
    font: 14,
    medium: 16,
    large: 18,
    extraLarge: 24,
};

export const ORDER_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};

export const WAITER_CALL_STATUS = {
    PENDING: "pending",
    ACKNOWLEDGED: "acknowledged",
    RESOLVED: "resolved",
};

export const API_ENDPOINTS = {
    // Auth
    LOGIN: "/v1/user/login",
    REGISTER: "/v1/user/signup",
    FORGOT_PASSWORD: "/v1/user/forgotPassword",
    RESET_PASSWORD: "/v1/user/resetPassword",

    // Restaurant
    RESTAURANT_PROFILE: "/v1/restaurant/restaurantDetail",
    UPDATE_RESTAURANT: "/v1/restaurant/restaurantDetail",
    CHANGE_RESTAURANT_STATUS: "/v1/restaurant/changeRestaurantStatus",

    // Orders
    GET_ORDERS_BY_STATUS: "/v1/orders/getRestaurantOrdersByStatus",
    CHANGE_ORDER_STATUS: "/v1/orders/changeOrderStatus",

    // Dishes
    GET_DISHES: "/v1/restaurant/dishes/getDishes",
    ADD_DISH: "/v1/restaurant/dishes/addDishes",
    EDIT_DISH: "/v1/restaurant/dishes/editDishes",
    DELETE_DISH: "/v1/restaurant/dishes/deleteDish",

    // Categories
    GET_CATEGORIES: "/v1/restaurant/dishes/getCategory",
    ADD_CATEGORY: "/v1/restaurant/dishes/addCategory",
    EDIT_CATEGORY: "/v1/restaurant/dishes/editCategory",
    DELETE_CATEGORY: "/v1/restaurant/dishes/deleteCategory",

    // Users
    GET_USERS: "/v1/admin/viewAllUsersOfRestaurant",
    ADD_USER: "/v1/user/createUser",
    EDIT_USER: "/v1/user/editUser",

    // Waiter Calls
    GET_WAITER_CALLS: "/v1/waiter/getWaiterCalls",
    UPDATE_WAITER_CALL_STATUS: "/v1/waiter/updateStatus",
    ACKNOWLEDGE_WAITER_CALL: "/v1/waiter/updateStatus",
    RESOLVE_WAITER_CALL: "/v1/waiter/updateStatus",
};

export const SOCKET_EVENTS = {
    JOIN_RESTAURANT_ROOM: "joinRestaurantRoom",
    JOINED_RESTAURANT_ROOM: "joined_restaurant_room",
    ORDER_PLACED: "orderPlaced",
    ORDER_UPDATE: "orderUpdate",
    ORDER_ACCEPTED_OR_REJECTED: "orderAcceptedOrRejected",
    NEW_WAITER_CALL: "new_waiter_call",
    WAITER_CALL_STATUS_UPDATED: "waiter_call_status_updated",
    WAITER_CALL_ACKNOWLEDGED: "waiter_call_acknowledged",
    WAITER_CALL_RESOLVED: "waiter_call_resolved",
};
