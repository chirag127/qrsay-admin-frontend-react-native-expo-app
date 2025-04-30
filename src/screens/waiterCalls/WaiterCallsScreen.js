import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import {
    Appbar,
    Card,
    Title,
    Paragraph,
    Badge,
    Button,
    Divider,
    Searchbar,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useWaiterCalls } from "../../context/WaiterCallContext";
import { COLORS, SIZES, WAITER_CALL_STATUS } from "../../constants";
import LoadingScreen from "../common/LoadingScreen";

const WaiterCallsScreen = ({ navigation }) => {
    const {
        waiterCalls,
        loading,
        error,
        fetchWaiterCalls,
        acknowledgeCall,
        resolveCall,
    } = useWaiterCalls();

    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCalls, setFilteredCalls] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        fetchWaiterCalls();
    }, []);

    useEffect(() => {
        filterCalls();
    }, [waiterCalls, searchQuery, activeTab]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchWaiterCalls();
        setRefreshing(false);
    };

    const filterCalls = () => {
        let filtered = [...waiterCalls];

        // Filter by status
        if (activeTab !== "all") {
            filtered = filtered.filter((call) => call.status === activeTab);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (call) =>
                    call.customerName.toLowerCase().includes(query) ||
                    call.tableName.toLowerCase().includes(query) ||
                    (call.message && call.message.toLowerCase().includes(query))
            );
        }

        setFilteredCalls(filtered);
    };

    const handleAcknowledgeCall = async (callId) => {
        try {
            await acknowledgeCall(callId);
            Alert.alert("Success", "Waiter call acknowledged successfully");
        } catch (error) {
            Alert.alert(
                "Error",
                error.message || "Failed to acknowledge waiter call"
            );
        }
    };

    const handleResolveCall = async (callId) => {
        try {
            await resolveCall(callId);
            Alert.alert("Success", "Waiter call resolved successfully");
        } catch (error) {
            Alert.alert(
                "Error",
                error.message || "Failed to resolve waiter call"
            );
        }
    };

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case WAITER_CALL_STATUS.PENDING:
                return styles.pendingBadge;
            case WAITER_CALL_STATUS.ACKNOWLEDGED:
                return styles.acknowledgedBadge;
            case WAITER_CALL_STATUS.RESOLVED:
                return styles.resolvedBadge;
            default:
                return styles.pendingBadge;
        }
    };

    const renderCallItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.callHeader}>
                    <View>
                        <Title style={styles.callTitle}>
                            {item.customerName}
                        </Title>
                        <Paragraph style={styles.callDate}>
                            {new Date(item.createdAt).toLocaleString()}
                        </Paragraph>
                    </View>
                    <Badge
                        style={[styles.badge, getStatusBadgeStyle(item.status)]}
                    >
                        {item.status}
                    </Badge>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Table:</Text>
                    <Text style={styles.infoValue}>{item.tableName}</Text>
                </View>

                {item.message && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Message:</Text>
                        <Text style={styles.infoValue}>{item.message}</Text>
                    </View>
                )}

                {item.acknowledgedAt && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Acknowledged:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(item.acknowledgedAt).toLocaleString()}
                        </Text>
                    </View>
                )}

                {item.resolvedAt && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Resolved:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(item.resolvedAt).toLocaleString()}
                        </Text>
                    </View>
                )}
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                {item.status === WAITER_CALL_STATUS.PENDING && (
                    <Button
                        mode="contained"
                        onPress={() => handleAcknowledgeCall(item.callId)}
                        style={styles.acknowledgeButton}
                        icon="check"
                    >
                        Acknowledge
                    </Button>
                )}

                {item.status !== WAITER_CALL_STATUS.RESOLVED && (
                    <Button
                        mode="contained"
                        onPress={() => handleResolveCall(item.callId)}
                        style={styles.resolveButton}
                        icon="check-all"
                    >
                        Resolve
                    </Button>
                )}
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
                <Appbar.Content title="Waiter Calls" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search waiter calls..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </View>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {/* Wrap TouchableOpacity in a try-catch to handle any potential errors */}
                    {(() => {
                        try {
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTab === "all" && styles.activeTab,
                                    ]}
                                    onPress={() => setActiveTab("all")}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab === "all" &&
                                                styles.activeTabText,
                                        ]}
                                    >
                                        All ({waiterCalls.length})
                                    </Text>
                                </TouchableOpacity>
                            );
                        } catch (error) {
                            console.error("Error rendering All tab:", error);
                            return (
                                <View style={styles.tab}>
                                    <Text style={styles.tabText}>
                                        All ({waiterCalls.length})
                                    </Text>
                                </View>
                            );
                        }
                    })()}

                    {(() => {
                        try {
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTab ===
                                            WAITER_CALL_STATUS.PENDING &&
                                            styles.activeTab,
                                    ]}
                                    onPress={() =>
                                        setActiveTab(WAITER_CALL_STATUS.PENDING)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab ===
                                                WAITER_CALL_STATUS.PENDING &&
                                                styles.activeTabText,
                                        ]}
                                    >
                                        Pending (
                                        {
                                            waiterCalls.filter(
                                                (call) =>
                                                    call.status ===
                                                    WAITER_CALL_STATUS.PENDING
                                            ).length
                                        }
                                        )
                                    </Text>
                                </TouchableOpacity>
                            );
                        } catch (error) {
                            console.error(
                                "Error rendering Pending tab:",
                                error
                            );
                            return (
                                <View style={styles.tab}>
                                    <Text style={styles.tabText}>
                                        Pending (
                                        {
                                            waiterCalls.filter(
                                                (call) =>
                                                    call.status ===
                                                    WAITER_CALL_STATUS.PENDING
                                            ).length
                                        }
                                        )
                                    </Text>
                                </View>
                            );
                        }
                    })()}

                    {(() => {
                        try {
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTab ===
                                            WAITER_CALL_STATUS.ACKNOWLEDGED &&
                                            styles.activeTab,
                                    ]}
                                    onPress={() =>
                                        setActiveTab(
                                            WAITER_CALL_STATUS.ACKNOWLEDGED
                                        )
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab ===
                                                WAITER_CALL_STATUS.ACKNOWLEDGED &&
                                                styles.activeTabText,
                                        ]}
                                    >
                                        Acknowledged (
                                        {
                                            waiterCalls.filter(
                                                (call) =>
                                                    call.status ===
                                                    WAITER_CALL_STATUS.ACKNOWLEDGED
                                            ).length
                                        }
                                        )
                                    </Text>
                                </TouchableOpacity>
                            );
                        } catch (error) {
                            console.error(
                                "Error rendering Acknowledged tab:",
                                error
                            );
                            return (
                                <View style={styles.tab}>
                                    <Text style={styles.tabText}>
                                        Acknowledged (
                                        {
                                            waiterCalls.filter(
                                                (call) =>
                                                    call.status ===
                                                    WAITER_CALL_STATUS.ACKNOWLEDGED
                                            ).length
                                        }
                                        )
                                    </Text>
                                </View>
                            );
                        }
                    })()}

                    {(() => {
                        try {
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTab ===
                                            WAITER_CALL_STATUS.RESOLVED &&
                                            styles.activeTab,
                                    ]}
                                    onPress={() =>
                                        setActiveTab(
                                            WAITER_CALL_STATUS.RESOLVED
                                        )
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab ===
                                                WAITER_CALL_STATUS.RESOLVED &&
                                                styles.activeTabText,
                                        ]}
                                    >
                                        Resolved (
                                        {
                                            waiterCalls.filter(
                                                (call) =>
                                                    call.status ===
                                                    WAITER_CALL_STATUS.RESOLVED
                                            ).length
                                        }
                                        )
                                    </Text>
                                </TouchableOpacity>
                            );
                        } catch (error) {
                            console.error(
                                "Error rendering Resolved tab:",
                                error
                            );
                            return (
                                <View style={styles.tab}>
                                    <Text style={styles.tabText}>
                                        Resolved (
                                        {
                                            waiterCalls.filter(
                                                (call) =>
                                                    call.status ===
                                                    WAITER_CALL_STATUS.RESOLVED
                                            ).length
                                        }
                                        )
                                    </Text>
                                </View>
                            );
                        }
                    })()}
                </ScrollView>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={filteredCalls}
                keyExtractor={(item) => item.callId}
                renderItem={renderCallItem}
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
                            name="call-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>
                            No waiter calls found
                        </Text>
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
    searchContainer: {
        padding: SIZES.medium,
        backgroundColor: COLORS.white,
    },
    searchbar: {
        elevation: 0,
        backgroundColor: COLORS.background,
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
    listContent: {
        padding: SIZES.medium,
        paddingBottom: SIZES.extraLarge,
    },
    card: {
        marginBottom: SIZES.medium,
    },
    callHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    callTitle: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    callDate: {
        fontSize: SIZES.small,
        color: COLORS.gray,
    },
    badge: {
        fontSize: SIZES.small,
    },
    pendingBadge: {
        backgroundColor: COLORS.warning,
    },
    acknowledgedBadge: {
        backgroundColor: COLORS.info,
    },
    resolvedBadge: {
        backgroundColor: COLORS.success,
    },
    divider: {
        marginVertical: SIZES.base,
    },
    infoRow: {
        flexDirection: "row",
        marginVertical: SIZES.base / 2,
    },
    infoLabel: {
        width: 100,
        fontWeight: "bold",
        color: COLORS.gray,
    },
    infoValue: {
        flex: 1,
        color: COLORS.text,
    },
    cardActions: {
        justifyContent: "flex-end",
    },
    acknowledgeButton: {
        marginRight: SIZES.base,
        backgroundColor: COLORS.info,
    },
    resolveButton: {
        backgroundColor: COLORS.success,
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

export default WaiterCallsScreen;
