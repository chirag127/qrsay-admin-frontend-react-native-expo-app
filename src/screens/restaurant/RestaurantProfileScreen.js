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
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useRestaurant } from '../../context/RestaurantContext';
import restaurantService from '../../services/restaurant.service';
import Header from '../../components/common/Header';

const RestaurantProfileScreen = () => {
  const navigation = useNavigation();
  const { restaurantData, loadRestaurantData } = useRestaurant();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    restaurantName: '',
    restaurantAddress: '',
    restaurantCity: '',
    restaurantState: '',
    restaurantZipCode: '',
    restaurantCountry: '',
    restaurantPhone: '',
    restaurantEmail: '',
    restaurantWebsite: '',
    restaurantDescription: '',
    restaurantCuisine: '',
    restaurantTiming: '',
  });

  useEffect(() => {
    if (restaurantData) {
      setFormData({
        restaurantName: restaurantData.restaurantName || '',
        restaurantAddress: restaurantData.restaurantAddress || '',
        restaurantCity: restaurantData.restaurantCity || '',
        restaurantState: restaurantData.restaurantState || '',
        restaurantZipCode: restaurantData.restaurantZipCode || '',
        restaurantCountry: restaurantData.restaurantCountry || '',
        restaurantPhone: restaurantData.restaurantPhone || '',
        restaurantEmail: restaurantData.restaurantEmail || '',
        restaurantWebsite: restaurantData.restaurantWebsite || '',
        restaurantDescription: restaurantData.restaurantDescription || '',
        restaurantCuisine: restaurantData.restaurantCuisine || '',
        restaurantTiming: restaurantData.restaurantTiming || '',
      });
      setIsLoading(false);
    } else {
      loadRestaurantData();
    }
  }, [restaurantData]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      await restaurantService.updateRestaurantProfile(formData);
      
      await loadRestaurantData();
      setIsEditing(false);
      
      Alert.alert('Success', 'Restaurant profile updated successfully');
    } catch (error) {
      console.error('Update restaurant profile error:', error);
      Alert.alert('Error', 'An error occurred while updating restaurant profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderViewMode = () => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Restaurant Information</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Icon name="edit" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantName || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantAddress || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>City:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantCity || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>State:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantState || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Zip Code:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantZipCode || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Country:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantCountry || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantPhone || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantEmail || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Website:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantWebsite || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cuisine:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantCuisine || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Timing:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantTiming || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Description:</Text>
          <Text style={styles.infoValue}>{restaurantData.restaurantDescription || 'N/A'}</Text>
        </View>
      </View>
      
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => navigation.navigate('RestaurantGallery')}
        >
          <Icon name="image" size={16} color="#fff" />
          <Text style={styles.navigationButtonText}>Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => navigation.navigate('RestaurantTables')}
        >
          <Icon name="table" size={16} color="#fff" />
          <Text style={styles.navigationButtonText}>Tables</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => navigation.navigate('RestaurantRooms')}
        >
          <Icon name="building" size={16} color="#fff" />
          <Text style={styles.navigationButtonText}>Rooms</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => navigation.navigate('RestaurantQrCode')}
        >
          <Icon name="qrcode" size={16} color="#fff" />
          <Text style={styles.navigationButtonText}>QR Code</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => navigation.navigate('RestaurantContactDetails')}
        >
          <Icon name="address-book" size={16} color="#fff" />
          <Text style={styles.navigationButtonText}>Contact Details</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderEditMode = () => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Edit Restaurant Information</Text>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setIsEditing(false)}
          disabled={isSubmitting}
        >
          <Icon name="times" size={16} color="#666" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formSection}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Restaurant Name</Text>
          <TextInput
            style={styles.formInput}
            value={formData.restaurantName}
            onChangeText={(text) => handleInputChange('restaurantName', text)}
            placeholder="Enter restaurant name"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Address</Text>
          <TextInput
            style={styles.formInput}
            value={formData.restaurantAddress}
            onChangeText={(text) => handleInputChange('restaurantAddress', text)}
            placeholder="Enter address"
          />
        </View>
        
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 5 }]}>
            <Text style={styles.formLabel}>City</Text>
            <TextInput
              style={styles.formInput}
              value={formData.restaurantCity}
              onChangeText={(text) => handleInputChange('restaurantCity', text)}
              placeholder="Enter city"
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 5 }]}>
            <Text style={styles.formLabel}>State</Text>
            <TextInput
              style={styles.formInput}
              value={formData.restaurantState}
              onChangeText={(text) => handleInputChange('restaurantState', text)}
              placeholder="Enter state"
            />
          </View>
        </View>
        
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 5 }]}>
            <Text style={styles.formLabel}>Zip Code</Text>
            <TextInput
              style={styles.formInput}
              value={formData.restaurantZipCode}
              onChangeText={(text) => handleInputChange('restaurantZipCode', text)}
              placeholder="Enter zip code"
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 5 }]}>
            <Text style={styles.formLabel}>Country</Text>
            <TextInput
              style={styles.formInput}
              value={formData.restaurantCountry}
              onChangeText={(text) => handleInputChange('restaurantCountry', text)}
              placeholder="Enter country"
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Phone</Text>
          <TextInput
            style={styles.formInput}
            value={formData.restaurantPhone}
            onChangeText={(text) => handleInputChange('restaurantPhone', text)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            style={styles.formInput}
            value={formData.restaurantEmail}
            onChangeText={(text) => handleInputChange('restaurantEmail', text)}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Website</Text>
          <TextInput
            style={styles.formInput}
            value={formData.restaurantWebsite}
            onChangeText={(text) => handleInputChange('restaurantWebsite', text)}
            placeholder="Enter website"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Cuisine</Text>
          <TextInput
            style={styles.formInput}
            value={formData.restaurantCuisine}
            onChangeText={(text) => handleInputChange('restaurantCuisine', text)}
            placeholder="Enter cuisine type"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Timing</Text>
          <TextInput
            style={styles.formInput}
            value={formData.restaurantTiming}
            onChangeText={(text) => handleInputChange('restaurantTiming', text)}
            placeholder="Enter business hours"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Description</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            value={formData.restaurantDescription}
            onChangeText={(text) => handleInputChange('restaurantDescription', text)}
            placeholder="Enter restaurant description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="save" size={16} color="#fff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Restaurant Profile" />
        <ActivityIndicator size={50} color="#ff6b00" style={styles.loader} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Restaurant Profile" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isEditing ? renderEditMode() : renderViewMode()}
      </ScrollView>
    </KeyboardAvoidingView>
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
  infoSection: {
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
  navigationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '48%',
  },
  navigationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  formSection: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  formInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
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
    marginLeft: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RestaurantProfileScreen;
