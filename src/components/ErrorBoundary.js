import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if this is the specific Searchbar error
      const isSearchbarError = this.state.error && 
        this.state.error.message && 
        this.state.error.message.includes("'level3' of undefined");
      
      // You can render any custom fallback UI
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          {isSearchbarError ? (
            <Text style={styles.errorMessage}>
              There was an issue with the search component. Please try updating the app.
            </Text>
          ) : (
            <Text style={styles.errorMessage}>{this.state.error?.toString()}</Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    padding: 20,
    backgroundColor: COLORS.error,
    borderRadius: 8,
    margin: 10,
  },
  errorTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'white',
    fontSize: 14,
  },
});

export default ErrorBoundary;
