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
    Paragraph,
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
import * as userService from "../../services/userService";

const UsersScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchQuery]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await userService.getUsers();

            // Check for different possible response structures
            if (response && response.data && response.data.users) {
                setUsers(response.data.users);
            } else if (
                response &&
                response.data &&
                Array.isArray(response.data)
            ) {
                // Handle case where API returns array directly
                setUsers(response.data);
            } else if (response && Array.isArray(response)) {
                // Handle case where API returns array directly
                setUsers(response);
            } else {
                console.warn("Unexpected response format:", response);
                setUsers([]);
            }
        } catch (err) {
            setError(err.message || "Failed to load users");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUsers();
        setRefreshing(false);
    };

    const filterUsers = () => {
        if (!searchQuery) {
            setFilteredUsers(users);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query) ||
                user.phoneNumber.includes(query)
        );

        setFilteredUsers(filtered);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const response = await userService.deleteUser(selectedUser._id);

            // Check for success based on the actual API response structure
            if (
                response &&
                (response.success || response.status === "success")
            ) {
                // Refresh the users list
                await fetchUsers();
                setDeleteDialogVisible(false);
                setSelectedUser(null);
                Alert.alert("Success", "User deleted successfully");
            } else {
                throw new Error(response?.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            Alert.alert("Error", error.message || "Failed to delete user");
        }
    };

    const getRoleBadgeStyle = (role) => {
        switch (role.toLowerCase()) {
            case "admin":
                return styles.adminBadge;
            case "manager":
                return styles.managerBadge;
            case "staff":
                return styles.staffBadge;
            default:
                return styles.staffBadge;
        }
    };

    const renderUserItem = ({ item }) => (
        <Card
            style={styles.card}
            onPress={() =>
                navigation.navigate("UserProfile", { userId: item._id })
            }
        >
            <Card.Content>
                <View style={styles.userHeader}>
                    <View>
                        <Title style={styles.userName}>{item.name}</Title>
                        <Paragraph style={styles.userEmail}>
                            {item.email}
                        </Paragraph>
                    </View>
                    <View
                        style={[styles.roleBadge, getRoleBadgeStyle(item.role)]}
                    >
                        <Text style={styles.roleText}>{item.role}</Text>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.userInfo}>
                    <Ionicons
                        name="call-outline"
                        size={16}
                        color={COLORS.gray}
                        style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>{item.phoneNumber}</Text>
                </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="outlined"
                    onPress={() =>
                        navigation.navigate("EditUser", { userId: item._id })
                    }
                    style={styles.editButton}
                    icon="pencil"
                >
                    Edit
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => {
                        setSelectedUser(item);
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
                <Appbar.Content title="Users" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search users..."
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
                data={filteredUsers}
                keyExtractor={(item) => item._id}
                renderItem={renderUserItem}
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
                            name="people-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>No users found</Text>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate("AddUser")}
                            style={styles.addButton}
                            icon="plus"
                        >
                            Add New User
                        </Button>
                    </View>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                color={COLORS.white}
                onPress={() => navigation.navigate("AddUser")}
            />

            <Portal>
                <Dialog
                    visible={deleteDialogVisible}
                    onDismiss={() => setDeleteDialogVisible(false)}
                >
                    <Dialog.Title>Delete User</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Are you sure you want to delete "
                            {selectedUser?.name}"?
                        </Paragraph>
                        <Paragraph>This action cannot be undone.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            onPress={handleDeleteUser}
                            textColor={COLORS.error}
                            mode="text"
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
    userHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    userName: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    userEmail: {
        fontSize: SIZES.small,
        color: COLORS.gray,
    },
    roleBadge: {
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.base / 2,
        borderRadius: SIZES.base / 2,
    },
    adminBadge: {
        backgroundColor: "#E3F2FD",
    },
    managerBadge: {
        backgroundColor: "#E8F5E9",
    },
    staffBadge: {
        backgroundColor: "#FFF8E1",
    },
    roleText: {
        fontSize: SIZES.small,
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    divider: {
        marginVertical: SIZES.base,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: SIZES.base / 2,
    },
    infoIcon: {
        marginRight: SIZES.base,
    },
    infoText: {
        fontSize: SIZES.small,
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
});

export default UsersScreen;
