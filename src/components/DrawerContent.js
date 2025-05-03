import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
    Avatar,
    Title,
    Caption,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
} from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants";
import { navigateToTab } from "../navigation/AppNavigator";

const DrawerContent = (props) => {
    const {
        user,
        restaurant,
        logout,
        changeRestaurantStatus,
        toggleDineInStatus,
    } = useAuth();

    const isRestaurantOnline = restaurant?.restaurantStatus === "online";
    const isDineInAvailable = restaurant?.isDineInAvailableRestaurant;

    const handleRestaurantStatusToggle = async () => {
        try {
            const newStatus = isRestaurantOnline ? "offline" : "online";
            await changeRestaurantStatus(newStatus);
        } catch (error) {
            console.error("Error changing restaurant status:", error);
        }
    };

    const handleDineInToggle = async () => {
        try {
            await toggleDineInStatus(!isDineInAvailable);
        } catch (error) {
            console.error("Error toggling dine-in status:", error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: "row", marginTop: 15 }}>
                            <Avatar.Image
                                source={{
                                    uri:
                                        restaurant?.restaurantLogo ||
                                        "https://via.placeholder.com/150",
                                }}
                                size={50}
                            />
                            <View
                                style={{
                                    marginLeft: 15,
                                    flexDirection: "column",
                                }}
                            >
                                <Title style={styles.title}>
                                    {restaurant?.restaurantName ||
                                        "Restaurant Name"}
                                </Title>
                                <Caption style={styles.caption}>
                                    {user?.email || "email@example.com"}
                                </Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Dashboard"
                            onPress={() => {
                                props.navigation.navigate("Home");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="person-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Restaurant Profile"
                            onPress={() => {
                                props.navigation.navigate("RestaurantProfile");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="images-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Gallery"
                            onPress={() => {
                                props.navigation.navigate("RestaurantGallery");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="list-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Orders"
                            onPress={() => {
                                navigateToTab(props.navigation, "Orders");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="restaurant-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Dishes"
                            onPress={() => {
                                navigateToTab(props.navigation, "Dishes");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="grid-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Categories"
                            onPress={() => {
                                props.navigation.navigate("Categories");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="add-circle-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Extras"
                            onPress={() => {
                                props.navigation.navigate("Extras");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="options-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Choices"
                            onPress={() => {
                                props.navigation.navigate("Choices");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="people-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Users"
                            onPress={() => {
                                props.navigation.navigate("Users");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="person-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Customers"
                            onPress={() => {
                                props.navigation.navigate("Customers");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="star-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Reviews"
                            onPress={() => {
                                props.navigation.navigate("Reviews");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="qr-code-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="QR Code"
                            onPress={() => {
                                props.navigation.navigate("QRCode");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="grid-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Tables"
                            onPress={() => {
                                props.navigation.navigate("Tables");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Rooms"
                            onPress={() => {
                                props.navigation.navigate("Rooms");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="card-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Payment"
                            onPress={() => {
                                props.navigation.navigate("Payment");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="call-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Waiter Calls"
                            onPress={() => {
                                navigateToTab(props.navigation, "WaiterCalls");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="settings-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {
                                props.navigation.navigate("RestaurantSettings");
                            }}
                        />
                    </Drawer.Section>

                    <Drawer.Section title="Restaurant Status">
                        <TouchableRipple onPress={handleRestaurantStatusToggle}>
                            <View style={styles.preference}>
                                <Text>Restaurant Online</Text>
                                <View pointerEvents="none">
                                    <Switch
                                        value={isRestaurantOnline}
                                        color={COLORS.primary}
                                    />
                                </View>
                            </View>
                        </TouchableRipple>

                        <TouchableRipple onPress={handleDineInToggle}>
                            <View style={styles.preference}>
                                <Text>Dine-In Available</Text>
                                <View pointerEvents="none">
                                    <Switch
                                        value={isDineInAvailable}
                                        color={COLORS.primary}
                                    />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>

            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Ionicons
                            name="exit-outline"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => logout()}
                />
            </Drawer.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: "bold",
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
    },
    paragraph: {
        fontWeight: "bold",
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});

export default DrawerContent;
