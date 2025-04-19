import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";

// Auth screens
import LoginScreen from "../screens/auth/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

// Main screens
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import OrdersScreen from "../screens/orders/OrdersScreen";
import OrderDetailScreen from "../screens/orders/OrderDetailScreen";
import DishesScreen from "../screens/dishes/DishesScreen";
import AddDishScreen from "../screens/dishes/AddDishScreen";
import EditDishScreen from "../screens/dishes/EditDishScreen";
import CategoriesScreen from "../screens/dishes/CategoriesScreen";
import ExtrasScreen from "../screens/dishes/ExtrasScreen";
import ChoicesScreen from "../screens/dishes/ChoicesScreen";
import RestaurantProfileScreen from "../screens/restaurant/RestaurantProfileScreen";
import RestaurantGalleryScreen from "../screens/restaurant/RestaurantGalleryScreen";
import RestaurantTablesScreen from "../screens/restaurant/RestaurantTablesScreen";
import RestaurantRoomsScreen from "../screens/restaurant/RestaurantRoomsScreen";
import RestaurantQrCodeScreen from "../screens/restaurant/RestaurantQrCodeScreen";
import RestaurantContactDetailsScreen from "../screens/restaurant/RestaurantContactDetailsScreen";
import UsersScreen from "../screens/users/UsersScreen";
import AddUserScreen from "../screens/users/AddUserScreen";
import EditUserScreen from "../screens/users/EditUserScreen";
import UserProfileScreen from "../screens/users/UserProfileScreen";
import CustomersScreen from "../screens/customers/CustomersScreen";
import CustomerDetailScreen from "../screens/customers/CustomerDetailScreen";
import WaiterCallsScreen from "../screens/waiter/WaiterCallsScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

// Custom drawer content
import CustomDrawerContent from "../components/navigation/CustomDrawerContent";

// Create navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Auth navigator
const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
            />
        </Stack.Navigator>
    );
};

// Dashboard stack navigator
const DashboardStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Orders stack navigator
const OrdersStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Orders"
                component={OrdersScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrderDetail"
                component={OrderDetailScreen}
                options={{ title: "Order Details" }}
            />
        </Stack.Navigator>
    );
};

// Dishes stack navigator
const DishesStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dishes"
                component={DishesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddDish"
                component={AddDishScreen}
                options={{ title: "Add Dish" }}
            />
            <Stack.Screen
                name="EditDish"
                component={EditDishScreen}
                options={{ title: "Edit Dish" }}
            />
            <Stack.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{ title: "Categories" }}
            />
            <Stack.Screen
                name="Extras"
                component={ExtrasScreen}
                options={{ title: "Extras" }}
            />
            <Stack.Screen
                name="Choices"
                component={ChoicesScreen}
                options={{ title: "Choices" }}
            />
        </Stack.Navigator>
    );
};

// Restaurant stack navigator
const RestaurantStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RestaurantProfile"
                component={RestaurantProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RestaurantGallery"
                component={RestaurantGalleryScreen}
                options={{ title: "Gallery" }}
            />
            <Stack.Screen
                name="RestaurantTables"
                component={RestaurantTablesScreen}
                options={{ title: "Tables" }}
            />
            <Stack.Screen
                name="RestaurantRooms"
                component={RestaurantRoomsScreen}
                options={{ title: "Rooms" }}
            />
            <Stack.Screen
                name="RestaurantQrCode"
                component={RestaurantQrCodeScreen}
                options={{ title: "QR Code" }}
            />
            <Stack.Screen
                name="RestaurantContactDetails"
                component={RestaurantContactDetailsScreen}
                options={{ title: "Contact Details" }}
            />
        </Stack.Navigator>
    );
};

// Users stack navigator
const UsersStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Users"
                component={UsersScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddUser"
                component={AddUserScreen}
                options={{ title: "Add User" }}
            />
            <Stack.Screen
                name="EditUser"
                component={EditUserScreen}
                options={{ title: "Edit User" }}
            />
            <Stack.Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={{ title: "User Profile" }}
            />
        </Stack.Navigator>
    );
};

// Customers stack navigator
const CustomersStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Customers"
                component={CustomersScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CustomerDetail"
                component={CustomerDetailScreen}
                options={{ title: "Customer Details" }}
            />
        </Stack.Navigator>
    );
};

// Waiter calls stack navigator
const WaiterCallsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="WaiterCalls"
                component={WaiterCallsScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Settings stack navigator
const SettingsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Main drawer navigator
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: 280,
                },
            }}
        >
            <Drawer.Screen
                name="DashboardStack"
                component={DashboardStackNavigator}
                options={{ title: "Dashboard" }}
            />
            <Drawer.Screen
                name="OrdersStack"
                component={OrdersStackNavigator}
                options={{ title: "Orders" }}
            />
            <Drawer.Screen
                name="DishesStack"
                component={DishesStackNavigator}
                options={{ title: "Dishes" }}
            />
            <Drawer.Screen
                name="RestaurantStack"
                component={RestaurantStackNavigator}
                options={{ title: "Restaurant" }}
            />
            <Drawer.Screen
                name="UsersStack"
                component={UsersStackNavigator}
                options={{ title: "Users" }}
            />
            <Drawer.Screen
                name="CustomersStack"
                component={CustomersStackNavigator}
                options={{ title: "Customers" }}
            />
            <Drawer.Screen
                name="WaiterCallsStack"
                component={WaiterCallsStackNavigator}
                options={{ title: "Waiter Calls" }}
            />
            <Drawer.Screen
                name="SettingsStack"
                component={SettingsStackNavigator}
                options={{ title: "Settings" }}
            />
        </Drawer.Navigator>
    );
};

// Root navigator
const AppNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // Return a loading screen
        return <LoadingScreen message="Initializing app..." />;
    }

    return (
        <NavigationContainer>
            {user ? <DrawerNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
