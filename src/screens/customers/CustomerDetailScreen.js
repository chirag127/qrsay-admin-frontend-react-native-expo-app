import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/common/Header';

const CustomerDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Customer Details" showBackButton />
      <View style={styles.content}>
        <Text style={styles.text}>Customer Detail Screen</Text>
        <Text style={styles.subText}>This screen will display customer details.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CustomerDetailScreen;
