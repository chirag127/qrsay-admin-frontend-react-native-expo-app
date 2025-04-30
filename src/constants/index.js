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
    GET_ORDERS_BY_STATUS: "/v1/orders/getRestaurantOrdersByStatus", // This is a PUT request, not GET
    CHANGE_ORDER_STATUS: "/v1/orders/changeOrderStatus",
    GET_ORDER_BY_ID: "/v1/orders/getOrderwithOrderId", // Add orderId as path parameter
    DELETE_ORDER: "/v1/orders/deleteOrderById", // Add orderId as path parameter
    GENERATE_BILL: "/v1/orders/generateBill", // Add orderId as path parameter

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

    // Extras
    GET_EXTRAS: "/v1/restaurant/dishes/getExtras",
    ADD_EXTRA: "/v1/restaurant/dishes/addExtra",
    EDIT_EXTRA: "/v1/restaurant/dishes/editExtra",
    DELETE_EXTRA: "/v1/restaurant/dishes/deleteExtra",

    // Choices
    GET_CHOICES: "/v1/restaurant/dishes/getChoices",
    ADD_CHOICE: "/v1/restaurant/dishes/addChoice",
    EDIT_CHOICE: "/v1/restaurant/dishes/editChoice",
    DELETE_CHOICE: "/v1/restaurant/dishes/deleteChoice",

    // Tables
    GET_TABLES: "/v1/restaurant/getAllTables",
    ADD_TABLE: "/v1/restaurant/createTableEntry",
    EDIT_TABLE: "/v1/restaurant/editTableById",
    DELETE_TABLE: "/v1/restaurant/deleteTableById",

    // Rooms
    GET_ROOMS: "/v1/restaurant/getAllRooms",
    ADD_ROOM: "/v1/restaurant/createRoomEntry",
    EDIT_ROOM: "/v1/restaurant/editRoomById",
    DELETE_ROOM: "/v1/restaurant/deleteRoomById",

    // Users
    GET_USERS: "/v1/admin/viewAllUsersOfRestaurant",
    ADD_USER: "/v1/user/createUser",
    EDIT_USER: "/v1/user/editUser",
    DELETE_USER: "/v1/user/deleteUser",

    // Customers
    GET_CUSTOMERS: "/v1/customer/getCustomers",
    GET_CUSTOMER_DETAILS: "/v1/customer/getCustomerDetails",

    // Reviews
    GET_REVIEWS: "/v1/restaurant/reviews",
    REPLY_TO_REVIEW: "/v1/restaurant/replyToReview",

    // Waiter Calls
    GET_WAITER_CALLS: "/v1/waiter/getWaiterCalls", // Protected route requiring authentication
    GET_WAITER_CALLS_PUBLIC: "/v1/waiter/getWaiterCallsPublic", // Public route for testing
    UPDATE_WAITER_CALL_STATUS: "/v1/waiter/updateStatus", // PATCH request with callId and status in body
    CALL_WAITER: "/v1/waiter/callWaiter", // POST request for customers to call a waiter
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
