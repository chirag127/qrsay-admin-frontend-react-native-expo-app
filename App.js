import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { OrderProvider } from "./src/context/OrderContext";
import { WaiterCallProvider } from "./src/context/WaiterCallContext";
import { COLORS } from "./src/constants";
import ErrorBoundary from "./src/components/ErrorBoundary";

// Ignore specific warnings
LogBox.ignoreLogs([
    "Warning: ...", // Add specific warnings to ignore
    "Require cycle:",
]);

// Create a theme for react-native-paper
// Using MD3LightTheme as base theme to ensure all required properties are included
const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: COLORS.primary,
        secondary: COLORS.secondary,
        background: COLORS.background,
        surface: COLORS.white,
        text: COLORS.text,
        error: COLORS.error,
    },
    // Make sure we have the version property set
    version: 3,
};

export default function App() {
    return (
        <ErrorBoundary>
            <SafeAreaProvider>
                <PaperProvider theme={theme}>
                    <AuthProvider>
                        <OrderProvider>
                            <WaiterCallProvider>
                                <StatusBar
                                    style="light"
                                    backgroundColor={COLORS.primary}
                                />
                                <AppNavigator />
                                <Toast />
                            </WaiterCallProvider>
                        </OrderProvider>
                    </AuthProvider>
                </PaperProvider>
            </SafeAreaProvider>
        </ErrorBoundary>
    );
}
