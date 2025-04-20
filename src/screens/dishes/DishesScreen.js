import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { Card, Badge, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import dishService from '../../services/dish.service';
import Header from '../../components/common/Header';

const DishesScreen = () => {
  const navigation = useNavigation();
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredDishes, setFilteredDishes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDishes();
  }, [dishes, searchQuery, selectedCategory]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load dishes
      const dishesResponse = await dishService.getDishes();
      if (dishesResponse && dishesResponse.data && dishesResponse.data.dishes) {
        setDishes(dishesResponse.data.dishes);
      }
      
      // Load categories
      const categoriesResponse = await dishService.getCategories();
      if (categoriesResponse && categoriesResponse.data && categoriesResponse.data.categories) {
        setCategories(categoriesResponse.data.categories);
      }
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Error', 'Failed to load dishes and categories');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterDishes = () => {
    let filtered = [...dishes];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dish => dish.categoryId === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        dish => 
          dish.dishName.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredDishes(filtered);
  };

  const handleDeleteDish = async (dishId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dishService.deleteDish(dishId);
              setDishes(dishes.filter(dish => dish._id !== dishId));
              Alert.alert('Success', 'Dish deleted successfully');
            } catch (error) {
              console.error('Delete dish error:', error);
              Alert.alert('Error', 'Failed to delete dish');
            }
          }
        }
      ]
    );
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.categoryName : 'Uncategorized';
  };

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Badge 
          value={item.available ? 'AVAILABLE' : 'UNAVAILABLE'} 
          status={item.available ? 'success' : 'error'} 
          containerStyle={styles.badge}
        />
      </View>
      
      <View style={styles.cardContent}>
        {item.dishImage ? (
          <Image 
            source={{ uri: item.dishImage }} 
            style={styles.dishImage} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Icon name="image" size={40} color="#ccc" />
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        
        <View style={styles.dishInfo}>
          <Text style={styles.categoryName}>{getCategoryName(item.categoryId)}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditDish', { dishId: item._id })}
        >
          <Icon name="edit" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteDish(item._id)}
        >
          <Icon name="trash" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Dishes" />
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search dishes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Icon name="times-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'all' && styles.selectedCategoryButton]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[styles.categoryButtonText, selectedCategory === 'all' && styles.selectedCategoryButtonText]}>
              All
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity 
              key={category._id}
              style={[styles.categoryButton, selectedCategory === category._id && styles.selectedCategoryButton]}
              onPress={() => setSelectedCategory(category._id)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === category._id && styles.selectedCategoryButtonText]}>
                {category.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddDish')}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Dish</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoriesButton}
          onPress={() => navigation.navigate('Categories')}
        >
          <Icon name="list" size={16} color="#fff" />
          <Text style={styles.categoriesButtonText}>Categories</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.extrasButton}
          onPress={() => navigation.navigate('Extras')}
        >
          <Icon name="plus-circle" size={16} color="#fff" />
          <Text style={styles.extrasButtonText}>Extras</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.choicesButton}
          onPress={() => navigation.navigate('Choices')}
        >
          <Icon name="check-square-o" size={16} color="#fff" />
          <Text style={styles.choicesButtonText}>Choices</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <ActivityIndicator size={50} color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredDishes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="cutlery" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No dishes found</Text>
              <TouchableOpacity 
                style={styles.addFirstButton}
                onPress={() => navigation.navigate('AddDish')}
              >
                <Text style={styles.addFirstButtonText}>Add Your First Dish</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryButton: {
    backgroundColor: '#ff6b00',
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  categoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  categoriesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  extrasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  extrasButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  choicesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  choicesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    marginLeft: 10,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  noImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  dishInfo: {
    flex: 1,
    marginLeft: 10,
  },
  categoryName: {
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontWeight: 'bold',
    color: '#ff6b00',
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    color: '#666',
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
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
});

export default DishesScreen;
