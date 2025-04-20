import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

// Main Screens
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import RestaurantProfileScreen from "../screens/restaurant/RestaurantProfileScreen";
import RestaurantGalleryScreen from "../screens/restaurant/RestaurantGalleryScreen";
import RestaurantSettingsScreen from "../screens/restaurant/RestaurantSettingsScreen";

// Order Screens
import OrdersScreen from "../screens/orders/OrdersScreen";
import OrderDetailsScreen from "../screens/orders/OrderDetailsScreen";

// Dish Screens
import DishesScreen from "../screens/dishes/DishesScreen";
import AddDishScreen from "../screens/dishes/AddDishScreen";
import EditDishScreen from "../screens/dishes/EditDishScreen";
import CategoriesScreen from "../screens/dishes/CategoriesScreen";
import ExtrasScreen from "../screens/dishes/ExtrasScreen";
import ChoicesScreen from "../screens/dishes/ChoicesScreen";

// User Management Screens
import UsersScreen from "../screens/users/UsersScreen";
import AddUserScreen from "../screens/users/AddUserScreen";
import EditUserScreen from "../screens/users/EditUserScreen";
import UserProfileScreen from "../screens/users/UserProfileScreen";

// Waiter Call Screens
import WaiterCallsScreen from "../screens/waiterCalls/WaiterCallsScreen";

// Other Screens
import CustomersScreen from "../screens/customers/CustomersScreen";
import ReviewsScreen from "../screens/reviews/ReviewsScreen";
import QRCodeScreen from "../screens/qrcode/QRCodeScreen";
import TablesScreen from "../screens/tables/TablesScreen";
import RoomsScreen from "../screens/rooms/RoomsScreen";
import PaymentScreen from "../screens/payment/PaymentScreen";

// Custom Components
import DrawerContent from "../components/DrawerContent";
import LoadingScreen from "../screens/common/LoadingScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Navigator
const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
);

// Dashboard Tab Navigator
const DashboardTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Dashboard") {
                    iconName = focused ? "home" : "home-outline";
                } else if (route.name === "Orders") {
                    iconName = focused ? "list" : "list-outline";
                } else if (route.name === "Dishes") {
                    iconName = focused ? "restaurant" : "restaurant-outline";
                } else if (route.name === "WaiterCalls") {
                    iconName = focused ? "call" : "call-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#FF8C00",
            tabBarInactiveTintColor: "gray",
        })}
    >
        <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
        />
        <Tab.Screen
            name="Orders"
            component={OrdersScreen}
            options={{ headerShown: false }}
        />
        <Tab.Screen
            name="Dishes"
            component={DishesScreen}
            options={{ headerShown: false }}
        />
        <Tab.Screen
            name="WaiterCalls"
            component={WaiterCallsScreen}
            options={{
                headerShown: false,
                title: "Waiter Calls",
            }}
        />
    </Tab.Navigator>
);

// Main Drawer Navigator
const MainNavigator = () => (
    <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
            headerStyle: {
                backgroundColor: "#FF8C00",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            drawerActiveTintColor: "#FF8C00",
        }}
    >
        <Drawer.Screen name="Home" component={DashboardTabNavigator} />
        <Drawer.Screen
            name="RestaurantProfile"
            component={RestaurantProfileScreen}
            options={{ title: "Restaurant Profile" }}
        />
        <Drawer.Screen
            name="RestaurantGallery"
            component={RestaurantGalleryScreen}
            options={{ title: "Gallery" }}
        />
        <Drawer.Screen
            name="RestaurantSettings"
            component={RestaurantSettingsScreen}
            options={{ title: "Settings" }}
        />
        <Drawer.Screen name="Categories" component={CategoriesScreen} />
        <Drawer.Screen name="Extras" component={ExtrasScreen} />
        <Drawer.Screen name="Choices" component={ChoicesScreen} />
        <Drawer.Screen name="Users" component={UsersScreen} />
        <Drawer.Screen name="Customers" component={CustomersScreen} />
        <Drawer.Screen name="Reviews" component={ReviewsScreen} />
        <Drawer.Screen
            name="QRCode"
            component={QRCodeScreen}
            options={{ title: "QR Code" }}
        />
        <Drawer.Screen name="Tables" component={TablesScreen} />
        <Drawer.Screen name="Rooms" component={RoomsScreen} />
        <Drawer.Screen name="Payment" component={PaymentScreen} />
        <Drawer.Screen
            name="UserProfile"
            component={UserProfileScreen}
            options={{ title: "My Profile" }}
        />
    </Drawer.Navigator>
);

// Root Navigator
const RootNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen name="Main" component={MainNavigator} />
                    <Stack.Screen
                        name="OrderDetails"
                        component={OrderDetailsScreen}
                    />
                    <Stack.Screen name="AddDish" component={AddDishScreen} />
                    <Stack.Screen name="EditDish" component={EditDishScreen} />
                    <Stack.Screen name="AddUser" component={AddUserScreen} />
                    <Stack.Screen name="EditUser" component={EditUserScreen} />
                </>
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
};

export default AppNavigator;
