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
  Modal
} from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import dishService from '../../services/dish.service';
import Header from '../../components/common/Header';

const ExtrasScreen = () => {
  const [extras, setExtras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });
  const [editExtraId, setEditExtraId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadExtras();
  }, []);
  
  const loadExtras = async () => {
    try {
      setIsLoading(true);
      const response = await dishService.getExtras();
      
      if (response && response.data && response.data.extras) {
        setExtras(response.data.extras);
      }
    } catch (error) {
      console.error('Load extras error:', error);
      Alert.alert('Error', 'Failed to load extras');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadExtras();
  };
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Extra name is required');
      return false;
    }
    
    if (!formData.price.trim()) {
      Alert.alert('Validation Error', 'Price is required');
      return false;
    }
    
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      Alert.alert('Validation Error', 'Price must be a valid number');
      return false;
    }
    
    return true;
  };
  
  const handleAddExtra = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
      };
      
      const response = await dishService.addExtra(data);
      
      if (response && response.data && response.data.status === 'success') {
        setFormData({ name: '', price: '' });
        setIsAddModalVisible(false);
        loadExtras();
        Alert.alert('Success', 'Extra added successfully');
      }
    } catch (error) {
      console.error('Add extra error:', error);
      Alert.alert('Error', 'Failed to add extra');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditExtra = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
      };
      
      const response = await dishService.updateExtra(editExtraId, data);
      
      if (response && response.data && response.data.status === 'success') {
        setFormData({ name: '', price: '' });
        setEditExtraId(null);
        setIsEditModalVisible(false);
        loadExtras();
        Alert.alert('Success', 'Extra updated successfully');
      }
    } catch (error) {
      console.error('Edit extra error:', error);
      Alert.alert('Error', 'Failed to update extra');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteExtra = (extraId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this extra?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await dishService.deleteExtra(extraId);
              
              if (response && response.data && response.data.status === 'success') {
                loadExtras();
                Alert.alert('Success', 'Extra deleted successfully');
              }
            } catch (error) {
              console.error('Delete extra error:', error);
              Alert.alert('Error', 'Failed to delete extra');
            }
          }
        }
      ]
    );
  };
  
  const openEditModal = (extra) => {
    setFormData({
      name: extra.name,
      price: extra.price.toString(),
    });
    setEditExtraId(extra._id);
    setIsEditModalVisible(true);
  };
  
  const renderItem = ({ item }) => (
    <Card containerStyle={styles.extraCard}>
      <View style={styles.extraContent}>
        <View style={styles.extraInfo}>
          <Text style={styles.extraName}>{item.name}</Text>
          <Text style={styles.extraPrice}>${item.price.toFixed(2)}</Text>
        </View>
        
        <View style={styles.extraActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => openEditModal(item)}
          >
            <Icon name="edit" size={16} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteExtra(item._id)}
          >
            <Icon name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Extras" showBackButton />
      
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setFormData({ name: '', price: '' });
            setIsAddModalVisible(true);
          }}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Extra</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <ActivityIndicator size={50} color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={extras}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="plus-circle" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No extras found</Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => {
                  setFormData({ name: '', price: '' });
                  setIsAddModalVisible(true);
                }}
              >
                <Text style={styles.addFirstButtonText}>Add Your First Extra</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* Add Extra Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Extra</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter extra name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => handleInputChange('price', text)}
                placeholder="Enter price"
                keyboardType="numeric"
              />
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
                onPress={handleAddExtra}
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
      
      {/* Edit Extra Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Extra</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter extra name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => handleInputChange('price', text)}
                placeholder="Enter price"
                keyboardType="numeric"
              />
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
                onPress={handleEditExtra}
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
    backgroundColor: '#9C27B0',
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
  extraCard: {
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  extraContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extraInfo: {
    flex: 1,
  },
  extraName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  extraPrice: {
    fontSize: 14,
    color: '#ff6b00',
    fontWeight: 'bold',
  },
  extraActions: {
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
    backgroundColor: '#9C27B0',
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
    backgroundColor: '#9C27B0',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExtrasScreen;
