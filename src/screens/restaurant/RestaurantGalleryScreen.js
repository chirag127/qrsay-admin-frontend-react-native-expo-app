import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  Modal
} from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import restaurantService from '../../services/restaurant.service';
import Header from '../../components/common/Header';

const { width } = Dimensions.get('window');
const imageWidth = (width - 40) / 2;

const RestaurantGalleryScreen = () => {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  
  useEffect(() => {
    loadGallery();
    requestMediaLibraryPermission();
  }, []);
  
  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images!');
      }
    }
  };
  
  const loadGallery = async () => {
    try {
      setIsLoading(true);
      const response = await restaurantService.getRestaurantGallery();
      
      if (response && response.data && response.data.gallery) {
        setGallery(response.data.gallery);
      }
    } catch (error) {
      console.error('Load gallery error:', error);
      Alert.alert('Error', 'Failed to load gallery');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadGallery();
  };
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        uploadImage(selectedAsset);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const uploadImage = async (imageAsset) => {
    try {
      setIsUploading(true);
      
      // Create form data for image upload
      const formData = new FormData();
      const filename = imageAsset.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      
      formData.append('restaurantImage', {
        uri: imageAsset.uri,
        name: filename,
        type,
      });
      
      const response = await restaurantService.uploadRestaurantImage(formData);
      
      if (response && response.data && response.data.status === 'success') {
        loadGallery();
        Alert.alert('Success', 'Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload image error:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteImage = (imageId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await restaurantService.deleteRestaurantImage(imageId);
              
              if (response && response.data && response.data.status === 'success') {
                loadGallery();
                Alert.alert('Success', 'Image deleted successfully');
              }
            } catch (error) {
              console.error('Delete image error:', error);
              Alert.alert('Error', 'Failed to delete image');
            }
          }
        }
      ]
    );
  };
  
  const openImageView = (image) => {
    setSelectedImage(image);
    setIsImageViewVisible(true);
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => openImageView(item)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteImage(item._id)}
      >
        <Icon name="trash" size={16} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Restaurant Gallery" showBackButton />
      
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImage}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="upload" size={16} color="#fff" />
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <ActivityIndicator size={50} color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={gallery}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.galleryContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="image" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No images in gallery</Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={pickImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.addFirstButtonText}>Add Your First Image</Text>
                )}
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* Image View Modal */}
      <Modal
        visible={isImageViewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsImageViewVisible(false)}
      >
        <View style={styles.imageViewOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsImageViewVisible(false)}
          >
            <Icon name="times" size={24} color="#fff" />
          </TouchableOpacity>
          
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.imageUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
          
          {selectedImage && (
            <TouchableOpacity
              style={styles.imageViewDeleteButton}
              onPress={() => {
                setIsImageViewVisible(false);
                handleDeleteImage(selectedImage._id);
              }}
            >
              <Icon name="trash" size={20} color="#fff" />
              <Text style={styles.imageViewDeleteButtonText}>Delete Image</Text>
            </TouchableOpacity>
          )}
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  galleryContainer: {
    padding: 10,
  },
  imageContainer: {
    width: imageWidth,
    height: imageWidth,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
  imageViewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  imageViewDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
  },
  imageViewDeleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default RestaurantGalleryScreen;
