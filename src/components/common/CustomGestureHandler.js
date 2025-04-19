import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// This component wraps GestureHandlerRootView with error handling
const CustomGestureHandler = ({ children, style }) => {
  try {
    // Try to use the original GestureHandlerRootView
    return (
      <GestureHandlerRootView style={style || { flex: 1 }}>
        {children}
      </GestureHandlerRootView>
    );
  } catch (error) {
    console.log('Error in GestureHandlerRootView, using fallback:', error);
    // Fallback to a regular View if GestureHandlerRootView fails
    return (
      <View style={style || { flex: 1 }}>
        {children}
      </View>
    );
  }
};

export default CustomGestureHandler;
