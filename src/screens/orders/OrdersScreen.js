import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
} from "react-native";
import {
    Appbar,
    Card,
    Title,
    Paragraph,
    Badge,
    Button,
    Divider,
    Chip,
    Searchbar,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useOrders } from "../../context/OrderContext";
import { COLORS, SIZES, ORDER_STATUS } from "../../constants";
import LoadingScreen from "../common/LoadingScreen";

const OrdersScreen = ({ navigation }) => {
    const {
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        loading,
        error,
        refreshOrders,
    } = useOrders();

    const [activeTab, setActiveTab] = useState(ORDER_STATUS.PENDING);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        refreshOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [
        activeTab,
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        searchQuery,
    ]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshOrders();
        setRefreshing(false);
    };

    const filterOrders = () => {
        let orders = [];

        switch (activeTab) {
            case ORDER_STATUS.PENDING:
                orders = pendingOrders;
                break;
            case ORDER_STATUS.PROCESSING:
                orders = processingOrders;
                break;
            case ORDER_STATUS.COMPLETED:
                orders = completedOrders;
                break;
            case ORDER_STATUS.CANCELLED:
                orders = cancelledOrders;
                break;
            default:
                orders = pendingOrders;
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            orders = orders.filter(
                (order) =>
                    order.orderId.toLowerCase().includes(query) ||
                    order.customerName.toLowerCase().includes(query) ||
                    (order.customerPreferences.tableNumber &&
                        order.customerPreferences.tableNumber
                            .toString()
                            .includes(query))
            );
        }

        setFilteredOrders(orders);
    };

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case ORDER_STATUS.PENDING:
                return styles.pendingBadge;
            case ORDER_STATUS.PROCESSING:
                return styles.processingBadge;
            case ORDER_STATUS.COMPLETED:
                return styles.completedBadge;
            case ORDER_STATUS.CANCELLED:
                return styles.cancelledBadge;
            default:
                return styles.pendingBadge;
        }
    };

    const renderOrderItem = ({ item }) => (
        <Card
            style={styles.card}
            onPress={() =>
                navigation.navigate("OrderDetails", { orderId: item._id })
            }
        >
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View>
                        <Title style={styles.cardTitle}>
                            Order #{item.orderId}
                        </Title>
                        <Paragraph style={styles.cardDate}>
                            {new Date(item.createdAt).toLocaleString()}
                        </Paragraph>
                    </View>
                    <Badge
                        style={[
                            styles.badge,
                            getStatusBadgeStyle(item.orderStatus),
                        ]}
                    >
                        {item.orderStatus}
                    </Badge>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Customer:</Text>
                    <Text style={styles.infoValue}>{item.customerName}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Type:</Text>
                    <Text style={styles.infoValue}>
                        {item.customerPreferences.preference}
                    </Text>
                </View>

                {item.customerPreferences.preference.toLowerCase() ===
                    "dine in" && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Table:</Text>
                        <Text style={styles.infoValue}>
                            {item.customerPreferences.tableNumber}
                        </Text>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total:</Text>
                    <Text style={styles.infoValue}>
                        ₹{item.totalAmount.toFixed(2)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Items:</Text>
                    <Text style={styles.infoValue}>{item.items.length}</Text>
                </View>

                <View style={styles.paymentInfo}>
                    <Chip
                        icon={
                            item.paymentStatus === "paid"
                                ? "check-circle"
                                : "clock-outline"
                        }
                        style={
                            item.paymentStatus === "paid"
                                ? styles.paidChip
                                : styles.pendingChip
                        }
                    >
                        {item.paymentStatus === "paid"
                            ? "Paid"
                            : "Payment Pending"}
                    </Chip>

                    <Chip icon="credit-card" style={styles.paymentMethodChip}>
                        {item.paymentMethod}
                    </Chip>
                </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="contained"
                    onPress={() =>
                        navigation.navigate("OrderDetails", {
                            orderId: item._id,
                        })
                    }
                    style={styles.viewButton}
                >
                    View Details
                </Button>
            </Card.Actions>
        </Card>
    );

    if (loading && !refreshing) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Action
                    icon="menu"
                    onPress={() => navigation.openDrawer()}
                />
                <Appbar.Content title="Orders" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === ORDER_STATUS.PENDING &&
                                styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(ORDER_STATUS.PENDING)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === ORDER_STATUS.PENDING &&
                                    styles.activeTabText,
                            ]}
                        >
                            Pending ({pendingOrders.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === ORDER_STATUS.PROCESSING &&
                                styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(ORDER_STATUS.PROCESSING)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === ORDER_STATUS.PROCESSING &&
                                    styles.activeTabText,
                            ]}
                        >
                            Processing ({processingOrders.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === ORDER_STATUS.COMPLETED &&
                                styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(ORDER_STATUS.COMPLETED)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === ORDER_STATUS.COMPLETED &&
                                    styles.activeTabText,
                            ]}
                        >
                            Completed ({completedOrders.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === ORDER_STATUS.CANCELLED &&
                                styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(ORDER_STATUS.CANCELLED)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === ORDER_STATUS.CANCELLED &&
                                    styles.activeTabText,
                            ]}
                        >
                            Cancelled ({cancelledOrders.length})
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search orders..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item._id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="receipt-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
    },
    tabContainer: {
        backgroundColor: COLORS.white,
        paddingVertical: SIZES.base,
    },
    tab: {
        paddingVertical: SIZES.base,
        paddingHorizontal: SIZES.medium,
        marginHorizontal: SIZES.base,
        borderRadius: SIZES.base,
        backgroundColor: COLORS.lightGray,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: SIZES.font,
        color: COLORS.text,
    },
    activeTabText: {
        color: COLORS.white,
        fontWeight: "bold",
    },
    searchContainer: {
        padding: SIZES.medium,
        backgroundColor: COLORS.white,
    },
    searchbar: {
        elevation: 0,
        backgroundColor: COLORS.background,
    },
    listContent: {
        padding: SIZES.medium,
        paddingBottom: SIZES.extraLarge,
    },
    card: {
        marginBottom: SIZES.medium,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    cardTitle: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    cardDate: {
        fontSize: SIZES.small,
        color: COLORS.gray,
    },
    badge: {
        fontSize: SIZES.small,
    },
    pendingBadge: {
        backgroundColor: COLORS.warning,
    },
    processingBadge: {
        backgroundColor: COLORS.info,
    },
    completedBadge: {
        backgroundColor: COLORS.success,
    },
    cancelledBadge: {
        backgroundColor: COLORS.error,
    },
    divider: {
        marginVertical: SIZES.base,
    },
    infoRow: {
        flexDirection: "row",
        marginVertical: SIZES.base / 2,
    },
    infoLabel: {
        width: 80,
        fontWeight: "bold",
        color: COLORS.gray,
    },
    infoValue: {
        flex: 1,
        color: COLORS.text,
    },
    paymentInfo: {
        flexDirection: "row",
        marginTop: SIZES.base,
    },
    paidChip: {
        backgroundColor: "#E8F5E9",
        marginRight: SIZES.base,
    },
    pendingChip: {
        backgroundColor: "#FFF8E1",
        marginRight: SIZES.base,
    },
    paymentMethodChip: {
        backgroundColor: "#E3F2FD",
    },
    cardActions: {
        justifyContent: "flex-end",
    },
    viewButton: {
        backgroundColor: COLORS.primary,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: SIZES.extraLarge * 2,
    },
    emptyText: {
        marginTop: SIZES.medium,
        fontSize: SIZES.medium,
        color: COLORS.gray,
        textAlign: "center",
    },
    errorContainer: {
        padding: SIZES.medium,
        backgroundColor: COLORS.error,
    },
    errorText: {
        color: COLORS.white,
        textAlign: "center",
    },
});

export default OrdersScreen;
