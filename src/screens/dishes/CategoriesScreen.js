import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Appbar, Card, Title, Button, Divider, TextInput, FAB, Dialog, Portal, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as dishService from '../../services/dishService';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  
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
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };
  
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }
    
    try {
      const response = await dishService.addCategory({ name: categoryName });
      
      if (response && response.data && response.data.category) {
        setCategories([...categories, response.data.category]);
        setCategoryName('');
        setAddDialogVisible(false);
        Alert.alert('Success', 'Category added successfully');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', 'Failed to add category');
    }
  };
  
  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }
    
    try {
      const response = await dishService.editCategory({
        _id: selectedCategory._id,
        name: categoryName,
      });
      
      if (response && response.data && response.data.category) {
        setCategories(
          categories.map(cat => 
            cat._id === selectedCategory._id ? response.data.category : cat
          )
        );
        setCategoryName('');
        setEditDialogVisible(false);
        setSelectedCategory(null);
        Alert.alert('Success', 'Category updated successfully');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      Alert.alert('Error', 'Failed to update category');
    }
  };
  
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      await dishService.deleteCategory(selectedCategory._id);
      
      setCategories(categories.filter(cat => cat._id !== selectedCategory._id));
      setDeleteDialogVisible(false);
      setSelectedCategory(null);
      Alert.alert('Success', 'Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Error', 'Failed to delete category');
    }
  };
  
  const renderCategoryItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.categoryTitle}>{item.name}</Title>
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="outlined" 
          onPress={() => {
            setSelectedCategory(item);
            setCategoryName(item.name);
            setEditDialogVisible(true);
          }}
          style={styles.editButton}
          icon="pencil"
        >
          Edit
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => {
            setSelectedCategory(item);
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
        <Appbar.Content title="Categories" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="grid-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No categories found</Text>
            <Button 
              mode="contained" 
              onPress={() => {
                setCategoryName('');
                setAddDialogVisible(true);
              }}
              style={styles.addButton}
              icon="plus"
            >
              Add New Category
            </Button>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        color={COLORS.white}
        onPress={() => {
          setCategoryName('');
          setAddDialogVisible(true);
        }}
      />
      
      <Portal>
        {/* Add Category Dialog */}
        <Dialog visible={addDialogVisible} onDismiss={() => setAddDialogVisible(false)}>
          <Dialog.Title>Add Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddCategory}>Add</Button>
          </Dialog.Actions>
        </Dialog>
        
        {/* Edit Category Dialog */}
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleEditCategory}>Update</Button>
          </Dialog.Actions>
        </Dialog>
        
        {/* Delete Category Dialog */}
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Category</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete "{selectedCategory?.name}"?</Paragraph>
            <Paragraph>This action cannot be undone.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteCategory} color={COLORS.error}>Delete</Button>
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
  card: {
    marginBottom: SIZES.medium,
  },
  categoryTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  editButton: {
    marginRight: SIZES.base,
    borderColor: COLORS.primary,
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
  addButton: {
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
  dialogInput: {
    marginTop: SIZES.base,
    backgroundColor: COLORS.white,
  },
});

export default CategoriesScreen;
