import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { RestaurantProvider } from "./src/context/RestaurantContext";
import { OrderProvider } from "./src/context/OrderContext";
import { WaiterCallProvider } from "./src/context/WaiterCallContext";
import ErrorBoundary from "./src/components/common/ErrorBoundary";

export default function App() {
    // Ignore specific warnings
    useEffect(() => {
        LogBox.ignoreLogs([
            'Unsupported top level event type "topInsetsChange" dispatched',
            'Unable to resolve "../handlersRegistry"',
            'Unable to resolve "../../getReactNativeVersion"',
            "[react-native-gesture-handler]",
            "Android Bundling failed",
        ]);

        // Log any unhandled errors
        const handleError = (error) => {
            console.log("Unhandled error:", error);
        };

        // Add error event listener
        if (global.ErrorUtils) {
            const previousHandler = global.ErrorUtils.getGlobalHandler();
            global.ErrorUtils.setGlobalHandler((error, isFatal) => {
                handleError(error);
                previousHandler(error, isFatal);
            });
        }
    }, []);
    return (
        <ErrorBoundary>
            <SafeAreaProvider>
                <AuthProvider>
                    <RestaurantProvider>
                        <OrderProvider>
                            <WaiterCallProvider>
                                <StatusBar style="light" />
                                <AppNavigator />
                            </WaiterCallProvider>
                        </OrderProvider>
                    </RestaurantProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
