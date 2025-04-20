
// This file provides a direct patch for the RNSScreen component
import React from 'react';
import { NativeModules } from 'react-native';

// Monkey patch the RNSScreen component
if (NativeModules.RNSScreenManager) {
  console.log('Applying patch for RNSScreen component...');
  
  // Store the original createScreen method
  const originalCreateScreen = NativeModules.RNSScreenManager.createScreen;
  
  // Override the createScreen method to handle string size values
  NativeModules.RNSScreenManager.createScreen = function(tag, options) {
    // Convert string size values to numbers
    if (options && options.size && typeof options.size === 'string') {
      if (options.size === 'small') {
        options.size = 34;
      } else if (options.size === 'medium') {
        options.size = 50;
      } else if (options.size === 'large') {
        options.size = 75;
      } else if (options.size === 'xlarge') {
        options.size = 150;
      } else {
        // Try to parse the string as a number
        const parsed = parseFloat(options.size);
        if (!isNaN(parsed)) {
          options.size = parsed;
        } else {
          // Use a default value
          options.size = 75;
        }
      }
    }
    
    // Call the original method with the modified options
    return originalCreateScreen.call(this, tag, options);
  };
  
  console.log('Successfully applied patch for RNSScreen component');
}

// Monkey patch the UIManager to handle string size values
if (global.RN$Bridgeless !== true && global.__fbBatchedBridge && global.__fbBatchedBridge.getCallableModule) {
  const RCTUIManager = global.__fbBatchedBridge.getCallableModule('UIManager');
  if (RCTUIManager) {
    console.log('Applying patch for UIManager...');
    
    // Store the original createView method
    const originalCreateView = RCTUIManager.createView;
    
    // Override the createView method to handle string size values
    RCTUIManager.createView = function(tag, className, rootTag, props) {
      // Handle RNSScreen components
      if (className === 'RNSScreen' && props && props.size && typeof props.size === 'string') {
        if (props.size === 'small') {
          props.size = 34;
        } else if (props.size === 'medium') {
          props.size = 50;
        } else if (props.size === 'large') {
          props.size = 75;
        } else if (props.size === 'xlarge') {
          props.size = 150;
        } else {
          // Try to parse the string as a number
          const parsed = parseFloat(props.size);
          if (!isNaN(parsed)) {
            props.size = parsed;
          } else {
            // Use a default value
            props.size = 75;
          }
        }
      }
      
      // Call the original method with the modified props
      return originalCreateView.call(this, tag, className, rootTag, props);
    };
    
    console.log('Successfully applied patch for UIManager');
  }
}
