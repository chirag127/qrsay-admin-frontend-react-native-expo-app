import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { Card, Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import restaurantService from '../../services/restaurant.service';
import Header from '../../components/common/Header';

const RestaurantContactDetailsScreen = () => {
  const [contactDetails, setContactDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    contactType: 'phone',
    contactValue: '',
    isActive: true,
  });
  const [editContactId, setEditContactId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadContactDetails();
  }, []);
  
  const loadContactDetails = async () => {
    try {
      setIsLoading(true);
      const response = await restaurantService.getRestaurantContactDetails();
      
      if (response && response.data && response.data.contactDetails) {
        setContactDetails(response.data.contactDetails);
      }
    } catch (error) {
      console.error('Load contact details error:', error);
      Alert.alert('Error', 'Failed to load contact details');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadContactDetails();
  };
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const validateForm = () => {
    if (!formData.contactValue.trim()) {
      Alert.alert('Validation Error', 'Contact value is required');
      return false;
    }
    
    return true;
  };
  
  const handleAddContact = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await restaurantService.addRestaurantContactDetail(formData);
      
      if (response && response.data && response.data.status === 'success') {
        setFormData({
          contactType: 'phone',
          contactValue: '',
          isActive: true,
        });
        setIsAddModalVisible(false);
        loadContactDetails();
        Alert.alert('Success', 'Contact detail added successfully');
      }
    } catch (error) {
      console.error('Add contact detail error:', error);
      Alert.alert('Error', 'Failed to add contact detail');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditContact = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await restaurantService.updateRestaurantContactDetail(editContactId, formData);
      
      if (response && response.data && response.data.status === 'success') {
        setFormData({
          contactType: 'phone',
          contactValue: '',
          isActive: true,
        });
        setEditContactId(null);
        setIsEditModalVisible(false);
        loadContactDetails();
        Alert.alert('Success', 'Contact detail updated successfully');
      }
    } catch (error) {
      console.error('Edit contact detail error:', error);
      Alert.alert('Error', 'Failed to update contact detail');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteContact = (contactId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this contact detail?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await restaurantService.deleteRestaurantContactDetail(contactId);
              
              if (response && response.data && response.data.status === 'success') {
                loadContactDetails();
                Alert.alert('Success', 'Contact detail deleted successfully');
              }
            } catch (error) {
              console.error('Delete contact detail error:', error);
              Alert.alert('Error', 'Failed to delete contact detail');
            }
          }
        }
      ]
    );
  };
  
  const openEditModal = (contact) => {
    setFormData({
      contactType: contact.contactType,
      contactValue: contact.contactValue,
      isActive: contact.isActive,
    });
    setEditContactId(contact._id);
    setIsEditModalVisible(true);
  };
  
  const getContactTypeIcon = (type) => {
    switch (type) {
      case 'phone':
        return 'phone';
      case 'email':
        return 'envelope';
      case 'website':
        return 'globe';
      case 'facebook':
        return 'facebook';
      case 'instagram':
        return 'instagram';
      case 'twitter':
        return 'twitter';
      case 'whatsapp':
        return 'whatsapp';
      default:
        return 'info-circle';
    }
  };
  
  const getContactTypeLabel = (type) => {
    switch (type) {
      case 'phone':
        return 'Phone';
      case 'email':
        return 'Email';
      case 'website':
        return 'Website';
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'twitter':
        return 'Twitter';
      case 'whatsapp':
        return 'WhatsApp';
      default:
        return 'Other';
    }
  };
  
  const renderItem = ({ item }) => (
    <Card containerStyle={styles.contactCard}>
      <View style={styles.contactContent}>
        <View style={styles.contactInfo}>
          <View style={styles.contactTypeContainer}>
            <Icon name={getContactTypeIcon(item.contactType)} size={20} color="#ff6b00" style={styles.contactTypeIcon} />
            <Text style={styles.contactType}>{getContactTypeLabel(item.contactType)}</Text>
          </View>
          <Text style={styles.contactValue}>{item.contactValue}</Text>
          <View style={[styles.statusBadge, item.isActive ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={styles.statusText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>
        
        <View style={styles.contactActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => openEditModal(item)}
          >
            <Icon name="edit" size={16} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteContact(item._id)}
          >
            <Icon name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Contact Details" showBackButton />
      
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setFormData({
              contactType: 'phone',
              contactValue: '',
              isActive: true,
            });
            setIsAddModalVisible(true);
          }}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <ActivityIndicator size={50} color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={contactDetails}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="address-book" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No contact details found</Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => {
                  setFormData({
                    contactType: 'phone',
                    contactValue: '',
                    isActive: true,
                  });
                  setIsAddModalVisible(true);
                }}
              >
                <Text style={styles.addFirstButtonText}>Add Your First Contact</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* Add Contact Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Contact Detail</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.contactType}
                  onValueChange={(itemValue) => handleInputChange('contactType', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Phone" value="phone" />
                  <Picker.Item label="Email" value="email" />
                  <Picker.Item label="Website" value="website" />
                  <Picker.Item label="Facebook" value="facebook" />
                  <Picker.Item label="Instagram" value="instagram" />
                  <Picker.Item label="Twitter" value="twitter" />
                  <Picker.Item label="WhatsApp" value="whatsapp" />
                </Picker>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact Value</Text>
              <TextInput
                style={styles.input}
                value={formData.contactValue}
                onChangeText={(text) => handleInputChange('contactValue', text)}
                placeholder="Enter contact value"
                keyboardType={formData.contactType === 'phone' || formData.contactType === 'whatsapp' ? 'phone-pad' : formData.contactType === 'email' ? 'email-address' : 'default'}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.isActive ? styles.activeStatusButton : styles.inactiveStatusButton
                  ]}
                  onPress={() => handleInputChange('isActive', true)}
                >
                  <Text style={formData.isActive ? styles.activeStatusButtonText : styles.inactiveStatusButtonText}>
                    Active
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    !formData.isActive ? styles.activeStatusButton : styles.inactiveStatusButton
                  ]}
                  onPress={() => handleInputChange('isActive', false)}
                >
                  <Text style={!formData.isActive ? styles.activeStatusButtonText : styles.inactiveStatusButtonText}>
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddContact}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Edit Contact Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Contact Detail</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.contactType}
                  onValueChange={(itemValue) => handleInputChange('contactType', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Phone" value="phone" />
                  <Picker.Item label="Email" value="email" />
                  <Picker.Item label="Website" value="website" />
                  <Picker.Item label="Facebook" value="facebook" />
                  <Picker.Item label="Instagram" value="instagram" />
                  <Picker.Item label="Twitter" value="twitter" />
                  <Picker.Item label="WhatsApp" value="whatsapp" />
                </Picker>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact Value</Text>
              <TextInput
                style={styles.input}
                value={formData.contactValue}
                onChangeText={(text) => handleInputChange('contactValue', text)}
                placeholder="Enter contact value"
                keyboardType={formData.contactType === 'phone' || formData.contactType === 'whatsapp' ? 'phone-pad' : formData.contactType === 'email' ? 'email-address' : 'default'}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.isActive ? styles.activeStatusButton : styles.inactiveStatusButton
                  ]}
                  onPress={() => handleInputChange('isActive', true)}
                >
                  <Text style={formData.isActive ? styles.activeStatusButtonText : styles.inactiveStatusButtonText}>
                    Active
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    !formData.isActive ? styles.activeStatusButton : styles.inactiveStatusButton
                  ]}
                  onPress={() => handleInputChange('isActive', false)}
                >
                  <Text style={!formData.isActive ? styles.activeStatusButtonText : styles.inactiveStatusButtonText}>
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditContact}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
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
  actionBar: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  contactCard: {
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  contactContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactTypeIcon: {
    marginRight: 5,
  },
  contactType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  inactiveBadge: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addFirstButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
  },
  activeStatusButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  inactiveStatusButton: {
    backgroundColor: '#f9f9f9',
  },
  activeStatusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveStatusButtonText: {
    color: '#666',
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
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RestaurantContactDetailsScreen;
