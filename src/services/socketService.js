import io from "socket.io-client";
import { SOCKET_URL } from "@env";
import { SOCKET_EVENTS } from "../constants";

// Socket instance
let socket = null;
// Track reconnection attempts
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
// Store interval ID for ping mechanism
let pingIntervalId = null;

/**
 * Safely sends a ping to the server if socket is connected
 */
const sendPing = () => {
    try {
        // Only send ping if socket exists and is connected
        if (socket && socket.connected) {
            socket.emit("ping_socket", {
                timestamp: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error("Error sending ping:", error);
    }
};

/**
 * Initializes the socket connection and sets up event listeners
 * @returns {Object|null} The socket instance or null if initialization fails
 */
export const initializeSocket = () => {
    try {
        if (!socket) {
            console.log("Initializing socket connection...");

            // Get socket URL from environment or use default
            const socketUrl = SOCKET_URL || "http://localhost:3000";
            console.log(`Socket URL: ${socketUrl}`);

            // Create socket instance with robust configuration
            socket = io(socketUrl, {
                transports: ["websocket"],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: Infinity,
                timeout: 10000,
            });

            // Set up event listeners
            socket.on("connect", () => {
                console.log("Socket connected successfully");
                reconnectAttempts = 0; // Reset reconnect attempts on successful connection
            });

            socket.on("disconnect", (reason) => {
                console.log(`Socket disconnected: ${reason}`);

                // If the disconnection was initiated by the server, try to reconnect
                if (reason === "io server disconnect") {
                    console.log(
                        "Server disconnected the socket, attempting to reconnect..."
                    );
                    try {
                        socket.connect();
                    } catch (error) {
                        console.error("Error reconnecting socket:", error);
                    }
                }
            });

            socket.on("connect_error", (error) => {
                reconnectAttempts++;
                console.log(
                    `Socket connection error (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}):`,
                    error.message
                );

                // If we've exceeded max reconnect attempts, try a different transport
                if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                    console.log(
                        "Max reconnect attempts reached, trying polling transport..."
                    );
                    try {
                        if (socket && socket.io && socket.io.opts) {
                            socket.io.opts.transports = [
                                "polling",
                                "websocket",
                            ];
                        }
                    } catch (error) {
                        console.error("Error changing transport:", error);
                    }
                }
            });

            // Setup ping/pong mechanism to keep connection alive
            if (pingIntervalId) {
                clearInterval(pingIntervalId);
            }

            pingIntervalId = setInterval(() => {
                sendPing();
            }, 30000); // Send a ping every 30 seconds

            socket.on("pong_socket", (data) => {
                console.log("Received pong from server:", data);
            });
        }

        return socket;
    } catch (error) {
        console.error("Error initializing socket:", error);
        return null;
    }
};

/**
 * Joins a restaurant room to receive restaurant-specific events
 * @param {string} restaurantId - The ID of the restaurant to join
 */
export const joinRestaurantRoom = (restaurantId) => {
    try {
        if (!socket) {
            console.warn("Cannot join restaurant room: Socket not initialized");
            return;
        }

        if (!restaurantId) {
            console.warn(
                "Cannot join restaurant room: No restaurant ID provided"
            );
            return;
        }

        socket.emit(SOCKET_EVENTS.JOIN_RESTAURANT_ROOM, restaurantId);
        console.log(`Joining restaurant room: ${restaurantId}`);
    } catch (error) {
        console.error(`Error joining restaurant room ${restaurantId}:`, error);
    }
};

/**
 * Listens for order updates
 * @param {Function} callback - Function to call when an order update is received
 */
export const listenForOrderUpdates = (callback) => {
    try {
        if (!socket) {
            console.warn(
                "Cannot listen for order updates: Socket not initialized"
            );
            return;
        }

        if (typeof callback !== "function") {
            console.warn(
                "Cannot listen for order updates: Callback is not a function"
            );
            return;
        }

        // Remove any existing listeners to prevent duplicates
        socket.off(SOCKET_EVENTS.ORDER_UPDATE);

        // Add the new listener
        socket.on(SOCKET_EVENTS.ORDER_UPDATE, (data) => {
            try {
                console.log("Received order update event:", data);
                callback(data);
            } catch (error) {
                console.error("Error in order update callback:", error);
            }
        });
    } catch (error) {
        console.error("Error setting up order update listener:", error);
    }
};

/**
 * Listens for new waiter calls
 * @param {Function} callback - Function to call when a new waiter call is received
 */
export const listenForWaiterCalls = (callback) => {
    try {
        if (!socket) {
            console.warn(
                "Cannot listen for waiter calls: Socket not initialized"
            );
            return;
        }

        if (typeof callback !== "function") {
            console.warn(
                "Cannot listen for waiter calls: Callback is not a function"
            );
            return;
        }

        // Remove any existing listeners to prevent duplicates
        socket.off(SOCKET_EVENTS.NEW_WAITER_CALL);

        // Add the new listener
        socket.on(SOCKET_EVENTS.NEW_WAITER_CALL, (data) => {
            try {
                console.log("Received new waiter call event:", data);
                callback(data);
            } catch (error) {
                console.error("Error in waiter call callback:", error);
            }
        });
    } catch (error) {
        console.error("Error setting up waiter call listener:", error);
    }
};

/**
 * Listens for waiter call status updates
 * @param {Function} callback - Function to call when a waiter call status update is received
 */
export const listenForWaiterCallStatusUpdates = (callback) => {
    try {
        if (!socket) {
            console.warn(
                "Cannot listen for waiter call status updates: Socket not initialized"
            );
            return;
        }

        if (typeof callback !== "function") {
            console.warn(
                "Cannot listen for waiter call status updates: Callback is not a function"
            );
            return;
        }

        // Remove any existing listeners to prevent duplicates
        socket.off(SOCKET_EVENTS.WAITER_CALL_STATUS_UPDATED);

        // Add the new listener
        socket.on(SOCKET_EVENTS.WAITER_CALL_STATUS_UPDATED, (data) => {
            try {
                console.log("Received waiter call status update event:", data);
                callback(data);
            } catch (error) {
                console.error(
                    "Error in waiter call status update callback:",
                    error
                );
            }
        });
    } catch (error) {
        console.error(
            "Error setting up waiter call status update listener:",
            error
        );
    }
};

/**
 * Disconnects the socket and cleans up resources
 */
export const disconnectSocket = () => {
    try {
        // Clear the ping interval
        if (pingIntervalId) {
            console.log("Clearing ping interval");
            clearInterval(pingIntervalId);
            pingIntervalId = null;
        }

        // Disconnect the socket
        if (socket) {
            console.log("Disconnecting socket");

            // Remove all listeners
            socket.off();

            // Disconnect
            socket.disconnect();
            socket = null;

            console.log("Socket disconnected and cleaned up");
        }
    } catch (error) {
        console.error("Error disconnecting socket:", error);
    }
};

export default {
    initializeSocket,
    joinRestaurantRoom,
    listenForOrderUpdates,
    listenForWaiterCalls,
    listenForWaiterCallStatusUpdates,
    disconnectSocket,
};
