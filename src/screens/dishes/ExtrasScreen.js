import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from "react-native";
import {
    Appbar,
    Card,
    Title,
    Button,
    Divider,
    TextInput,
    FAB,
    Dialog,
    Portal,
    Paragraph,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants";
import LoadingScreen from "../common/LoadingScreen";
import * as extrasService from "../../services/extrasService";

const ExtrasScreen = ({ navigation }) => {
    const [extras, setExtras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Dialog states
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedExtra, setSelectedExtra] = useState(null);
    const [extraName, setExtraName] = useState("");
    const [extraPrice, setExtraPrice] = useState("");

    useEffect(() => {
        fetchExtras();
    }, []);

    const fetchExtras = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await extrasService.getExtras();

            if (response && response.data && response.data.extras) {
                setExtras(response.data.extras);
            } else {
                setExtras([]);
            }
        } catch (err) {
            setError(err.message || "Failed to load extras");
            console.error("Error fetching extras:", err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchExtras();
        setRefreshing(false);
    };

    const handleAddExtra = async () => {
        if (!extraName.trim()) {
            Alert.alert("Error", "Extra name cannot be empty");
            return;
        }

        if (
            !extraPrice.trim() ||
            isNaN(parseFloat(extraPrice)) ||
            parseFloat(extraPrice) <= 0
        ) {
            Alert.alert("Error", "Please enter a valid price");
            return;
        }

        try {
            const extraData = {
                name: extraName,
                price: parseFloat(extraPrice),
            };

            const response = await extrasService.addExtra(extraData);

            if (response && response.success) {
                // Refresh the extras list
                await fetchExtras();
                setExtraName("");
                setExtraPrice("");
                setAddDialogVisible(false);
                Alert.alert("Success", "Extra added successfully");
            } else {
                throw new Error(response?.message || "Failed to add extra");
            }
        } catch (error) {
            console.error("Error adding extra:", error);
            Alert.alert("Error", error.message || "Failed to add extra");
        }
    };

    const handleEditExtra = async () => {
        if (!selectedExtra) return;

        if (!extraName.trim()) {
            Alert.alert("Error", "Extra name cannot be empty");
            return;
        }

        if (
            !extraPrice.trim() ||
            isNaN(parseFloat(extraPrice)) ||
            parseFloat(extraPrice) <= 0
        ) {
            Alert.alert("Error", "Please enter a valid price");
            return;
        }

        try {
            const extraData = {
                _id: selectedExtra._id,
                name: extraName,
                price: parseFloat(extraPrice),
            };

            const response = await extrasService.editExtra(extraData);

            if (response && response.success) {
                // Refresh the extras list
                await fetchExtras();
                setExtraName("");
                setExtraPrice("");
                setEditDialogVisible(false);
                setSelectedExtra(null);
                Alert.alert("Success", "Extra updated successfully");
            } else {
                throw new Error(response?.message || "Failed to update extra");
            }
        } catch (error) {
            console.error("Error updating extra:", error);
            Alert.alert("Error", error.message || "Failed to update extra");
        }
    };

    const handleDeleteExtra = async () => {
        if (!selectedExtra) return;

        try {
            const response = await extrasService.deleteExtra(selectedExtra._id);

            if (response && response.success) {
                // Refresh the extras list
                await fetchExtras();
                setDeleteDialogVisible(false);
                setSelectedExtra(null);
                Alert.alert("Success", "Extra deleted successfully");
            } else {
                throw new Error(response?.message || "Failed to delete extra");
            }
        } catch (error) {
            console.error("Error deleting extra:", error);
            Alert.alert("Error", error.message || "Failed to delete extra");
        }
    };

    const renderExtraItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.extraHeader}>
                    <Title style={styles.extraTitle}>{item.name}</Title>
                    <Text style={styles.extraPrice}>
                        ₹{item.price.toFixed(2)}
                    </Text>
                </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        setSelectedExtra(item);
                        setExtraName(item.name);
                        setExtraPrice(item.price.toString());
                        setEditDialogVisible(true);
                    }}
                    style={styles.editButton}
                    icon="pencil"
                >
                    Edit
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => {
                        setSelectedExtra(item);
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
                <Appbar.Content title="Extras" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={extras}
                keyExtractor={(item) => item._id}
                renderItem={renderExtraItem}
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
                            name="add-circle-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>No extras found</Text>
                        <Button
                            mode="contained"
                            onPress={() => {
                                setExtraName("");
                                setExtraPrice("");
                                setAddDialogVisible(true);
                            }}
                            style={styles.addButton}
                            icon="plus"
                        >
                            Add New Extra
                        </Button>
                    </View>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                color={COLORS.white}
                onPress={() => {
                    setExtraName("");
                    setExtraPrice("");
                    setAddDialogVisible(true);
                }}
            />

            <Portal>
                {/* Add Extra Dialog */}
                <Dialog
                    visible={addDialogVisible}
                    onDismiss={() => setAddDialogVisible(false)}
                >
                    <Dialog.Title>Add Extra</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Extra Name"
                            value={extraName}
                            onChangeText={setExtraName}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                        <TextInput
                            label="Price"
                            value={extraPrice}
                            onChangeText={setExtraPrice}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.dialogInput}
                            left={<TextInput.Affix text="₹" />}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setAddDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddExtra}>Add</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Edit Extra Dialog */}
                <Dialog
                    visible={editDialogVisible}
                    onDismiss={() => setEditDialogVisible(false)}
                >
                    <Dialog.Title>Edit Extra</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Extra Name"
                            value={extraName}
                            onChangeText={setExtraName}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                        <TextInput
                            label="Price"
                            value={extraPrice}
                            onChangeText={setExtraPrice}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.dialogInput}
                            left={<TextInput.Affix text="₹" />}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleEditExtra}>Update</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Delete Extra Dialog */}
                <Dialog
                    visible={deleteDialogVisible}
                    onDismiss={() => setDeleteDialogVisible(false)}
                >
                    <Dialog.Title>Delete Extra</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Are you sure you want to delete "
                            {selectedExtra?.name}"?
                        </Paragraph>
                        <Paragraph>This action cannot be undone.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            onPress={handleDeleteExtra}
                            color={COLORS.error}
                        >
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
    listContent: {
        padding: SIZES.medium,
        paddingBottom: SIZES.extraLarge * 2,
    },
    card: {
        marginBottom: SIZES.medium,
    },
    extraHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    extraTitle: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    extraPrice: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
        color: COLORS.primary,
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
    },
    errorText: {
        color: COLORS.white,
        textAlign: "center",
    },
    dialogInput: {
        marginTop: SIZES.base,
        backgroundColor: COLORS.white,
    },
});

export default ExtrasScreen;
