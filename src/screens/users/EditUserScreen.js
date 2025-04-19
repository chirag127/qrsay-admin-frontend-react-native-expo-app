import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/common/Header';

const EditUserScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Edit User" showBackButton />
      <View style={styles.content}>
        <Text style={styles.text}>Edit User Screen</Text>
        <Text style={styles.subText}>This screen will allow editing user details.</Text>
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

export default EditUserScreen;
