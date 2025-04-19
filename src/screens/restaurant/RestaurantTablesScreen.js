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
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import restaurantService from '../../services/restaurant.service';
import Header from '../../components/common/Header';

const RestaurantTablesScreen = () => {
  const [tables, setTables] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    tableName: '',
    roomId: '',
    capacity: '2',
  });
  const [editTableId, setEditTableId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load tables
      const tablesResponse = await restaurantService.getRestaurantTables();
      if (tablesResponse && tablesResponse.data && tablesResponse.data.tables) {
        setTables(tablesResponse.data.tables);
      }
      
      // Load rooms
      const roomsResponse = await restaurantService.getRestaurantRooms();
      if (roomsResponse && roomsResponse.data && roomsResponse.data.rooms) {
        setRooms(roomsResponse.data.rooms);
        
        // Set default room if available
        if (roomsResponse.data.rooms.length > 0) {
          setFormData(prev => ({
            ...prev,
            roomId: roomsResponse.data.rooms[0]._id
          }));
        }
      }
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Error', 'Failed to load tables and rooms');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const validateForm = () => {
    if (!formData.tableName.trim()) {
      Alert.alert('Validation Error', 'Table name is required');
      return false;
    }
    
    if (!formData.roomId) {
      Alert.alert('Validation Error', 'Please select a room');
      return false;
    }
    
    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity <= 0) {
      Alert.alert('Validation Error', 'Capacity must be a positive number');
      return false;
    }
    
    return true;
  };
  
  const handleAddTable = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const data = {
        tableName: formData.tableName,
        roomId: formData.roomId,
        capacity: parseInt(formData.capacity),
      };
      
      const response = await restaurantService.addRestaurantTable(data);
      
      if (response && response.data && response.data.status === 'success') {
        setFormData({
          tableName: '',
          roomId: rooms.length > 0 ? rooms[0]._id : '',
          capacity: '2',
        });
        setIsAddModalVisible(false);
        loadData();
        Alert.alert('Success', 'Table added successfully');
      }
    } catch (error) {
      console.error('Add table error:', error);
      Alert.alert('Error', 'Failed to add table');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditTable = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const data = {
        tableName: formData.tableName,
        roomId: formData.roomId,
        capacity: parseInt(formData.capacity),
      };
      
      const response = await restaurantService.updateRestaurantTable(editTableId, data);
      
      if (response && response.data && response.data.status === 'success') {
        setFormData({
          tableName: '',
          roomId: rooms.length > 0 ? rooms[0]._id : '',
          capacity: '2',
        });
        setEditTableId(null);
        setIsEditModalVisible(false);
        loadData();
        Alert.alert('Success', 'Table updated successfully');
      }
    } catch (error) {
      console.error('Edit table error:', error);
      Alert.alert('Error', 'Failed to update table');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteTable = (tableId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this table?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await restaurantService.deleteRestaurantTable(tableId);
              
              if (response && response.data && response.data.status === 'success') {
                loadData();
                Alert.alert('Success', 'Table deleted successfully');
              }
            } catch (error) {
              console.error('Delete table error:', error);
              Alert.alert('Error', 'Failed to delete table');
            }
          }
        }
      ]
    );
  };
  
  const openEditModal = (table) => {
    setFormData({
      tableName: table.tableName,
      roomId: table.roomId,
      capacity: table.capacity.toString(),
    });
    setEditTableId(table._id);
    setIsEditModalVisible(true);
  };
  
  const getRoomName = (roomId) => {
    const room = rooms.find(r => r._id === roomId);
    return room ? room.roomName : 'Unknown Room';
  };
  
  const renderItem = ({ item }) => (
    <Card containerStyle={styles.tableCard}>
      <View style={styles.tableContent}>
        <View style={styles.tableInfo}>
          <Text style={styles.tableName}>{item.tableName}</Text>
          <Text style={styles.roomName}>{getRoomName(item.roomId)}</Text>
          <Text style={styles.capacity}>Capacity: {item.capacity} people</Text>
        </View>
        
        <View style={styles.tableActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => openEditModal(item)}
          >
            <Icon name="edit" size={16} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteTable(item._id)}
          >
            <Icon name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Restaurant Tables" showBackButton />
      
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (rooms.length === 0) {
              Alert.alert(
                'No Rooms Available',
                'You need to create at least one room before adding tables.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Go to Rooms', 
                    onPress: () => navigation.navigate('RestaurantRooms')
                  }
                ]
              );
              return;
            }
            
            setFormData({
              tableName: '',
              roomId: rooms.length > 0 ? rooms[0]._id : '',
              capacity: '2',
            });
            setIsAddModalVisible(true);
          }}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Table</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.roomsButton}
          onPress={() => navigation.navigate('RestaurantRooms')}
        >
          <Icon name="building" size={16} color="#fff" />
          <Text style={styles.roomsButtonText}>Manage Rooms</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <ActivityIndicator size="large" color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={tables}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="table" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No tables found</Text>
              {rooms.length > 0 ? (
                <TouchableOpacity
                  style={styles.addFirstButton}
                  onPress={() => {
                    setFormData({
                      tableName: '',
                      roomId: rooms[0]._id,
                      capacity: '2',
                    });
                    setIsAddModalVisible(true);
                  }}
                >
                  <Text style={styles.addFirstButtonText}>Add Your First Table</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.addFirstButton}
                  onPress={() => navigation.navigate('RestaurantRooms')}
                >
                  <Text style={styles.addFirstButtonText}>Add Room First</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
      
      {/* Add Table Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Table</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Table Name</Text>
              <TextInput
                style={styles.input}
                value={formData.tableName}
                onChangeText={(text) => handleInputChange('tableName', text)}
                placeholder="Enter table name (e.g. Table 1)"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Room</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.roomId}
                  onValueChange={(itemValue) => handleInputChange('roomId', itemValue)}
                  style={styles.picker}
                >
                  {rooms.map((room) => (
                    <Picker.Item 
                      key={room._id} 
                      label={room.roomName} 
                      value={room._id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Capacity</Text>
              <TextInput
                style={styles.input}
                value={formData.capacity}
                onChangeText={(text) => handleInputChange('capacity', text)}
                placeholder="Enter capacity"
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
                onPress={handleAddTable}
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
      
      {/* Edit Table Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Table</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Table Name</Text>
              <TextInput
                style={styles.input}
                value={formData.tableName}
                onChangeText={(text) => handleInputChange('tableName', text)}
                placeholder="Enter table name (e.g. Table 1)"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Room</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.roomId}
                  onValueChange={(itemValue) => handleInputChange('roomId', itemValue)}
                  style={styles.picker}
                >
                  {rooms.map((room) => (
                    <Picker.Item 
                      key={room._id} 
                      label={room.roomName} 
                      value={room._id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Capacity</Text>
              <TextInput
                style={styles.input}
                value={formData.capacity}
                onChangeText={(text) => handleInputChange('capacity', text)}
                placeholder="Enter capacity"
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
                onPress={handleEditTable}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  roomsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  roomsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  tableCard: {
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  tableContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableInfo: {
    flex: 1,
  },
  tableName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  capacity: {
    fontSize: 14,
    color: '#333',
  },
  tableActions: {
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

export default RestaurantTablesScreen;
