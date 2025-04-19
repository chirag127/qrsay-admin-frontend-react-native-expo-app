import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  ActivityIndicator,
  Alert,
  Image,
  Platform
} from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import dishService from '../../services/dish.service';
import Header from '../../components/common/Header';

const EditDishScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { dishId } = route.params;
  
  const [formData, setFormData] = useState({
    dishName: '',
    description: '',
    price: '',
    categoryId: '',
    available: true,
    dishImage: null,
    dishImageFile: null,
  });
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    loadData();
    requestMediaLibraryPermission();
  }, [dishId]);
  
  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images!');
      }
    }
  };
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load dish details
      const dishResponse = await dishService.getDishById(dishId);
      if (dishResponse && dishResponse.data && dishResponse.data.dish) {
        const dish = dishResponse.data.dish;
        setFormData({
          dishName: dish.dishName || '',
          description: dish.description || '',
          price: dish.price ? dish.price.toString() : '',
          categoryId: dish.categoryId || '',
          available: dish.available !== undefined ? dish.available : true,
          dishImage: dish.dishImage || null,
        });
        
        if (dish.dishImage) {
          setImagePreview(dish.dishImage);
        }
      }
      
      // Load categories
      const categoriesResponse = await dishService.getCategories();
      if (categoriesResponse && categoriesResponse.data && categoriesResponse.data.categories) {
        setCategories(categoriesResponse.data.categories);
      }
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Error', 'Failed to load dish details');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
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
        setImagePreview(selectedAsset.uri);
        
        // Create form data for image upload
        const filename = selectedAsset.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        setFormData(prev => ({
          ...prev,
          dishImageFile: {
            uri: selectedAsset.uri,
            name: filename,
            type,
          }
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const validateForm = () => {
    if (!formData.dishName.trim()) {
      Alert.alert('Validation Error', 'Dish name is required');
      return false;
    }
    
    if (!formData.price.trim()) {
      Alert.alert('Validation Error', 'Price is required');
      return false;
    }
    
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Validation Error', 'Price must be a positive number');
      return false;
    }
    
    if (!formData.categoryId) {
      Alert.alert('Validation Error', 'Please select a category');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare data for API
      const dishData = {
        dishName: formData.dishName,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        available: formData.available,
      };
      
      // If there's a new image, upload it first
      if (formData.dishImageFile) {
        const formDataObj = new FormData();
        formDataObj.append('dishImage', formData.dishImageFile);
        
        const imageResponse = await dishService.uploadDishImage(formDataObj);
        
        if (imageResponse && imageResponse.data && imageResponse.data.imageUrl) {
          dishData.dishImage = imageResponse.data.imageUrl;
        }
      } else if (formData.dishImage) {
        dishData.dishImage = formData.dishImage;
      }
      
      // Update dish
      await dishService.updateDish(dishId, dishData);
      
      Alert.alert(
        'Success',
        'Dish updated successfully',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Dishes')
          }
        ]
      );
    } catch (error) {
      console.error('Update dish error:', error);
      Alert.alert('Error', 'Failed to update dish');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Edit Dish" showBackButton />
        <ActivityIndicator size="large" color="#ff6b00" style={styles.loader} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header title="Edit Dish" showBackButton />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>Edit Dish</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Dish Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.dishName}
              onChangeText={(text) => handleInputChange('dishName', text)}
              placeholder="Enter dish name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Enter dish description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Price *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => handleInputChange('price', text)}
              placeholder="Enter price"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            {categories.length > 0 ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.categoryId}
                  onValueChange={(itemValue) => handleInputChange('categoryId', itemValue)}
                  style={styles.picker}
                >
                  {categories.map((category) => (
                    <Picker.Item 
                      key={category._id} 
                      label={category.categoryName} 
                      value={category._id} 
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <View style={styles.noCategoriesContainer}>
                <Text style={styles.noCategoriesText}>No categories available</Text>
                <TouchableOpacity
                  style={styles.addCategoryButton}
                  onPress={() => navigation.navigate('Categories')}
                >
                  <Text style={styles.addCategoryButtonText}>Add Category</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Available</Text>
            <Switch
              value={formData.available}
              onValueChange={(value) => handleInputChange('available', value)}
              trackColor={{ false: '#767577', true: '#ff6b00' }}
              thumbColor={formData.available ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Dish Image</Text>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              <Icon name="camera" size={20} color="#666" />
              <Text style={styles.imagePickerButtonText}>
                {imagePreview ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>
            
            {imagePreview && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: imagePreview }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setImagePreview(null);
                    setFormData(prev => ({
                      ...prev,
                      dishImage: null,
                      dishImageFile: null
                    }));
                  }}
                >
                  <Icon name="times" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon name="save" size={16} color="#fff" />
                <Text style={styles.submitButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </Card>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
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
  textArea: {
    height: 100,
    paddingTop: 10,
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
  noCategoriesContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  noCategoriesText: {
    color: '#666',
    marginBottom: 10,
  },
  addCategoryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addCategoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePickerButtonText: {
    marginLeft: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: 10,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditDishScreen;
