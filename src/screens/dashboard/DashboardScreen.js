import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { Card, Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useRestaurant } from "../../context/RestaurantContext";
import { useOrder } from "../../context/OrderContext";
import { useWaiterCall } from "../../context/WaiterCallContext";
import Header from "../../components/common/Header";

const DashboardScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const {
        restaurantData,
        restaurantStatus,
        dineInStatus,
        updateRestaurantStatus,
        updateDineInStatus,
    } = useRestaurant();
    const {
        pendingOrders,
        processingOrders,
        activeDineIn,
        loadOrders,
        loadActiveDineIn,
        isLoading: ordersLoading,
    } = useOrder();
    const {
        waiterCalls,
        loadWaiterCalls,
        acknowledgeWaiterCall,
        resolveWaiterCall,
        isLoading: waiterCallsLoading,
    } = useWaiterCall();

    const [activeTab, setActiveTab] = useState("tab1");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await loadOrders();
        await loadActiveDineIn();
        await loadWaiterCalls();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const selectTab = (tab) => {
        setActiveTab(tab);
    };

    const toggleRestaurantStatus = async () => {
        const newStatus = restaurantStatus === "online" ? "offline" : "online";
        await updateRestaurantStatus(newStatus);
    };

    const toggleDineInStatus = async () => {
        await updateDineInStatus(!dineInStatus);
    };

    const renderOrderItem = (item) => {
        return (
            <Card containerStyle={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>
                        Order #{item.orderId}
                    </Text>
                    <Badge
                        value={item.orderStatus.toUpperCase()}
                        status={
                            item.orderStatus === "pending"
                                ? "warning"
                                : "primary"
                        }
                        containerStyle={styles.badge}
                    />
                </View>

                <View style={styles.orderInfo}>
                    <Text style={styles.orderInfoText}>
                        <Text style={styles.orderInfoLabel}>Customer: </Text>
                        {item.customerName || "N/A"}
                    </Text>
                    <Text style={styles.orderInfoText}>
                        <Text style={styles.orderInfoLabel}>Type: </Text>
                        {item.customerPreferences?.preference || "N/A"}
                    </Text>
                    <Text style={styles.orderInfoText}>
                        <Text style={styles.orderInfoLabel}>Items: </Text>
                        {item.orderItems?.length || 0}
                    </Text>
                    <Text style={styles.orderInfoText}>
                        <Text style={styles.orderInfoLabel}>Total: </Text>$
                        {item.totalAmount?.toFixed(2) || "0.00"}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() =>
                        navigation.navigate("OrdersStack", {
                            screen: "OrderDetail",
                            params: { orderId: item._id },
                        })
                    }
                >
                    <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    const renderDineInItem = (item) => {
        return (
            <Card containerStyle={styles.dineInCard}>
                <View style={styles.dineInHeader}>
                    <Text style={styles.tableName}>Table {item.tableName}</Text>
                    <Badge
                        value="ACTIVE"
                        status="success"
                        containerStyle={styles.badge}
                    />
                </View>

                <View style={styles.dineInInfo}>
                    <Text style={styles.dineInInfoText}>
                        <Text style={styles.dineInInfoLabel}>Customer: </Text>
                        {item.customerName || "N/A"}
                    </Text>
                    <Text style={styles.dineInInfoText}>
                        <Text style={styles.dineInInfoLabel}>Guests: </Text>
                        {item.numberOfGuests || "1"}
                    </Text>
                    <Text style={styles.dineInInfoText}>
                        <Text style={styles.dineInInfoLabel}>Started: </Text>
                        {new Date(item.createdAt).toLocaleTimeString()}
                    </Text>
                </View>
            </Card>
        );
    };

    const renderWaiterCallItem = (item) => {
        return (
            <Card containerStyle={styles.waiterCallCard}>
                <View style={styles.waiterCallHeader}>
                    <Text style={styles.tableName}>Table {item.tableName}</Text>
                    <Badge
                        value={item.status.toUpperCase()}
                        status={
                            item.status === "pending" ? "warning" : "primary"
                        }
                        containerStyle={styles.badge}
                    />
                </View>

                <View style={styles.waiterCallInfo}>
                    <Text style={styles.waiterCallInfoText}>
                        <Text style={styles.waiterCallInfoLabel}>
                            Customer:{" "}
                        </Text>
                        {item.customerName || "N/A"}
                    </Text>
                    {item.message ? (
                        <Text style={styles.waiterCallInfoText}>
                            <Text style={styles.waiterCallInfoLabel}>
                                Message:{" "}
                            </Text>
                            {item.message}
                        </Text>
                    ) : null}
                    <Text style={styles.waiterCallInfoText}>
                        <Text style={styles.waiterCallInfoLabel}>Time: </Text>
                        {item.createdAt}
                    </Text>
                </View>

                <View style={styles.waiterCallActions}>
                    {item.status === "pending" && (
                        <TouchableOpacity
                            style={[
                                styles.waiterCallButton,
                                styles.acknowledgeButton,
                            ]}
                            onPress={() => acknowledgeWaiterCall(item.callId)}
                        >
                            <Text style={styles.waiterCallButtonText}>
                                Acknowledge
                            </Text>
                        </TouchableOpacity>
                    )}

                    {item.status !== "resolved" && (
                        <TouchableOpacity
                            style={[
                                styles.waiterCallButton,
                                styles.resolveButton,
                            ]}
                            onPress={() => resolveWaiterCall(item.callId)}
                        >
                            <Text style={styles.waiterCallButtonText}>
                                Resolve
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Dashboard" />

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.statusContainer}>
                    <Card containerStyle={styles.statusCard}>
                        <Text style={styles.statusTitle}>
                            Restaurant Status
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                restaurantStatus === "online"
                                    ? styles.onlineButton
                                    : styles.offlineButton,
                            ]}
                            onPress={toggleRestaurantStatus}
                        >
                            <Text style={styles.statusButtonText}>
                                {restaurantStatus === "online"
                                    ? "Online"
                                    : "Offline"}
                            </Text>
                        </TouchableOpacity>
                    </Card>

                    <Card containerStyle={styles.statusCard}>
                        <Text style={styles.statusTitle}>Dine-In Status</Text>
                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                dineInStatus
                                    ? styles.onlineButton
                                    : styles.offlineButton,
                            ]}
                            onPress={toggleDineInStatus}
                        >
                            <Text style={styles.statusButtonText}>
                                {dineInStatus ? "Available" : "Unavailable"}
                            </Text>
                        </TouchableOpacity>
                    </Card>
                </View>

                <Card containerStyle={styles.tabsCard}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                activeTab === "tab1" && styles.activeTabButton,
                            ]}
                            onPress={() => selectTab("tab1")}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "tab1" &&
                                        styles.activeTabButtonText,
                                ]}
                            >
                                Order Received ({pendingOrders.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                activeTab === "tab3" && styles.activeTabButton,
                            ]}
                            onPress={() => selectTab("tab3")}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "tab3" &&
                                        styles.activeTabButtonText,
                                ]}
                            >
                                Order In Process ({processingOrders.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                activeTab === "tab4" && styles.activeTabButton,
                            ]}
                            onPress={() => selectTab("tab4")}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "tab4" &&
                                        styles.activeTabButtonText,
                                ]}
                            >
                                Table Status ({activeDineIn.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                activeTab === "tab5" && styles.activeTabButton,
                            ]}
                            onPress={() => selectTab("tab5")}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "tab5" &&
                                        styles.activeTabButtonText,
                                ]}
                            >
                                Call Waiter ({waiterCalls.length})
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Card>

                <View style={styles.tabContent}>
                    {activeTab === "tab1" && (
                        <View>
                            {ordersLoading ? (
                                <ActivityIndicator
                                    size={50}
                                    color="#ff6b00"
                                    style={styles.loader}
                                />
                            ) : pendingOrders.length > 0 ? (
                                pendingOrders.map((order) =>
                                    renderOrderItem(order)
                                )
                            ) : (
                                <Text style={styles.emptyText}>
                                    There are currently no order received.
                                </Text>
                            )}
                        </View>
                    )}

                    {activeTab === "tab3" && (
                        <View>
                            {ordersLoading ? (
                                <ActivityIndicator
                                    size={50}
                                    color="#ff6b00"
                                    style={styles.loader}
                                />
                            ) : processingOrders.length > 0 ? (
                                processingOrders.map((order) =>
                                    renderOrderItem(order)
                                )
                            ) : (
                                <Text style={styles.emptyText}>
                                    There are currently no orders in process.
                                </Text>
                            )}
                        </View>
                    )}

                    {activeTab === "tab4" && (
                        <View>
                            {ordersLoading ? (
                                <ActivityIndicator
                                    size={50}
                                    color="#ff6b00"
                                    style={styles.loader}
                                />
                            ) : activeDineIn.length > 0 ? (
                                activeDineIn.map((dineIn) =>
                                    renderDineInItem(dineIn)
                                )
                            ) : (
                                <Text style={styles.emptyText}>
                                    There are currently no active dine-in
                                    tables.
                                </Text>
                            )}
                        </View>
                    )}

                    {activeTab === "tab5" && (
                        <View>
                            {waiterCallsLoading ? (
                                <ActivityIndicator
                                    size={50}
                                    color="#ff6b00"
                                    style={styles.loader}
                                />
                            ) : waiterCalls.length > 0 ? (
                                waiterCalls.map((call) =>
                                    renderWaiterCallItem(call)
                                )
                            ) : (
                                <Text style={styles.emptyText}>
                                    There are currently no waiter calls.
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    statusCard: {
        width: "48%",
        padding: 10,
        margin: 0,
        marginBottom: 10,
    },
    statusTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    statusButton: {
        padding: 8,
        borderRadius: 5,
        alignItems: "center",
    },
    onlineButton: {
        backgroundColor: "#4CAF50",
    },
    offlineButton: {
        backgroundColor: "#F44336",
    },
    statusButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    tabsCard: {
        padding: 0,
        margin: 10,
    },
    tabButton: {
        padding: 15,
        minWidth: 120,
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: "#ff6b00",
    },
    tabButtonText: {
        textAlign: "center",
        color: "#666",
    },
    activeTabButtonText: {
        color: "#ff6b00",
        fontWeight: "bold",
    },
    tabContent: {
        padding: 10,
    },
    loader: {
        marginTop: 20,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        color: "#666",
    },
    orderCard: {
        borderRadius: 5,
        padding: 15,
        marginBottom: 10,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    orderNumber: {
        fontWeight: "bold",
        fontSize: 16,
    },
    badge: {
        marginLeft: 10,
    },
    orderInfo: {
        marginBottom: 15,
    },
    orderInfoText: {
        marginBottom: 5,
    },
    orderInfoLabel: {
        fontWeight: "bold",
    },
    viewButton: {
        backgroundColor: "#ff6b00",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    viewButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    dineInCard: {
        borderRadius: 5,
        padding: 15,
        marginBottom: 10,
    },
    dineInHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    tableName: {
        fontWeight: "bold",
        fontSize: 16,
    },
    dineInInfo: {
        marginBottom: 5,
    },
    dineInInfoText: {
        marginBottom: 5,
    },
    dineInInfoLabel: {
        fontWeight: "bold",
    },
    waiterCallCard: {
        borderRadius: 5,
        padding: 15,
        marginBottom: 10,
    },
    waiterCallHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    waiterCallInfo: {
        marginBottom: 15,
    },
    waiterCallInfoText: {
        marginBottom: 5,
    },
    waiterCallInfoLabel: {
        fontWeight: "bold",
    },
    waiterCallActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    waiterCallButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
    },
    acknowledgeButton: {
        backgroundColor: "#2196F3",
    },
    resolveButton: {
        backgroundColor: "#4CAF50",
    },
    waiterCallButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default DashboardScreen;
