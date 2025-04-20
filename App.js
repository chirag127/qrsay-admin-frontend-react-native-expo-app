// The RCTDeviceEventEmitter is already patched in global-patch.js

// Try to import react-native-gesture-handler, but use our polyfill if it fails
import React, { useEffect } from "react";

// Use a try-catch to handle the import
try {
    require("react-native-gesture-handler");
    console.log("Successfully imported react-native-gesture-handler");
} catch (error) {
    console.log(
        "Failed to import react-native-gesture-handler, using polyfill"
    );
    // The polyfill will be used by the CustomGestureHandler component
}
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
        // Ignore specific warnings and errors
        LogBox.ignoreLogs([
            'Unsupported top level event type "topInsetsChange" dispatched',
            'Unable to resolve "../handlersRegistry"',
            'Unable to resolve "../../getReactNativeVersion"',
            "[react-native-gesture-handler]",
            "Android Bundling failed",
            "Due to changes in Androids permission requirements",
            "JavaScript logs will be removed from Metro",
        ]);

        // The RCTDeviceEventEmitter is already patched at the top of the file
        // to handle the topInsetsChange event

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
