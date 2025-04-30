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
import * as roomService from "../../services/roomService";

const RoomsScreen = ({ navigation }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Dialog states
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomNumber, setRoomNumber] = useState("");
    const [capacity, setCapacity] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await roomService.getRooms();

            if (response && response.data && response.data.rooms) {
                setRooms(response.data.rooms);
            } else {
                setRooms([]);
            }
        } catch (err) {
            setError(err.message || "Failed to load rooms");
            console.error("Error fetching rooms:", err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRooms();
        setRefreshing(false);
    };

    const handleAddRoom = async () => {
        if (!roomNumber.trim()) {
            Alert.alert("Error", "Room number cannot be empty");
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
            const roomData = {
                roomNumber,
                capacity: parseInt(capacity),
                description,
            };

            const response = await roomService.addRoom(roomData);

            if (response && response.success) {
                // Refresh the rooms list
                await fetchRooms();
                setRoomNumber("");
                setCapacity("");
                setDescription("");
                setAddDialogVisible(false);
                Alert.alert("Success", "Room added successfully");
            } else {
                throw new Error(response?.message || "Failed to add room");
            }
        } catch (error) {
            console.error("Error adding room:", error);
            Alert.alert("Error", error.message || "Failed to add room");
        }
    };

    const handleEditRoom = async () => {
        if (!selectedRoom) return;

        if (!roomNumber.trim()) {
            Alert.alert("Error", "Room number cannot be empty");
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
            const roomData = {
                _id: selectedRoom._id,
                roomNumber,
                capacity: parseInt(capacity),
                description,
            };

            const response = await roomService.editRoom(roomData);

            if (response && response.success) {
                // Refresh the rooms list
                await fetchRooms();
                setRoomNumber("");
                setCapacity("");
                setDescription("");
                setEditDialogVisible(false);
                setSelectedRoom(null);
                Alert.alert("Success", "Room updated successfully");
            } else {
                throw new Error(response?.message || "Failed to update room");
            }
        } catch (error) {
            console.error("Error updating room:", error);
            Alert.alert("Error", error.message || "Failed to update room");
        }
    };

    const handleDeleteRoom = async () => {
        if (!selectedRoom) return;

        try {
            const response = await roomService.deleteRoom(selectedRoom._id);

            if (response && response.success) {
                // Refresh the rooms list
                await fetchRooms();
                setDeleteDialogVisible(false);
                setSelectedRoom(null);
                Alert.alert("Success", "Room deleted successfully");
            } else {
                throw new Error(response?.message || "Failed to delete room");
            }
        } catch (error) {
            console.error("Error deleting room:", error);
            Alert.alert("Error", error.message || "Failed to delete room");
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

    const renderRoomItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.roomHeader}>
                    <Title style={styles.roomTitle}>
                        Room {item.roomNumber}
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

                <View style={styles.roomInfo}>
                    <Text style={styles.infoLabel}>Capacity:</Text>
                    <Text style={styles.infoValue}>{item.capacity} people</Text>
                </View>

                <View style={styles.roomInfo}>
                    <Text style={styles.infoLabel}>Description:</Text>
                    <Text style={styles.infoValue}>
                        {item.description || "No description"}
                    </Text>
                </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        setSelectedRoom(item);
                        setRoomNumber(item.roomNumber);
                        setCapacity(item.capacity.toString());
                        setDescription(item.description || "");
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
                        setSelectedRoom(item);
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
                <Appbar.Content title="Rooms" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={rooms}
                keyExtractor={(item) => item._id}
                renderItem={renderRoomItem}
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
                            name="home-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>No rooms found</Text>
                        <Button
                            mode="contained"
                            onPress={() => {
                                setRoomNumber("");
                                setCapacity("");
                                setDescription("");
                                setAddDialogVisible(true);
                            }}
                            style={styles.addButton}
                            icon="plus"
                        >
                            Add New Room
                        </Button>
                    </View>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                color={COLORS.white}
                onPress={() => {
                    setRoomNumber("");
                    setCapacity("");
                    setDescription("");
                    setAddDialogVisible(true);
                }}
            />

            <Portal>
                {/* Add Room Dialog */}
                <Dialog
                    visible={addDialogVisible}
                    onDismiss={() => setAddDialogVisible(false)}
                >
                    <Dialog.Title>Add Room</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Room Number"
                            value={roomNumber}
                            onChangeText={setRoomNumber}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                        <TextInput
                            label="Capacity"
                            value={capacity}
                            onChangeText={setCapacity}
                            mode="outlined"
                            style={styles.dialogInput}
                            keyboardType="number-pad"
                        />
                        <TextInput
                            label="Description (Optional)"
                            value={description}
                            onChangeText={setDescription}
                            mode="outlined"
                            style={styles.dialogInput}
                            multiline
                            numberOfLines={3}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setAddDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddRoom}>Add</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Edit Room Dialog */}
                <Dialog
                    visible={editDialogVisible}
                    onDismiss={() => setEditDialogVisible(false)}
                >
                    <Dialog.Title>Edit Room</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Room Number"
                            value={roomNumber}
                            onChangeText={setRoomNumber}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                        <TextInput
                            label="Capacity"
                            value={capacity}
                            onChangeText={setCapacity}
                            mode="outlined"
                            style={styles.dialogInput}
                            keyboardType="number-pad"
                        />
                        <TextInput
                            label="Description (Optional)"
                            value={description}
                            onChangeText={setDescription}
                            mode="outlined"
                            style={styles.dialogInput}
                            multiline
                            numberOfLines={3}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleEditRoom}>Update</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Delete Room Dialog */}
                <Dialog
                    visible={deleteDialogVisible}
                    onDismiss={() => setDeleteDialogVisible(false)}
                >
                    <Dialog.Title>Delete Room</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Are you sure you want to delete Room{" "}
                            {selectedRoom?.roomNumber}?
                        </Paragraph>
                        <Paragraph>This action cannot be undone.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleDeleteRoom} color={COLORS.error}>
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
    roomHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    roomTitle: {
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
    roomInfo: {
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

export default RoomsScreen;
