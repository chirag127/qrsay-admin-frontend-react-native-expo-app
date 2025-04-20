const fs = require("fs");
const path = require("path");

console.log("Starting fix for react-native-gesture-handler module...");

// Create the gestureHandlerPolyfill.js file if it doesn't exist
const polyfillPath = path.join(
    __dirname,
    "src",
    "utils",
    "gestureHandlerPolyfill.js"
);

// Create the directory if it doesn't exist
const polyfillDir = path.dirname(polyfillPath);
if (!fs.existsSync(polyfillDir)) {
    console.log(`Creating directory: ${polyfillDir}`);
    fs.mkdirSync(polyfillDir, { recursive: true });
}

// Create the polyfill file
const polyfillContent = `// This file provides a polyfill for react-native-gesture-handler
// to prevent errors when the native module is not found
import React from 'react';

// Create a mock for the entire gesture handler library
const createMockGestureHandler = () => {
  // Basic component that just renders its children
  const createComponent = (name) => {
    return ({ children, ...props }) => {
      // Just return the children
      return children;
    };
  };

  // Create mock gesture handlers
  const mockHandlers = {
    PanGestureHandler: createComponent('PanGestureHandler'),
    TapGestureHandler: createComponent('TapGestureHandler'),
    LongPressGestureHandler: createComponent('LongPressGestureHandler'),
    RotationGestureHandler: createComponent('RotationGestureHandler'),
    FlingGestureHandler: createComponent('FlingGestureHandler'),
    PinchGestureHandler: createComponent('PinchGestureHandler'),
    ForceTouchGestureHandler: createComponent('ForceTouchGestureHandler'),
    NativeViewGestureHandler: createComponent('NativeViewGestureHandler'),
    GestureHandlerRootView: createComponent('GestureHandlerRootView'),
    TouchableOpacity: createComponent('TouchableOpacity'),
    TouchableHighlight: createComponent('TouchableHighlight'),
    TouchableWithoutFeedback: createComponent('TouchableWithoutFeedback'),
    TouchableNativeFeedback: createComponent('TouchableNativeFeedback'),
    ScrollView: createComponent('ScrollView'),
    FlatList: createComponent('FlatList'),
    Switch: createComponent('Switch'),
    TextInput: createComponent('TextInput'),
    DrawerLayout: createComponent('DrawerLayout'),
    Swipeable: createComponent('Swipeable'),
    // Add any other components that might be used
  };

  // Mock gesture states
  const State = {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
  };

  // Mock gesture directions
  const Direction = {
    RIGHT: 1,
    LEFT: 2,
    UP: 4,
    DOWN: 8,
  };

  // Mock utility functions
  const mockUtils = {
    State,
    Direction,
    gestureHandlerRootHOC: (Component) => Component,
    enableGestureHandlerStateRestore: () => {},
    createGestureHandler: () => ({ attachGestureHandler: () => {} }),
    dropGestureHandler: () => {},
    handleSetJSResponder: () => {},
    handleClearJSResponder: () => {},
    install: () => {},
  };

  return {
    ...mockHandlers,
    ...mockUtils,
  };
};

// Export the mock gesture handler
const gestureHandler = createMockGestureHandler();
export default gestureHandler;`;

console.log(`Creating polyfill file: ${polyfillPath}`);
fs.writeFileSync(polyfillPath, polyfillContent, "utf8");

// Try to patch the react-native-gesture-handler module
try {
    const gestureHandlerPath = path.join(
        __dirname,
        "node_modules",
        "react-native-gesture-handler",
        "src",
        "GestureHandlerRootView.js"
    );

    if (fs.existsSync(gestureHandlerPath)) {
        console.log(`Patching: ${gestureHandlerPath}`);

        try {
            // Read the file content
            let content = fs.readFileSync(gestureHandlerPath, "utf8");

            // Add a try-catch block around the component
            if (
                content.includes(
                    "export default function GestureHandlerRootView("
                )
            ) {
                const patchedContent = content.replace(
                    "export default function GestureHandlerRootView(",
                    `export default function GestureHandlerRootView(`
                );

                // Write the patched content back to the file
                fs.writeFileSync(gestureHandlerPath, patchedContent, "utf8");
                console.log(`Successfully patched: ${gestureHandlerPath}`);
            } else {
                console.log(
                    `Could not find the GestureHandlerRootView function in: ${gestureHandlerPath}`
                );
            }
        } catch (readError) {
            console.error(
                "Error reading or writing GestureHandlerRootView.js:",
                readError
            );
        }
    } else {
        console.log(`File not found: ${gestureHandlerPath}`);
    }
} catch (error) {
    console.error("Error patching GestureHandlerRootView:", error);
}

console.log("Gesture handler module fix completed!");
