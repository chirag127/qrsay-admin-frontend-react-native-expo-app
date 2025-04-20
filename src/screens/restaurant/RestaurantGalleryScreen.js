import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Appbar, Card, Button, FAB, Dialog, Portal, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

// This would typically come from an API service
const getRestaurantGallery = async (restaurantId) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          images: [
            { id: '1', url: 'https://via.placeholder.com/300x200?text=Restaurant+Image+1' },
            { id: '2', url: 'https://via.placeholder.com/300x200?text=Restaurant+Image+2' },
            { id: '3', url: 'https://via.placeholder.com/300x200?text=Restaurant+Image+3' },
          ]
        }
      });
    }, 1000);
  });
};

const RestaurantGalleryScreen = ({ navigation }) => {
  const { restaurant } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
  
  useEffect(() => {
    fetchGallery();
  }, []);
  
  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (restaurant && restaurant._id) {
        const response = await getRestaurantGallery(restaurant._id);
        
        if (response && response.data && response.data.images) {
          setImages(response.data.images);
        } else {
          setImages([]);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load gallery');
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGallery();
    setRefreshing(false);
  };
  
  const handleDeleteImage = async () => {
    if (!selectedImage) return;
    
    try {
      // This would typically be an API call
      // await deleteImage(selectedImage.id);
      
      // Update local state
      setImages(images.filter(img => img.id !== selectedImage.id));
      setDeleteDialogVisible(false);
      setSelectedImage(null);
      
      Alert.alert('Success', 'Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', 'Failed to delete image');
    }
  };
  
  const handleUploadImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to grant permission to access your photos');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        
        // This would typically upload the image to your server
        // const uploadResponse = await uploadImage(selectedAsset.uri);
        
        // For now, just add it to the local state
        const newImage = {
          id: Date.now().toString(),
          url: selectedAsset.uri,
        };
        
        setImages([newImage, ...images]);
        Alert.alert('Success', 'Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };
  
  const renderImageItem = ({ item }) => (
    <Card style={styles.imageCard}>
      <Card.Cover source={{ uri: item.url }} style={styles.image} />
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="outlined" 
          onPress={() => {
            setSelectedImage(item);
            setDeleteDialogVisible(true);
          }}
          style={styles.deleteButton}
          icon="delete"
        >
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );
  
  if (loading && !refreshing) {
    return <LoadingScreen />;
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Restaurant Gallery" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={renderImageItem}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No gallery images found</Text>
            <Button 
              mode="contained" 
              onPress={() => setUploadDialogVisible(true)}
              style={styles.uploadButton}
              icon="upload"
            >
              Upload Images
            </Button>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        color={COLORS.white}
        onPress={() => setUploadDialogVisible(true)}
      />
      
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Image</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this image?</Paragraph>
            <Paragraph>This action cannot be undone.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteImage} color={COLORS.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
        
        <Dialog visible={uploadDialogVisible} onDismiss={() => setUploadDialogVisible(false)}>
          <Dialog.Title>Upload Image</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Choose an image from your gallery to upload.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setUploadDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => {
              setUploadDialogVisible(false);
              handleUploadImage();
            }}>Choose Image</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  listContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge * 2,
  },
  imageCard: {
    flex: 1,
    margin: SIZES.base,
    maxWidth: '47%',
  },
  image: {
    height: 150,
  },
  cardActions: {
    justifyContent: 'center',
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.extraLarge * 2,
  },
  emptyText: {
    marginTop: SIZES.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
  },
  fab: {
    position: 'absolute',
    margin: SIZES.medium,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  errorContainer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.error,
  },
  errorText: {
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default RestaurantGalleryScreen;
