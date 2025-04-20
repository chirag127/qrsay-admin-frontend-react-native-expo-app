
// This file provides a patched version of ActivityIndicator that handles string size values
import React from 'react';
import { ActivityIndicator as RNActivityIndicator, View, StyleSheet } from 'react-native';

// Helper function to convert size values
const convertSize = (size) => {
  if (size === undefined || size === null) {
    return 'small';
  }
  
  // If it's already a valid size, return it
  if (size === 'small' || size === 'large' || typeof size === 'number') {
    return size;
  }
  
  // Handle string values that should be numbers
  if (typeof size === 'string') {
    // Try to parse the string as a number
    const parsed = parseFloat(size);
    if (!isNaN(parsed)) {
      return parsed;
    }
    
    // Return a default value for other string values
    console.warn(`[ActivityIndicator] Invalid size value: ${size}, using 'small'`);
    return 'small';
  }
  
  return 'small';
};

// Patched ActivityIndicator component
const ActivityIndicator = (props) => {
  const { size, ...rest } = props;
  const convertedSize = convertSize(size);
  
  return <RNActivityIndicator size={convertedSize} {...rest} />;
};

export default ActivityIndicator;
