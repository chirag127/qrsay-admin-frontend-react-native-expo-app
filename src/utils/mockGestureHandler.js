import React from "react";
import {
    View,
    ScrollView as RNScrollView,
    FlatList as RNFlatList,
    TextInput as RNTextInput,
    TouchableOpacity as RNTouchableOpacity,
} from "react-native";

/**
 * This file provides direct mock implementations for react-native-gesture-handler components
 * to be used when the native module is not available
 */

// Create a simple component that just renders its children
const createMockComponent = (name) => {
    const Component = ({ children, ...props }) => {
        // For ScrollView, FlatList, and TextInput, use the React Native versions
        if (name === "ScrollView" || name === "GHScrollView") {
            return <RNScrollView {...props}>{children}</RNScrollView>;
        } else if (name === "FlatList" || name === "GHFlatList") {
            return <RNFlatList {...props} />;
        } else if (name === "TextInput" || name === "GHTextInput") {
            return <RNTextInput {...props} />;
        } else if (name.includes("Touchable")) {
            return (
                <RNTouchableOpacity {...props}>{children}</RNTouchableOpacity>
            );
        }

        // For all other components, just use a View
        return <View {...props}>{children}</View>;
    };

    Component.displayName = name;
    return Component;
};

// Create mock gesture handlers
export const PanGestureHandler = createMockComponent("PanGestureHandler");
export const TapGestureHandler = createMockComponent("TapGestureHandler");
export const LongPressGestureHandler = createMockComponent(
    "LongPressGestureHandler"
);
export const RotationGestureHandler = createMockComponent(
    "RotationGestureHandler"
);
export const FlingGestureHandler = createMockComponent("FlingGestureHandler");
export const PinchGestureHandler = createMockComponent("PinchGestureHandler");
export const ForceTouchGestureHandler = createMockComponent(
    "ForceTouchGestureHandler"
);
export const NativeViewGestureHandler = createMockComponent(
    "NativeViewGestureHandler"
);
export const GestureHandlerRootView = createMockComponent(
    "GestureHandlerRootView"
);
export const TouchableOpacity = createMockComponent("GHTouchableOpacity");
export const TouchableHighlight = createMockComponent("GHTouchableHighlight");
export const TouchableWithoutFeedback = createMockComponent(
    "GHTouchableWithoutFeedback"
);
export const TouchableNativeFeedback = createMockComponent(
    "GHTouchableNativeFeedback"
);
export const ScrollView = createMockComponent("GHScrollView");
export const FlatList = createMockComponent("GHFlatList");
export const Switch = createMockComponent("GHSwitch");
export const TextInput = createMockComponent("GHTextInput");
export const DrawerLayout = createMockComponent("DrawerLayout");
export const Swipeable = createMockComponent("Swipeable");

// Mock gesture states
export const State = {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
};

// Mock gesture directions
export const Direction = {
    RIGHT: 1,
    LEFT: 2,
    UP: 4,
    DOWN: 8,
};

// Mock utility functions
export const gestureHandlerRootHOC = (Component) => Component;
export const enableGestureHandlerStateRestore = () => {};
export const createGestureHandler = () => ({ attachGestureHandler: () => {} });
export const dropGestureHandler = () => {};
export const handleSetJSResponder = () => {};
export const handleClearJSResponder = () => {};
export const install = () => {};

// Export everything as a default object as well
export default {
    PanGestureHandler,
    TapGestureHandler,
    LongPressGestureHandler,
    RotationGestureHandler,
    FlingGestureHandler,
    PinchGestureHandler,
    ForceTouchGestureHandler,
    NativeViewGestureHandler,
    GestureHandlerRootView,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    ScrollView,
    FlatList,
    Switch,
    TextInput,
    DrawerLayout,
    Swipeable,
    State,
    Direction,
    gestureHandlerRootHOC,
    enableGestureHandlerStateRestore,
    createGestureHandler,
    dropGestureHandler,
    handleSetJSResponder,
    handleClearJSResponder,
    install,
};
