import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/user.service';
import Header from '../../components/common/Header';

const UserProfileScreen = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const handlePasswordInputChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value,
    });
  };
  
  const validateProfileForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      Alert.alert('Validation Error', 'Current password is required');
      return false;
    }
    
    if (!passwordData.newPassword) {
      Alert.alert('Validation Error', 'New password is required');
      return false;
    }
    
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Validation Error', 'New password must be at least 6 characters');
      return false;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return;
    
    try {
      setIsLoading(true);
      
      const response = await userService.updateProfile(formData);
      
      if (response && response.data && response.data.status === 'success') {
        await updateUserProfile(response.data.user);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      setIsLoading(true);
      
      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response && response.data && response.data.status === 'success') {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);
        Alert.alert('Success', 'Password changed successfully');
      }
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderViewMode = () => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Profile Information</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Icon name="edit" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{user?.name || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{user?.phone || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>{user?.role || 'N/A'}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.changePasswordButton}
        onPress={() => setIsChangingPassword(true)}
      >
        <Icon name="lock" size={16} color="#fff" />
        <Text style={styles.changePasswordButtonText}>Change Password</Text>
      </TouchableOpacity>
    </Card>
  );
  
  const renderEditMode = () => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setIsEditing(false)}
          disabled={isLoading}
        >
          <Icon name="times" size={16} color="#666" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Enter your name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>
      
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleUpdateProfile}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Icon name="save" size={16} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </>
        )}
      </TouchableOpacity>
    </Card>
  );
  
  const renderChangePasswordMode = () => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Change Password</Text>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => {
            setIsChangingPassword(false);
            setPasswordData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          }}
          disabled={isLoading}
        >
          <Icon name="times" size={16} color="#666" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          value={passwordData.currentPassword}
          onChangeText={(text) => handlePasswordInputChange('currentPassword', text)}
          placeholder="Enter current password"
          secureTextEntry
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={passwordData.newPassword}
          onChangeText={(text) => handlePasswordInputChange('newPassword', text)}
          placeholder="Enter new password"
          secureTextEntry
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={passwordData.confirmPassword}
          onChangeText={(text) => handlePasswordInputChange('confirmPassword', text)}
          placeholder="Confirm new password"
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleChangePassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Icon name="lock" size={16} color="#fff" />
            <Text style={styles.saveButtonText}>Change Password</Text>
          </>
        )}
      </TouchableOpacity>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <Header title="User Profile" showBackButton />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isEditing ? renderEditMode() : isChangingPassword ? renderChangePasswordMode() : renderViewMode()}
      </ScrollView>
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b00',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  profileInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#666',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default UserProfileScreen;
