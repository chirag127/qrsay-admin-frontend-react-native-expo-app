import React, { createContext, useState, useEffect, useContext } from "react";
import * as orderService from "../services/orderService";
import socketService from "../services/socketService";
import { useAuth } from "./AuthContext";
import { ORDER_STATUS } from "../constants";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const { restaurant } = useAuth();
    const [pendingOrders, setPendingOrders] = useState([]);
    const [processingOrders, setProcessingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [cancelledOrders, setCancelledOrders] = useState([]);
    const [activeDineIn, setActiveDineIn] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (restaurant && restaurant._id) {
            // Initialize socket
            const socket = socketService.initializeSocket();

            // Join restaurant room
            socketService.joinRestaurantRoom(restaurant._id);

            // Listen for order updates
            socketService.listenForOrderUpdates((orderData) => {
                refreshOrders();
            });

            // Load initial orders
            refreshOrders();

            // Cleanup on unmount
            return () => {
                socketService.disconnectSocket();
            };
        }
    }, [restaurant]);

    const refreshOrders = async () => {
        try {
            setLoading(true);
            await fetchOrdersByStatus(ORDER_STATUS.PENDING);
            await fetchOrdersByStatus(ORDER_STATUS.PROCESSING);
            await fetchOrdersByStatus(ORDER_STATUS.COMPLETED);
            await fetchOrdersByStatus(ORDER_STATUS.CANCELLED);
            await fetchActiveDineIn();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrdersByStatus = async (status) => {
        try {
            const response = await orderService.getOrdersByStatus(status);

            // Check for the correct response structure from the backend
            // The backend returns data.orderData instead of data.orders
            if (response && response.data && response.data.orderData) {
                // Ensure all orders have the required properties with default values
                const orders = response.data.orderData.map((order) => ({
                    _id: order._id || "",
                    orderId: order.orderId || "",
                    customerName: order.customerName || "Anonymous",
                    orderStatus: order.orderStatus || status,
                    createdAt: order.createdAt || new Date().toISOString(),
                    totalAmount:
                        order.totalAmount !== undefined
                            ? Number(order.totalAmount)
                            : 0,
                    items: Array.isArray(order.items) ? order.items : [],
                    paymentStatus: order.paymentStatus || "pending",
                    paymentMethod: order.paymentMethod || "",
                    customerPreferences: {
                        preference:
                            order.customerPreferences?.preference || "N/A",
                        tableNumber:
                            order.customerPreferences?.tableNumber || "",
                        ...order.customerPreferences,
                    },
                    ...order,
                }));

                console.log(`Fetched ${orders.length} ${status} orders`);

                switch (status) {
                    case ORDER_STATUS.PENDING:
                        setPendingOrders(orders);
                        break;
                    case ORDER_STATUS.PROCESSING:
                        setProcessingOrders(orders);
                        break;
                    case ORDER_STATUS.COMPLETED:
                        setCompletedOrders(orders);
                        break;
                    case ORDER_STATUS.CANCELLED:
                        setCancelledOrders(orders);
                        break;
                    default:
                        break;
                }
            } else {
                // If no orders are found, set an empty array
                console.log(`No ${status} orders found`);
                switch (status) {
                    case ORDER_STATUS.PENDING:
                        setPendingOrders([]);
                        break;
                    case ORDER_STATUS.PROCESSING:
                        setProcessingOrders([]);
                        break;
                    case ORDER_STATUS.COMPLETED:
                        setCompletedOrders([]);
                        break;
                    case ORDER_STATUS.CANCELLED:
                        setCancelledOrders([]);
                        break;
                    default:
                        break;
                }
            }
        } catch (err) {
            console.error(`Error fetching ${status} orders:`, err);
            // Set empty array for the corresponding status on error
            switch (status) {
                case ORDER_STATUS.PENDING:
                    setPendingOrders([]);
                    break;
                case ORDER_STATUS.PROCESSING:
                    setProcessingOrders([]);
                    break;
                case ORDER_STATUS.COMPLETED:
                    setCompletedOrders([]);
                    break;
                case ORDER_STATUS.CANCELLED:
                    setCancelledOrders([]);
                    break;
                default:
                    break;
            }
            throw err;
        }
    };

    const fetchActiveDineIn = async () => {
        try {
            // This endpoint might be different in your API
            const response = await orderService.getOrdersByStatus("dineIn");

            if (response && response.data && response.data.orders) {
                // Ensure all orders have the required properties with default values
                const orders = response.data.orders.map((order) => ({
                    _id: order._id || "",
                    orderId: order.orderId || "",
                    customerName: order.customerName || "Anonymous",
                    orderStatus: order.orderStatus || "dineIn",
                    createdAt: order.createdAt || new Date().toISOString(),
                    totalAmount:
                        order.totalAmount !== undefined
                            ? Number(order.totalAmount)
                            : 0,
                    items: Array.isArray(order.items) ? order.items : [],
                    paymentStatus: order.paymentStatus || "pending",
                    paymentMethod: order.paymentMethod || "",
                    customerPreferences: {
                        preference:
                            order.customerPreferences?.preference || "Dine In",
                        tableNumber:
                            order.customerPreferences?.tableNumber || "",
                        ...order.customerPreferences,
                    },
                    ...order,
                }));

                console.log(`Fetched ${orders.length} active dine-in orders`);
                setActiveDineIn(orders);
            } else {
                console.log("No active dine-in orders found");
                setActiveDineIn([]);
            }
        } catch (err) {
            console.error("Error fetching active dine-in:", err);
            setActiveDineIn([]);
            throw err;
        }
    };

    const changeOrderStatus = async (orderId, status, reason = "") => {
        try {
            setLoading(true);
            setError(null);

            await orderService.changeOrderStatus(orderId, status, reason);

            // Refresh orders after status change
            await refreshOrders();

            return true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            setLoading(true);
            setError(null);

            await orderService.deleteOrder(orderId);

            // Refresh orders after deletion
            await refreshOrders();

            return true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider
            value={{
                pendingOrders,
                processingOrders,
                completedOrders,
                cancelledOrders,
                activeDineIn,
                loading,
                error,
                refreshOrders,
                changeOrderStatus,
                deleteOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrders must be used within an OrderProvider");
    }
    return context;
};

export default OrderContext;
