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
import * as tableService from "../../services/tableService";

const TablesScreen = ({ navigation }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Dialog states
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableNumber, setTableNumber] = useState("");
    const [capacity, setCapacity] = useState("");

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await tableService.getTables();

            // Check for different possible response structures
            if (response && response.data && response.data.tables) {
                setTables(response.data.tables);
            } else if (
                response &&
                response.data &&
                Array.isArray(response.data)
            ) {
                // Handle case where API returns array directly
                setTables(response.data);
            } else if (response && Array.isArray(response)) {
                // Handle case where API returns array directly
                setTables(response);
            } else {
                console.warn("Unexpected response format:", response);
                setTables([]);
            }
        } catch (err) {
            setError(err.message || "Failed to load tables");
            console.error("Error fetching tables:", err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTables();
        setRefreshing(false);
    };

    const handleAddTable = async () => {
        if (!tableNumber.trim()) {
            Alert.alert("Error", "Table number cannot be empty");
            return;
        }

        if (
            !capacity.trim() ||
            isNaN(parseInt(capacity)) ||
            parseInt(capacity) <= 0
        ) {
            Alert.alert("Error", "Please enter a valid capacity");
            return;
        }

        try {
            const tableData = {
                tableNumber,
                capacity: parseInt(capacity),
            };

            const response = await tableService.addTable(tableData);

            if (response && response.success) {
                // Refresh the tables list
                await fetchTables();
                setTableNumber("");
                setCapacity("");
                setAddDialogVisible(false);
                Alert.alert("Success", "Table added successfully");
            } else {
                throw new Error(response?.message || "Failed to add table");
            }
        } catch (error) {
            console.error("Error adding table:", error);
            Alert.alert("Error", error.message || "Failed to add table");
        }
    };

    const handleEditTable = async () => {
        if (!selectedTable) return;

        if (!tableNumber.trim()) {
            Alert.alert("Error", "Table number cannot be empty");
            return;
        }

        if (
            !capacity.trim() ||
            isNaN(parseInt(capacity)) ||
            parseInt(capacity) <= 0
        ) {
            Alert.alert("Error", "Please enter a valid capacity");
            return;
        }

        try {
            const tableData = {
                _id: selectedTable._id,
                tableNumber,
                capacity: parseInt(capacity),
            };

            const response = await tableService.editTable(tableData);

            if (response && response.success) {
                // Refresh the tables list
                await fetchTables();
                setTableNumber("");
                setCapacity("");
                setEditDialogVisible(false);
                setSelectedTable(null);
                Alert.alert("Success", "Table updated successfully");
            } else {
                throw new Error(response?.message || "Failed to update table");
            }
        } catch (error) {
            console.error("Error updating table:", error);
            Alert.alert("Error", error.message || "Failed to update table");
        }
    };

    const handleDeleteTable = async () => {
        if (!selectedTable) return;

        try {
            const response = await tableService.deleteTable(selectedTable._id);

            // Check for success based on the actual API response structure
            if (
                response &&
                (response.success || response.status === "success")
            ) {
                // Refresh the tables list
                await fetchTables();
                setDeleteDialogVisible(false);
                setSelectedTable(null);
                Alert.alert("Success", "Table deleted successfully");
            } else {
                throw new Error(response?.message || "Failed to delete table");
            }
        } catch (error) {
            console.error("Error deleting table:", error);
            Alert.alert("Error", error.message || "Failed to delete table");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "available":
                return COLORS.success;
            case "occupied":
                return COLORS.error;
            case "reserved":
                return COLORS.warning;
            default:
                return COLORS.gray;
        }
    };

    const renderTableItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.tableHeader}>
                    <Title style={styles.tableTitle}>
                        Table {item.tableNumber}
                    </Title>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(item.status) },
                        ]}
                    >
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.tableInfo}>
                    <Text style={styles.infoLabel}>Capacity:</Text>
                    <Text style={styles.infoValue}>{item.capacity} people</Text>
                </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        setSelectedTable(item);
                        setTableNumber(item.tableNumber);
                        setCapacity(item.capacity.toString());
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
                        setSelectedTable(item);
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
                <Appbar.Content title="Tables" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={tables}
                keyExtractor={(item) => item._id}
                renderItem={renderTableItem}
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
                            name="grid-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>No tables found</Text>
                        <Button
                            mode="contained"
                            onPress={() => {
                                setTableNumber("");
                                setCapacity("");
                                setAddDialogVisible(true);
                            }}
                            style={styles.addButton}
                            icon="plus"
                        >
                            Add New Table
                        </Button>
                    </View>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                color={COLORS.white}
                onPress={() => {
                    setTableNumber("");
                    setCapacity("");
                    setAddDialogVisible(true);
                }}
            />

            <Portal>
                {/* Add Table Dialog */}
                <Dialog
                    visible={addDialogVisible}
                    onDismiss={() => setAddDialogVisible(false)}
                >
                    <Dialog.Title>Add Table</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Table Number"
                            value={tableNumber}
                            onChangeText={setTableNumber}
                            mode="outlined"
                            style={styles.dialogInput}
                            keyboardType="number-pad"
                        />
                        <TextInput
                            label="Capacity"
                            value={capacity}
                            onChangeText={setCapacity}
                            mode="outlined"
                            style={styles.dialogInput}
                            keyboardType="number-pad"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setAddDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddTable}>Add</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Edit Table Dialog */}
                <Dialog
                    visible={editDialogVisible}
                    onDismiss={() => setEditDialogVisible(false)}
                >
                    <Dialog.Title>Edit Table</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Table Number"
                            value={tableNumber}
                            onChangeText={setTableNumber}
                            mode="outlined"
                            style={styles.dialogInput}
                            keyboardType="number-pad"
                        />
                        <TextInput
                            label="Capacity"
                            value={capacity}
                            onChangeText={setCapacity}
                            mode="outlined"
                            style={styles.dialogInput}
                            keyboardType="number-pad"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleEditTable}>Update</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Delete Table Dialog */}
                <Dialog
                    visible={deleteDialogVisible}
                    onDismiss={() => setDeleteDialogVisible(false)}
                >
                    <Dialog.Title>Delete Table</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Are you sure you want to delete Table{" "}
                            {selectedTable?.tableNumber}?
                        </Paragraph>
                        <Paragraph>This action cannot be undone.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            onPress={handleDeleteTable}
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
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tableTitle: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    statusBadge: {
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.base / 2,
        borderRadius: SIZES.base / 2,
    },
    statusText: {
        fontSize: SIZES.small,
        fontWeight: "bold",
        color: COLORS.white,
        textTransform: "capitalize",
    },
    divider: {
        marginVertical: SIZES.base,
    },
    tableInfo: {
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

export default TablesScreen;
