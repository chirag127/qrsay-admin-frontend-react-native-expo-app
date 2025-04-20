import React, { memo } from "react";
import { View } from "react-native";

// Import our mock gesture handler components
let GestureHandlerRootView;

// This is wrapped in a try-catch to prevent any import errors
try {
    // First try to dynamically import the real module
    const gestureHandler = require("react-native-gesture-handler");
    if (gestureHandler && gestureHandler.GestureHandlerRootView) {
        GestureHandlerRootView = gestureHandler.GestureHandlerRootView;
        console.log("Using real GestureHandlerRootView");
    } else {
        throw new Error("GestureHandlerRootView not found in module");
    }
} catch (error) {
    // If that fails, use our mock implementation
    try {
        const mockGestureHandler = require("../../utils/mockGestureHandler");
        GestureHandlerRootView = mockGestureHandler.GestureHandlerRootView;
        console.log(
            "Using mock GestureHandlerRootView from mockGestureHandler"
        );
    } catch (mockError) {
        // If even that fails, use a simple View
        console.log("Using simple View as GestureHandlerRootView fallback");
        GestureHandlerRootView = memo(({ children, style, ...props }) => {
            return (
                <View style={style || { flex: 1 }} {...props}>
                    {children}
                </View>
            );
        });
    }
}

/**
 * A robust wrapper for GestureHandlerRootView that handles errors and missing modules
 */
const CustomGestureHandler = memo(({ children, style, ...props }) => {
    // Wrap the component rendering in a try-catch to handle any runtime errors
    try {
        return (
            <GestureHandlerRootView style={style || { flex: 1 }} {...props}>
                {children}
            </GestureHandlerRootView>
        );
    } catch (error) {
        console.log(
            "Error rendering GestureHandlerRootView, using View fallback:",
            error
        );
        // Final fallback to a regular View
        return (
            <View style={style || { flex: 1 }} {...props}>
                {children}
            </View>
        );
    }
});

export default CustomGestureHandler;
