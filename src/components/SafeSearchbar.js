import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import ErrorBoundary from './ErrorBoundary';

/**
 * A safe wrapper around the react-native-paper Searchbar component
 * that handles the 'level3' error gracefully
 */
const SafeSearchbar = (props) => {
  // Try to render the original Searchbar
  try {
    return (
      <ErrorBoundary>
        <Searchbar {...props} />
      </ErrorBoundary>
    );
  } catch (error) {
    // If there's an error, fall back to a custom implementation
    console.error('Error rendering Searchbar, falling back to custom implementation:', error);
    return <FallbackSearchbar {...props} />;
  }
};

/**
 * A simple fallback search input that mimics the Searchbar component
 * but doesn't rely on react-native-paper's theme
 */
const FallbackSearchbar = ({ 
  placeholder, 
  value, 
  onChangeText, 
  style, 
  ...otherProps 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color={COLORS.gray} style={styles.icon} />
      <TextInput
        placeholder={placeholder || 'Search...'}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        {...otherProps}
      />
      {value ? (
        <Ionicons
          name="close-circle"
          size={20}
          color={COLORS.gray}
          style={styles.clearIcon}
          onPress={() => onChangeText && onChangeText('')}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearIcon: {
    marginLeft: 8,
  },
});

export default SafeSearchbar;
