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
import { useNavigation } from '@react-navigation/native';
import restaurantService from '../../services/restaurant.service';
import Header from '../../components/common/Header';

const RestaurantRoomsScreen = () => {
  const navigation = useNavigation();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [editRoomId, setEditRoomId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadRooms();
  }, []);
  
  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const response = await restaurantService.getRestaurantRooms();
      
      if (response && response.data && response.data.rooms) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      console.error('Load rooms error:', error);
      Alert.alert('Error', 'Failed to load rooms');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadRooms();
  };
  
  const handleAddRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Validation Error', 'Room name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await restaurantService.addRestaurantRoom({ roomName });
      
      if (response && response.data && response.data.status === 'success') {
        setRoomName('');
        setIsAddModalVisible(false);
        loadRooms();
        Alert.alert('Success', 'Room added successfully');
      }
    } catch (error) {
      console.error('Add room error:', error);
      Alert.alert('Error', 'Failed to add room');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Validation Error', 'Room name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await restaurantService.updateRestaurantRoom(editRoomId, { roomName });
      
      if (response && response.data && response.data.status === 'success') {
        setRoomName('');
        setEditRoomId(null);
        setIsEditModalVisible(false);
        loadRooms();
        Alert.alert('Success', 'Room updated successfully');
      }
    } catch (error) {
      console.error('Edit room error:', error);
      Alert.alert('Error', 'Failed to update room');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteRoom = (roomId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this room? This will also delete all tables in this room.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await restaurantService.deleteRestaurantRoom(roomId);
              
              if (response && response.data && response.data.status === 'success') {
                loadRooms();
                Alert.alert('Success', 'Room deleted successfully');
              }
            } catch (error) {
              console.error('Delete room error:', error);
              Alert.alert('Error', 'Failed to delete room');
            }
          }
        }
      ]
    );
  };
  
  const openEditModal = (room) => {
    setRoomName(room.roomName);
    setEditRoomId(room._id);
    setIsEditModalVisible(true);
  };
  
  const renderItem = ({ item }) => (
    <Card containerStyle={styles.roomCard}>
      <View style={styles.roomContent}>
        <Text style={styles.roomName}>{item.roomName}</Text>
        
        <View style={styles.roomActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => openEditModal(item)}
          >
            <Icon name="edit" size={16} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteRoom(item._id)}
          >
            <Icon name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Restaurant Rooms" showBackButton />
      
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setRoomName('');
            setIsAddModalVisible(true);
          }}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Room</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <ActivityIndicator size={50} color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="building" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No rooms found</Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => {
                  setRoomName('');
                  setIsAddModalVisible(true);
                }}
              >
                <Text style={styles.addFirstButtonText}>Add Your First Room</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* Add Room Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Room</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Room Name</Text>
              <TextInput
                style={styles.input}
                value={roomName}
                onChangeText={setRoomName}
                placeholder="Enter room name (e.g. Main Hall, Patio)"
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
                onPress={handleAddRoom}
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
      
      {/* Edit Room Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Room</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Room Name</Text>
              <TextInput
                style={styles.input}
                value={roomName}
                onChangeText={setRoomName}
                placeholder="Enter room name (e.g. Main Hall, Patio)"
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
                onPress={handleEditRoom}
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
    backgroundColor: '#2196F3',
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
  roomCard: {
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  roomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomActions: {
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
    backgroundColor: '#2196F3',
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
    backgroundColor: '#2196F3',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RestaurantRoomsScreen;
