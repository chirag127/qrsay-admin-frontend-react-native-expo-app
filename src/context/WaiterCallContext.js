import React, { createContext, useState, useEffect, useContext } from "react";
import * as waiterCallService from "../services/waiterCallService";
import socketService from "../services/socketService";
import { useAuth } from "./AuthContext";
import { WAITER_CALL_STATUS } from "../constants";

const WaiterCallContext = createContext();

export const WaiterCallProvider = ({ children }) => {
    const { restaurant } = useAuth();
    const [waiterCalls, setWaiterCalls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (restaurant && restaurant._id) {
            // Initialize socket if not already initialized
            const socket = socketService.initializeSocket();

            // Join restaurant room
            socketService.joinRestaurantRoom(restaurant._id);

            // Listen for new waiter calls
            socketService.listenForWaiterCalls((callData) => {
                // Add the new call to the list
                setWaiterCalls((prev) => [callData, ...prev]);
            });

            // Listen for waiter call status updates
            socketService.listenForWaiterCallStatusUpdates((statusData) => {
                // Update the status of the call in the list
                setWaiterCalls((prev) =>
                    prev.map((call) =>
                        call.callId === statusData.callId
                            ? { ...call, status: statusData.status }
                            : call
                    )
                );
            });

            // Load initial waiter calls
            fetchWaiterCalls();

            // Cleanup on unmount
            return () => {
                // No need to disconnect here as it might affect other contexts
            };
        }
    }, [restaurant]);

    const fetchWaiterCalls = async () => {
        try {
            setLoading(true);
            setError(null);

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
                    })
                );

                // Sort by date (newest first)
                formattedCalls.sort((a, b) => b.rawDate - a.rawDate);

                setWaiterCalls(formattedCalls);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.error("Error fetching waiter calls:", err);
        } finally {
            setLoading(false);
        }
    };

    const acknowledgeCall = async (callId) => {
        try {
            setLoading(true);
            setError(null);

            await waiterCallService.acknowledgeWaiterCall(callId);

            // Update the call status in the local state
            setWaiterCalls((prev) =>
                prev.map((call) =>
                    call.callId === callId
                        ? { ...call, status: WAITER_CALL_STATUS.ACKNOWLEDGED }
                        : call
                )
            );

            return true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resolveCall = async (callId) => {
        try {
            setLoading(true);
            setError(null);

            await waiterCallService.resolveWaiterCall(callId);

            // Update the call status in the local state
            setWaiterCalls((prev) =>
                prev.map((call) =>
                    call.callId === callId
                        ? { ...call, status: WAITER_CALL_STATUS.RESOLVED }
                        : call
                )
            );

            return true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
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
