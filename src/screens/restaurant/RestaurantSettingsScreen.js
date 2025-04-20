import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Divider, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

const RestaurantSettingsScreen = ({ navigation }) => {
  const { restaurant, loading, error, changeRestaurantStatus, toggleDineInStatus } = useAuth();
  
  const [isRestaurantOnline, setIsRestaurantOnline] = useState(
    restaurant?.restaurantStatus === 'online'
  );
  
  const [isDineInAvailable, setIsDineInAvailable] = useState(
    restaurant?.isDineInAvailableRestaurant
  );
  
  const handleRestaurantStatusToggle = async () => {
    try {
      const newStatus = isRestaurantOnline ? 'offline' : 'online';
      await changeRestaurantStatus(newStatus);
      setIsRestaurantOnline(!isRestaurantOnline);
      Alert.alert(
        'Status Updated',
        `Restaurant is now ${newStatus}`
      );
    } catch (error) {
      console.error('Error changing restaurant status:', error);
      Alert.alert('Error', 'Failed to update restaurant status');
    }
  };
  
  const handleDineInToggle = async () => {
    try {
      await toggleDineInStatus(!isDineInAvailable);
      setIsDineInAvailable(!isDineInAvailable);
      Alert.alert(
        'Dine-In Status Updated',
        `Dine-In is now ${!isDineInAvailable ? 'available' : 'unavailable'}`
      );
    } catch (error) {
      console.error('Error toggling dine-in status:', error);
      Alert.alert('Error', 'Failed to update dine-in status');
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Restaurant Settings" />
      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>{error}</Text>
            </Card.Content>
          </Card>
        )}
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Restaurant Status</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Restaurant Online"
              description="When turned off, customers won't be able to place orders"
              left={props => <List.Icon {...props} icon="store" />}
              right={props => (
                <Switch
                  value={isRestaurantOnline}
                  onValueChange={handleRestaurantStatusToggle}
                  color={COLORS.primary}
                />
              )}
            />
            
            <List.Item
              title="Dine-In Available"
              description="When turned off, customers won't be able to place dine-in orders"
              left={props => <List.Icon {...props} icon="table-chair" />}
              right={props => (
                <Switch
                  value={isDineInAvailable}
                  onValueChange={handleDineInToggle}
                  color={COLORS.primary}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Notification Settings</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Order Notifications"
              description="Receive notifications for new orders"
              left={props => <List.Icon {...props} icon="bell" />}
              right={props => (
                <Switch
                  value={true}
                  onValueChange={() => {
                    Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
                  }}
                  color={COLORS.primary}
                />
              )}
            />
            
            <List.Item
              title="Waiter Call Notifications"
              description="Receive notifications for waiter calls"
              left={props => <List.Icon {...props} icon="bell-ring" />}
              right={props => (
                <Switch
                  value={true}
                  onValueChange={() => {
                    Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
                  }}
                  color={COLORS.primary}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>App Settings</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Dark Mode"
              description="Switch between light and dark theme"
              left={props => <List.Icon {...props} icon="theme-light-dark" />}
              right={props => (
                <Switch
                  value={false}
                  onValueChange={() => {
                    Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
                  }}
                  color={COLORS.primary}
                />
              )}
            />
            
            <List.Item
              title="Language"
              description="English"
              left={props => <List.Icon {...props} icon="translate" />}
              onPress={() => {
                Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
              }}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Account</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Change Password"
              left={props => <List.Icon {...props} icon="lock" />}
              onPress={() => {
                // Navigate to change password screen
                Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
              }}
            />
            
            <List.Item
              title="Privacy Policy"
              left={props => <List.Icon {...props} icon="shield-account" />}
              onPress={() => {
                // Navigate to privacy policy screen
                Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
              }}
            />
            
            <List.Item
              title="Terms of Service"
              left={props => <List.Icon {...props} icon="file-document" />}
              onPress={() => {
                // Navigate to terms of service screen
                Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
              }}
            />
            
            <List.Item
              title="About"
              left={props => <List.Icon {...props} icon="information" />}
              onPress={() => {
                // Navigate to about screen
                Alert.alert('About QRSay', 'QRSay Admin App v1.0.0\n\nDeveloped by QRSay Team');
              }}
            />
          </Card.Content>
        </Card>
        
        <Button
          mode="outlined"
          onPress={() => {
            // Logout
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  onPress: () => {
                    // Call logout function from auth context
                    navigation.navigate('Auth');
                  },
                },
              ]
            );
          }}
          style={styles.logoutButton}
          icon="logout"
        >
          Logout
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge,
  },
  card: {
    marginBottom: SIZES.medium,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    marginVertical: SIZES.base,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    marginBottom: SIZES.medium,
  },
  errorText: {
    color: COLORS.error,
  },
  logoutButton: {
    marginTop: SIZES.medium,
    borderColor: COLORS.error,
    borderWidth: 1,
  },
});

export default RestaurantSettingsScreen;
