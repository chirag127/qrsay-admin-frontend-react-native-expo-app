import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, TextInput, Button, Divider, Checkbox, Switch, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as dishService from '../../services/dishService';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

const DishSchema = Yup.object().shape({
  name: Yup.string().required('Dish name is required'),
  description: Yup.string(),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  categoryId: Yup.string().required('Category is required'),
  available: Yup.boolean(),
  veg: Yup.boolean(),
});

const AddDishScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dishService.getCategories();
      
      if (response && response.data && response.data.categories) {
        setCategories(response.data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePickImage = async () => {
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
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare dish data
      const dishData = {
        ...values,
        image: image,
      };
      
      // Add dish
      await dishService.addDish(dishData);
      
      Alert.alert(
        'Success',
        'Dish added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      setError(err.message || 'Failed to add dish');
      console.error('Error adding dish:', err);
      Alert.alert('Error', 'Failed to add dish');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Dish" />
      </Appbar.Header>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Formik
            initialValues={{
              name: '',
              description: '',
              price: '',
              categoryId: '',
              available: true,
              veg: false,
            }}
            validationSchema={DishSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.formContainer}>
                <TouchableOpacity style={styles.imageContainer} onPress={handlePickImage}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="camera-outline" size={40} color={COLORS.primary} />
                      <Text style={styles.imagePlaceholderText}>Add Dish Image</Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                <TextInput
                  label="Dish Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name}
                  style={styles.input}
                  mode="outlined"
                />
                {touched.name && errors.name && (
                  <HelperText type="error">{errors.name}</HelperText>
                )}
                
                <TextInput
                  label="Description"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  error={touched.description && errors.description}
                  style={styles.input}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                />
                {touched.description && errors.description && (
                  <HelperText type="error">{errors.description}</HelperText>
                )}
                
                <TextInput
                  label="Price"
                  value={values.price}
                  onChangeText={handleChange('price')}
                  onBlur={handleBlur('price')}
                  error={touched.price && errors.price}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                  left={<TextInput.Affix text="₹" />}
                />
                {touched.price && errors.price && (
                  <HelperText type="error">{errors.price}</HelperText>
                )}
                
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoriesContainer}>
                  {categories.length === 0 ? (
                    <Text style={styles.noCategoriesText}>No categories available</Text>
                  ) : (
                    categories.map((category) => (
                      <TouchableOpacity
                        key={category._id}
                        style={[
                          styles.categoryItem,
                          values.categoryId === category._id && styles.selectedCategoryItem,
                        ]}
                        onPress={() => setFieldValue('categoryId', category._id)}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            values.categoryId === category._id && styles.selectedCategoryText,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
                {touched.categoryId && errors.categoryId && (
                  <HelperText type="error">{errors.categoryId}</HelperText>
                )}
                
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Available</Text>
                  <Switch
                    value={values.available}
                    onValueChange={(value) => setFieldValue('available', value)}
                    color={COLORS.primary}
                  />
                </View>
                
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Vegetarian</Text>
                  <Switch
                    value={values.veg}
                    onValueChange={(value) => setFieldValue('veg', value)}
                    color={COLORS.success}
                  />
                </View>
                
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  loading={submitting}
                  disabled={submitting}
                >
                  Add Dish
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge,
  },
  formContainer: {
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: SIZES.base,
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: SIZES.base,
    color: COLORS.primary,
  },
  input: {
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white,
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
    color: COLORS.text,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.medium,
  },
  categoryItem: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.lightGray,
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.text,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  noCategoriesText: {
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  switchLabel: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  submitButton: {
    marginTop: SIZES.medium,
    backgroundColor: COLORS.primary,
  },
  errorContainer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.error,
    marginBottom: SIZES.medium,
    borderRadius: SIZES.base,
  },
  errorText: {
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default AddDishScreen;
