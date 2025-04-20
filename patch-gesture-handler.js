const fs = require("fs");
const path = require("path");

console.log("Starting direct patch for react-native-gesture-handler...");

// Path to the node_modules directory
const nodeModulesDir = path.join(__dirname, "node_modules");
const gestureHandlerDir = path.join(
    nodeModulesDir,
    "react-native-gesture-handler"
);

// Check if the gesture handler directory exists
if (!fs.existsSync(gestureHandlerDir)) {
    console.log("react-native-gesture-handler not found in node_modules");
    process.exit(0);
}

// Create a mock index.js file that exports our mock implementation
const indexPath = path.join(gestureHandlerDir, "lib", "commonjs", "index.js");
const indexDir = path.dirname(indexPath);

// Create the directory if it doesn't exist
if (!fs.existsSync(indexDir)) {
    console.log(`Creating directory: ${indexDir}`);
    fs.mkdirSync(indexDir, { recursive: true });
}

// Create the mock index.js file
const mockIndexContent = `
// This is a mock implementation of react-native-gesture-handler
// It's used when the native module is not available

const { View, ScrollView, FlatList, TextInput, TouchableOpacity } = require('react-native');
// Rename the components to avoid conflicts
const RNScrollView = ScrollView;
const RNFlatList = FlatList;
const RNTextInput = TextInput;
const RNTouchableOpacity = TouchableOpacity;
const React = require('react');

// Create a simple component that just renders its children
const createMockComponent = (name) => {
  const Component = ({ children, ...props }) => {
    // For ScrollView, FlatList, and TextInput, use the React Native versions
    if (name === 'ScrollView' || name === 'GHScrollView') {
      return React.createElement(RNScrollView, props, children);
    } else if (name === 'FlatList' || name === 'GHFlatList') {
      return React.createElement(RNFlatList, props);
    } else if (name === 'TextInput' || name === 'GHTextInput') {
      return React.createElement(RNTextInput, props);
    } else if (name.includes('Touchable')) {
      return React.createElement(RNTouchableOpacity, props, children);
    }

    // For all other components, just use a View
    return React.createElement(View, props, children);
  };

  Component.displayName = name;
  return Component;
};

// Create mock gesture handlers
exports.PanGestureHandler = createMockComponent('PanGestureHandler');
exports.TapGestureHandler = createMockComponent('TapGestureHandler');
exports.LongPressGestureHandler = createMockComponent('LongPressGestureHandler');
exports.RotationGestureHandler = createMockComponent('RotationGestureHandler');
exports.FlingGestureHandler = createMockComponent('FlingGestureHandler');
exports.PinchGestureHandler = createMockComponent('PinchGestureHandler');
exports.ForceTouchGestureHandler = createMockComponent('ForceTouchGestureHandler');
exports.NativeViewGestureHandler = createMockComponent('NativeViewGestureHandler');
exports.GestureHandlerRootView = createMockComponent('GestureHandlerRootView');
exports.TouchableOpacity = createMockComponent('GHTouchableOpacity');
exports.TouchableHighlight = createMockComponent('GHTouchableHighlight');
exports.TouchableWithoutFeedback = createMockComponent('GHTouchableWithoutFeedback');
exports.TouchableNativeFeedback = createMockComponent('GHTouchableNativeFeedback');
exports.ScrollView = createMockComponent('GHScrollView');
exports.FlatList = createMockComponent('GHFlatList');
exports.Switch = createMockComponent('GHSwitch');
exports.TextInput = createMockComponent('GHTextInput');
exports.DrawerLayout = createMockComponent('DrawerLayout');
exports.Swipeable = createMockComponent('Swipeable');

// Mock gesture states
exports.State = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5,
};

// Mock gesture directions
exports.Direction = {
  RIGHT: 1,
  LEFT: 2,
  UP: 4,
  DOWN: 8,
};

// Mock utility functions
exports.gestureHandlerRootHOC = (Component) => Component;
exports.enableGestureHandlerStateRestore = () => {};
exports.createGestureHandler = () => ({ attachGestureHandler: () => {} });
exports.dropGestureHandler = () => {};
exports.handleSetJSResponder = () => {};
exports.handleClearJSResponder = () => {};
exports.install = () => {};
`;

console.log(`Creating mock index.js file: ${indexPath}`);
fs.writeFileSync(indexPath, mockIndexContent, "utf8");

// Create a mock package.json file that points to our mock implementation
const packageJsonPath = path.join(gestureHandlerDir, "package.json");
let packageJson = {};

try {
    // Read the existing package.json file
    if (fs.existsSync(packageJsonPath)) {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    }

    // Update the main field to point to our mock implementation
    packageJson.main = "lib/commonjs/index.js";

    // Write the updated package.json file
    console.log(`Updating package.json file: ${packageJsonPath}`);
    fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8"
    );
} catch (error) {
    console.error("Error updating package.json:", error);
}

console.log(
    "Direct patch for react-native-gesture-handler completed successfully!"
);
