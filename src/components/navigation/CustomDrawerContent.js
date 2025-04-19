import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();
  const { restaurantData } = useRestaurant();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>
            <Text style={styles.title}>{user?.name || 'User'}</Text>
            <Text style={styles.subtitle}>{restaurantData?.restaurantName || 'Restaurant'}</Text>
            <Text style={styles.role}>{user?.role || 'Staff'}</Text>
          </View>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <ScrollView style={styles.drawerContent}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          )}
          label="Dashboard"
          onPress={() => props.navigation.navigate('DashboardStack')}
        />
        
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="list-alt" color={color} size={size} />
          )}
          label="Orders"
          onPress={() => props.navigation.navigate('OrdersStack')}
        />
        
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="cutlery" color={color} size={size} />
          )}
          label="Dishes"
          onPress={() => props.navigation.navigate('DishesStack')}
        />
        
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="building" color={color} size={size} />
          )}
          label="Restaurant"
          onPress={() => props.navigation.navigate('RestaurantStack')}
        />
        
        {user?.role === 'restaurantOwner' && (
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="users" color={color} size={size} />
            )}
            label="Users"
            onPress={() => props.navigation.navigate('UsersStack')}
          />
        )}
        
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          )}
          label="Customers"
          onPress={() => props.navigation.navigate('CustomersStack')}
        />
        
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="bell" color={color} size={size} />
          )}
          label="Waiter Calls"
          onPress={() => props.navigation.navigate('WaiterCallsStack')}
        />
        
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          )}
          label="Settings"
          onPress={() => props.navigation.navigate('SettingsStack')}
        />
      </ScrollView>
      
      <Divider style={styles.divider} />
      
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="sign-out" color={color} size={size} />
          )}
          label="Logout"
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  role: {
    fontSize: 12,
    marginTop: 2,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
  },
});

export default CustomDrawerContent;
