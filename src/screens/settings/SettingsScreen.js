import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import Header from '../../components/common/Header';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { restaurantData, restaurantStatus, dineInStatus, updateRestaurantStatus, updateDineInStatus } = useRestaurant();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  
  const handleToggleRestaurantStatus = async () => {
    try {
      setIsLoading(true);
      const newStatus = restaurantStatus === 'online' ? 'offline' : 'online';
      await updateRestaurantStatus(newStatus);
      Alert.alert('Success', `Restaurant is now ${newStatus}`);
    } catch (error) {
      console.error('Toggle restaurant status error:', error);
      Alert.alert('Error', 'Failed to update restaurant status');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleDineInStatus = async () => {
    try {
      setIsLoading(true);
      await updateDineInStatus(!dineInStatus);
      Alert.alert('Success', `Dine-in is now ${!dineInStatus ? 'available' : 'unavailable'}`);
    } catch (error) {
      console.error('Toggle dine-in status error:', error);
      Alert.alert('Error', 'Failed to update dine-in status');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };
  
  return (
    <View style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>Restaurant Status</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="cutlery" size={20} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Restaurant Status</Text>
            </View>
            
            <Switch
              value={restaurantStatus === 'online'}
              onValueChange={handleToggleRestaurantStatus}
              disabled={isLoading}
              trackColor={{ false: '#767577', true: '#ff6b00' }}
              thumbColor={restaurantStatus === 'online' ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="users" size={20} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Dine-in Availability</Text>
            </View>
            
            <Switch
              value={dineInStatus}
              onValueChange={handleToggleDineInStatus}
              disabled={isLoading}
              trackColor={{ false: '#767577', true: '#ff6b00' }}
              thumbColor={dineInStatus ? '#fff' : '#f4f3f4'}
            />
          </View>
        </Card>
        
        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Divider style={styles.divider} />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <View style={styles.settingInfo}>
              <Icon name="user" size={20} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Profile</Text>
            </View>
            
            <Icon name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsLogoutModalVisible(true)}
          >
            <View style={styles.settingInfo}>
              <Icon name="sign-out" size={20} color="#F44336" style={styles.settingIcon} />
              <Text style={[styles.settingLabel, styles.logoutText]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </Card>
        
        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>QRSay Admin</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              QRSay is a digital menu and food ordering platform for restaurants.
            </Text>
          </View>
        </Card>
      </ScrollView>
      
      {/* Logout Confirmation Modal */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={() => {
                  setIsLogoutModalVisible(false);
                  handleLogout();
                }}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  divider: {
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  logoutText: {
    color: '#F44336',
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b00',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#F44336',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
