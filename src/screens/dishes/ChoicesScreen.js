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
import { Card, Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import dishService from '../../services/dish.service';
import Header from '../../components/common/Header';

const ChoicesScreen = () => {
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    options: [{ name: '', price: '0' }],
    required: false,
    multiSelect: false,
  });
  const [editChoiceId, setEditChoiceId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadChoices();
  }, []);
  
  const loadChoices = async () => {
    try {
      setIsLoading(true);
      const response = await dishService.getChoices();
      
      if (response && response.data && response.data.choices) {
        setChoices(response.data.choices);
      }
    } catch (error) {
      console.error('Load choices error:', error);
      Alert.alert('Error', 'Failed to load choices');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadChoices();
  };
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      options: updatedOptions,
    });
  };
  
  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { name: '', price: '0' }],
    });
  };
  
  const removeOption = (index) => {
    if (formData.options.length <= 1) {
      Alert.alert('Error', 'At least one option is required');
      return;
    }
    
    const updatedOptions = [...formData.options];
    updatedOptions.splice(index, 1);
    
    setFormData({
      ...formData,
      options: updatedOptions,
    });
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Choice name is required');
      return false;
    }
    
    for (let i = 0; i < formData.options.length; i++) {
      if (!formData.options[i].name.trim()) {
        Alert.alert('Validation Error', `Option ${i + 1} name is required`);
        return false;
      }
      
      const price = parseFloat(formData.options[i].price);
      if (isNaN(price) || price < 0) {
        Alert.alert('Validation Error', `Option ${i + 1} price must be a valid number`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleAddChoice = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const data = {
        name: formData.name,
        options: formData.options.map(option => ({
          name: option.name,
          price: parseFloat(option.price),
        })),
        required: formData.required,
        multiSelect: formData.multiSelect,
      };
      
      const response = await dishService.addChoice(data);
      
      if (response && response.data && response.data.status === 'success') {
        resetForm();
        setIsAddModalVisible(false);
        loadChoices();
        Alert.alert('Success', 'Choice added successfully');
      }
    } catch (error) {
      console.error('Add choice error:', error);
      Alert.alert('Error', 'Failed to add choice');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditChoice = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const data = {
        name: formData.name,
        options: formData.options.map(option => ({
          name: option.name,
          price: parseFloat(option.price),
        })),
        required: formData.required,
        multiSelect: formData.multiSelect,
      };
      
      const response = await dishService.updateChoice(editChoiceId, data);
      
      if (response && response.data && response.data.status === 'success') {
        resetForm();
        setEditChoiceId(null);
        setIsEditModalVisible(false);
        loadChoices();
        Alert.alert('Success', 'Choice updated successfully');
      }
    } catch (error) {
      console.error('Edit choice error:', error);
      Alert.alert('Error', 'Failed to update choice');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteChoice = (choiceId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this choice?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await dishService.deleteChoice(choiceId);
              
              if (response && response.data && response.data.status === 'success') {
                loadChoices();
                Alert.alert('Success', 'Choice deleted successfully');
              }
            } catch (error) {
              console.error('Delete choice error:', error);
              Alert.alert('Error', 'Failed to delete choice');
            }
          }
        }
      ]
    );
  };
  
  const openEditModal = (choice) => {
    setFormData({
      name: choice.name,
      options: choice.options.map(option => ({
        name: option.name,
        price: option.price.toString(),
      })),
      required: choice.required,
      multiSelect: choice.multiSelect,
    });
    setEditChoiceId(choice._id);
    setIsEditModalVisible(true);
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      options: [{ name: '', price: '0' }],
      required: false,
      multiSelect: false,
    });
  };
  
  const renderItem = ({ item }) => (
    <Card containerStyle={styles.choiceCard}>
      <View style={styles.choiceHeader}>
        <Text style={styles.choiceName}>{item.name}</Text>
        <View style={styles.choiceBadges}>
          {item.required && (
            <View style={[styles.badge, styles.requiredBadge]}>
              <Text style={styles.badgeText}>Required</Text>
            </View>
          )}
          <View style={[styles.badge, item.multiSelect ? styles.multiSelectBadge : styles.singleSelectBadge]}>
            <Text style={styles.badgeText}>
              {item.multiSelect ? 'Multi Select' : 'Single Select'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.optionsContainer}>
        {item.options.map((option, index) => (
          <View key={index} style={styles.optionItem}>
            <Text style={styles.optionName}>{option.name}</Text>
            {option.price > 0 && (
              <Text style={styles.optionPrice}>+${option.price.toFixed(2)}</Text>
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.choiceActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Icon name="edit" size={16} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteChoice(item._id)}
        >
          <Icon name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </Card>
  );
  
  const renderChoiceForm = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Choice Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Enter choice name (e.g. Size, Toppings)"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Options</Text>
        {formData.options.map((option, index) => (
          <View key={index} style={styles.optionForm}>
            <View style={styles.optionInputs}>
              <View style={styles.optionNameInput}>
                <TextInput
                  style={styles.input}
                  value={option.name}
                  onChangeText={(text) => handleOptionChange(index, 'name', text)}
                  placeholder="Option name"
                />
              </View>
              
              <View style={styles.optionPriceInput}>
                <TextInput
                  style={styles.input}
                  value={option.price}
                  onChangeText={(text) => handleOptionChange(index, 'price', text)}
                  placeholder="Price"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.removeOptionButton}
              onPress={() => removeOption(index)}
            >
              <Icon name="times" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity
          style={styles.addOptionButton}
          onPress={addOption}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addOptionButtonText}>Add Option</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.checkboxContainer}>
        <CheckBox
          title="Required"
          checked={formData.required}
          onPress={() => handleInputChange('required', !formData.required)}
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxText}
          checkedColor="#ff6b00"
        />
        
        <CheckBox
          title="Multi Select"
          checked={formData.multiSelect}
          onPress={() => handleInputChange('multiSelect', !formData.multiSelect)}
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxText}
          checkedColor="#ff6b00"
        />
      </View>
    </>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Choices" showBackButton />
      
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setIsAddModalVisible(true);
          }}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Choice</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <ActivityIndicator size={50} color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={choices}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="check-square-o" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No choices found</Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => {
                  resetForm();
                  setIsAddModalVisible(true);
                }}
              >
                <Text style={styles.addFirstButtonText}>Add Your First Choice</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* Add Choice Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Choice</Text>
            
            <ScrollView style={styles.modalScroll}>
              {renderChoiceForm()}
            </ScrollView>
            
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
                onPress={handleAddChoice}
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
      
      {/* Edit Choice Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Choice</Text>
            
            <ScrollView style={styles.modalScroll}>
              {renderChoiceForm()}
            </ScrollView>
            
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
                onPress={handleEditChoice}
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
    backgroundColor: '#FF9800',
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
  choiceCard: {
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  choiceHeader: {
    marginBottom: 10,
  },
  choiceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  choiceBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  requiredBadge: {
    backgroundColor: '#F44336',
  },
  singleSelectBadge: {
    backgroundColor: '#2196F3',
  },
  multiSelectBadge: {
    backgroundColor: '#4CAF50',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginBottom: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionName: {
    fontSize: 14,
  },
  optionPrice: {
    fontSize: 14,
    color: '#ff6b00',
    fontWeight: 'bold',
  },
  choiceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    backgroundColor: '#FF9800',
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
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
  optionForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionInputs: {
    flexDirection: 'row',
    flex: 1,
  },
  optionNameInput: {
    flex: 2,
    marginRight: 5,
  },
  optionPriceInput: {
    flex: 1,
  },
  removeOptionButton: {
    padding: 10,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addOptionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  checkboxText: {
    fontWeight: 'normal',
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
    backgroundColor: '#FF9800',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChoicesScreen;
