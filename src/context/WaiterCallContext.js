import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useRef,
} from "react";
import * as waiterCallService from "../services/waiterCallService";
import socketService from "../services/socketService";
import { useAuth } from "./AuthContext";
import { WAITER_CALL_STATUS, SOCKET_EVENTS } from "../constants";

const WaiterCallContext = createContext();

export const WaiterCallProvider = ({ children }) => {
    const { restaurant } = useAuth();
    const [waiterCalls, setWaiterCalls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Reference to store polling interval
    const pollingIntervalRef = useRef(null);

    // Socket reference
    const socketRef = useRef(null);

    // Setup socket connection and polling
    useEffect(() => {
        let isMounted = true;

        const setupSocketAndPolling = async () => {
            try {
                if (restaurant && restaurant._id) {
                    console.log(
                        `Setting up socket and polling for restaurant: ${restaurant._id}`
                    );

                    // Initialize socket if not already initialized
                    socketRef.current = socketService.initializeSocket();

                    if (socketRef.current) {
                        // Join restaurant room
                        socketService.joinRestaurantRoom(restaurant._id);

                        // Listen for new waiter calls
                        socketService.listenForWaiterCalls((callData) => {
                            try {
                                if (!isMounted) return;

                                console.log(
                                    "New waiter call received via socket:",
                                    callData
                                );

                                // Add the new call to the list
                                setWaiterCalls((prev) => {
                                    // Check if the call already exists to avoid duplicates
                                    const exists = prev.some(
                                        (call) =>
                                            call.callId === callData.callId
                                    );
                                    if (exists) {
                                        return prev;
                                    }
                                    return [callData, ...prev];
                                });
                            } catch (error) {
                                console.error(
                                    "Error handling new waiter call:",
                                    error
                                );
                            }
                        });

                        // Listen for waiter call status updates
                        socketService.listenForWaiterCallStatusUpdates(
                            (statusData) => {
                                try {
                                    if (!isMounted) return;

                                    console.log(
                                        "Waiter call status update received via socket:",
                                        statusData
                                    );

                                    // Update the status of the call in the list
                                    setWaiterCalls((prev) =>
                                        prev.map((call) =>
                                            call.callId === statusData.callId
                                                ? {
                                                      ...call,
                                                      status: statusData.status,
                                                      acknowledgedAt:
                                                          statusData.status ===
                                                          WAITER_CALL_STATUS.ACKNOWLEDGED
                                                              ? new Date()
                                                              : call.acknowledgedAt,
                                                      resolvedAt:
                                                          statusData.status ===
                                                          WAITER_CALL_STATUS.RESOLVED
                                                              ? new Date()
                                                              : call.resolvedAt,
                                                  }
                                                : call
                                        )
                                    );
                                } catch (error) {
                                    console.error(
                                        "Error handling waiter call status update:",
                                        error
                                    );
                                }
                            }
                        );
                    } else {
                        console.warn(
                            "Failed to initialize socket, will rely on polling"
                        );
                    }

                    // Load initial waiter calls
                    await fetchWaiterCalls();

                    // Set up polling every 10 seconds as a fallback
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                    }

                    pollingIntervalRef.current = setInterval(async () => {
                        try {
                            if (!isMounted) return;
                            console.log("Polling: Fetching waiter calls...");
                            await fetchWaiterCalls();
                        } catch (error) {
                            console.error("Error in polling interval:", error);
                        }
                    }, 10000); // 10 seconds
                }
            } catch (error) {
                console.error("Error setting up socket and polling:", error);
            }
        };

        setupSocketAndPolling();

        // Cleanup on unmount
        return () => {
            isMounted = false;

            // Clear polling interval
            if (pollingIntervalRef.current) {
                console.log("Clearing polling interval");
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }

            // Remove socket event listeners but don't disconnect
            // as it might affect other contexts
            if (socketRef.current) {
                console.log("Removing socket event listeners");
                socketRef.current.off(SOCKET_EVENTS.NEW_WAITER_CALL);
                socketRef.current.off(SOCKET_EVENTS.WAITER_CALL_STATUS_UPDATED);
            }
        };
    }, [restaurant]);

    /**
     * Fetches waiter calls from the server
     * @returns {Promise<Array>} Promise that resolves to an array of waiter calls
     */
    const fetchWaiterCalls = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Fetching waiter calls from server...");
            const response = await waiterCallService.getWaiterCalls();

            if (response && response.data && response.data.waiterCalls) {
                // Format the waiter calls data
                const formattedCalls = response.data.waiterCalls.map(
                    (call) => ({
                        callId: call._id,
                        restaurantId: call.restaurantId,
                        tableId: call.tableId,
                        tableName: call.tableName,
                        customerName: call.customerName,
                        message: call.message || "No message",
                        createdAt: new Date(call.createdAt).toLocaleString(),
                        status: call.status,
                        rawDate: new Date(call.createdAt),
                        acknowledgedAt: call.acknowledgedAt
                            ? new Date(call.acknowledgedAt)
                            : null,
                        resolvedAt: call.resolvedAt
                            ? new Date(call.resolvedAt)
                            : null,
                    })
                );

                // Sort by date (newest first)
                formattedCalls.sort((a, b) => b.rawDate - a.rawDate);

                console.log(`Fetched ${formattedCalls.length} waiter calls`);
                setWaiterCalls(formattedCalls);
                return formattedCalls;
            } else {
                console.warn("No waiter calls data in response:", response);
                return [];
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || err.message || "Unknown error";
            console.error("Error fetching waiter calls:", errorMessage, err);
            setError(errorMessage);
            throw err; // Re-throw for promise chaining
        } finally {
            setLoading(false);
        }
    };

    /**
     * Acknowledges a waiter call
     * @param {string} callId - The ID of the call to acknowledge
     * @returns {Promise<boolean>} Promise that resolves to true if successful
     */
    const acknowledgeCall = async (callId) => {
        try {
            if (!callId) {
                throw new Error("Call ID is required");
            }

            setLoading(true);
            setError(null);

            console.log(`Acknowledging waiter call: ${callId}`);
            await waiterCallService.acknowledgeWaiterCall(callId);

            // Update the call status in the local state
            setWaiterCalls((prev) =>
                prev.map((call) =>
                    call.callId === callId
                        ? {
                              ...call,
                              status: WAITER_CALL_STATUS.ACKNOWLEDGED,
                              acknowledgedAt: new Date(),
                          }
                        : call
                )
            );

            console.log(`Waiter call ${callId} acknowledged successfully`);
            return true;
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || err.message || "Unknown error";
            console.error(
                `Error acknowledging waiter call ${callId}:`,
                errorMessage,
                err
            );
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Resolves a waiter call
     * @param {string} callId - The ID of the call to resolve
     * @returns {Promise<boolean>} Promise that resolves to true if successful
     */
    const resolveCall = async (callId) => {
        try {
            if (!callId) {
                throw new Error("Call ID is required");
            }

            setLoading(true);
            setError(null);

            console.log(`Resolving waiter call: ${callId}`);
            await waiterCallService.resolveWaiterCall(callId);

            // Update the call status in the local state
            setWaiterCalls((prev) =>
                prev.map((call) =>
                    call.callId === callId
                        ? {
                              ...call,
                              status: WAITER_CALL_STATUS.RESOLVED,
                              resolvedAt: new Date(),
                          }
                        : call
                )
            );

            console.log(`Waiter call ${callId} resolved successfully`);
            return true;
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || err.message || "Unknown error";
            console.error(
                `Error resolving waiter call ${callId}:`,
                errorMessage,
                err
            );
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <WaiterCallContext.Provider
            value={{
                waiterCalls,
                loading,
                error,
                fetchWaiterCalls,
                acknowledgeCall,
                resolveCall,
            }}
        >
            {children}
        </WaiterCallContext.Provider>
    );
};

export const useWaiterCalls = () => {
    const context = useContext(WaiterCallContext);
    if (!context) {
        throw new Error(
            "useWaiterCalls must be used within a WaiterCallProvider"
        );
    }
    return context;
};

export default WaiterCallContext;
