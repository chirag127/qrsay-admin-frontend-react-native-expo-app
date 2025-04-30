import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Image,
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
    FAB,
    Dialog,
    Portal,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants";
import LoadingScreen from "../common/LoadingScreen";
import * as dishService from "../../services/dishService";

const DishesScreen = ({ navigation }) => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        fetchDishes();
    }, []);

    useEffect(() => {
        filterDishes();
    }, [dishes, searchQuery]);

    /**
     * Fetches dishes from the restaurant profile
     * Handles errors and provides appropriate feedback
     * Includes retry mechanism for resilience
     */
    const fetchDishes = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await dishService.getDishes();

            if (response && response.data && response.data.dishes) {
                setDishes(response.data.dishes);
                console.log(
                    `Successfully loaded ${response.data.dishes.length} dishes`
                );
                // Reset retry count on success
                setRetryCount(0);
            } else {
                setDishes([]);
                console.log("No dishes found in the response");
            }
        } catch (err) {
            // Provide more detailed error information
            let errorMessage = "Failed to load dishes";

            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage = `Server error: ${err.response.status} - ${
                    err.response.data?.message || "Unknown error"
                }`;
                console.error("Error response:", err.response.data);
            } else if (err.request) {
                // The request was made but no response was received
                errorMessage =
                    "No response from server. Please check your connection.";
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = err.message || "An unknown error occurred";
            }

            setError(errorMessage);
            console.error("Error fetching dishes:", err);

            // Implement retry logic (max 3 retries)
            if (retryCount < 3) {
                const nextRetryCount = retryCount + 1;
                setRetryCount(nextRetryCount);

                // Exponential backoff: 2^retryCount * 1000 ms
                const retryDelay = Math.pow(2, retryCount) * 1000;
                console.log(
                    `Retrying in ${retryDelay}ms (Attempt ${nextRetryCount}/3)`
                );

                setTimeout(() => {
                    console.log(`Executing retry attempt ${nextRetryCount}`);
                    fetchDishes();
                }, retryDelay);

                // Update error message to indicate retry
                setError(`${errorMessage} - Retrying... (${nextRetryCount}/3)`);
            }
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDishes();
        setRefreshing(false);
    };

    const filterDishes = () => {
        if (!searchQuery) {
            setFilteredDishes(dishes);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = dishes.filter(
            (dish) =>
                dish.name.toLowerCase().includes(query) ||
                dish.category.name.toLowerCase().includes(query) ||
                dish.description.toLowerCase().includes(query)
        );

        setFilteredDishes(filtered);
    };

    const handleDeleteDish = async () => {
        if (!selectedDish) return;

        try {
            await dishService.deleteDish(selectedDish._id);
            setDishes(dishes.filter((dish) => dish._id !== selectedDish._id));
            setDeleteDialogVisible(false);
            setSelectedDish(null);
        } catch (error) {
            console.error("Error deleting dish:", error);
            setError("Failed to delete dish");
        }
    };

    const renderDishItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.dishHeader}>
                    <View style={styles.dishInfo}>
                        <Title style={styles.dishTitle}>{item.name}</Title>
                        <Paragraph style={styles.dishCategory}>
                            {item.category.name}
                        </Paragraph>
                    </View>
                    <Badge
                        style={[
                            styles.badge,
                            item.available
                                ? styles.availableBadge
                                : styles.unavailableBadge,
                        ]}
                    >
                        {item.available ? "Available" : "Unavailable"}
                    </Badge>
                </View>

                {item.image && (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.dishImage}
                    />
                )}

                <Paragraph style={styles.dishDescription}>
                    {item.description || "No description available"}
                </Paragraph>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price:</Text>
                    <Text style={styles.priceValue}>
                        ₹{item.price.toFixed(2)}
                    </Text>
                </View>

                {item.variants && item.variants.length > 0 && (
                    <View style={styles.variantsContainer}>
                        <Text style={styles.variantsLabel}>Variants:</Text>
                        {item.variants.map((variant, index) => (
                            <View key={index} style={styles.variantItem}>
                                <Text style={styles.variantName}>
                                    {variant.name}
                                </Text>
                                <Text style={styles.variantPrice}>
                                    ₹{variant.price.toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="outlined"
                    onPress={() =>
                        navigation.navigate("EditDish", { dishId: item._id })
                    }
                    style={styles.editButton}
                    icon="pencil"
                >
                    Edit
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => {
                        setSelectedDish(item);
                        setDeleteDialogVisible(true);
                    }}
                    style={styles.deleteButton}
                    icon="delete"
                >
                    Delete
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
                <Appbar.Content title="Dishes" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search dishes..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    {retryCount >= 3 && (
                        <Button
                            mode="contained"
                            onPress={() => {
                                setRetryCount(0);
                                fetchDishes();
                            }}
                            style={styles.retryButton}
                            icon="refresh"
                        >
                            Retry Manually
                        </Button>
                    )}
                </View>
            )}

            <FlatList
                data={filteredDishes}
                keyExtractor={(item) => item._id}
                renderItem={renderDishItem}
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
                            name="restaurant-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>No dishes found</Text>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate("AddDish")}
                            style={styles.addButton}
                            icon="plus"
                        >
                            Add New Dish
                        </Button>
                    </View>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                color={COLORS.white}
                onPress={() => navigation.navigate("AddDish")}
            />

            <Portal>
                <Dialog
                    visible={deleteDialogVisible}
                    onDismiss={() => setDeleteDialogVisible(false)}
                >
                    <Dialog.Title>Delete Dish</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Are you sure you want to delete "
                            {selectedDish?.name}"?
                        </Paragraph>
                        <Paragraph>This action cannot be undone.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleDeleteDish} color={COLORS.error}>
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    listContent: {
        padding: SIZES.medium,
        paddingBottom: SIZES.extraLarge * 2,
    },
    card: {
        marginBottom: SIZES.medium,
    },
    dishHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    dishInfo: {
        flex: 1,
    },
    dishTitle: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    dishCategory: {
        fontSize: SIZES.small,
        color: COLORS.gray,
    },
    badge: {
        fontSize: SIZES.small,
    },
    availableBadge: {
        backgroundColor: COLORS.success,
    },
    unavailableBadge: {
        backgroundColor: COLORS.error,
    },
    dishImage: {
        width: "100%",
        height: 200,
        borderRadius: SIZES.base,
        marginVertical: SIZES.base,
    },
    dishDescription: {
        marginVertical: SIZES.base,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: SIZES.base,
    },
    priceLabel: {
        fontSize: SIZES.font,
        fontWeight: "bold",
        marginRight: SIZES.base,
    },
    priceValue: {
        fontSize: SIZES.font,
        color: COLORS.primary,
        fontWeight: "bold",
    },
    variantsContainer: {
        marginTop: SIZES.base,
    },
    variantsLabel: {
        fontSize: SIZES.font,
        fontWeight: "bold",
        marginBottom: SIZES.base / 2,
    },
    variantItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: SIZES.base / 2,
        paddingHorizontal: SIZES.base,
        backgroundColor: "#F5F5F5",
        borderRadius: SIZES.base / 2,
        marginBottom: SIZES.base / 2,
    },
    variantName: {
        fontSize: SIZES.small,
    },
    variantPrice: {
        fontSize: SIZES.small,
        fontWeight: "bold",
    },
    cardActions: {
        justifyContent: "flex-end",
    },
    editButton: {
        marginRight: SIZES.base,
        borderColor: COLORS.primary,
    },
    deleteButton: {
        borderColor: COLORS.error,
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
        marginBottom: SIZES.medium,
    },
    addButton: {
        backgroundColor: COLORS.primary,
    },
    fab: {
        position: "absolute",
        margin: SIZES.medium,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primary,
    },
    errorContainer: {
        padding: SIZES.medium,
        backgroundColor: COLORS.error,
        alignItems: "center",
    },
    errorText: {
        color: COLORS.white,
        textAlign: "center",
        marginBottom: SIZES.base,
    },
    retryButton: {
        marginTop: SIZES.base,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.base,
    },
});

export default DishesScreen;
