// This file provides a polyfill for react-native-gesture-handler
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
export default gestureHandler;