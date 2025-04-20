import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  TextInput
} from 'react-native';
import { Card, Badge, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useOrder } from '../../context/OrderContext';
import Header from '../../components/common/Header';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const { pendingOrders, processingOrders, completedOrders, loadOrders, isLoading } = useOrder();
  const [activeTab, setActiveTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [pendingOrders, processingOrders, completedOrders, activeTab, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const filterOrders = () => {
    let orders = [];
    
    switch (activeTab) {
      case 'pending':
        orders = pendingOrders;
        break;
      case 'processing':
        orders = processingOrders;
        break;
      case 'completed':
        orders = completedOrders;
        break;
      default:
        orders = pendingOrders;
    }

    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = orders.filter(
      order => 
        order.orderId?.toString().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.customerPreferences?.preference?.toLowerCase().includes(query)
    );
    
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFC107'; // Warning/yellow
      case 'processing':
        return '#2196F3'; // Info/blue
      case 'completed':
        return '#4CAF50'; // Success/green
      case 'rejected':
        return '#F44336'; // Error/red
      default:
        return '#757575'; // Grey
    }
  };

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderNumber}>Order #{item.orderId}</Text>
        <Badge 
          value={item.orderStatus.toUpperCase()} 
          badgeStyle={{ backgroundColor: getStatusColor(item.orderStatus) }}
          containerStyle={styles.badge}
        />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Icon name="user" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.customerName || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="cutlery" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.customerPreferences?.preference || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="shopping-cart" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.orderItems?.length || 0} items</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="money" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>${item.totalAmount?.toFixed(2) || '0.00'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="clock-o" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
      >
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Orders" />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'pending' && styles.activeTabButton]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'pending' && styles.activeTabButtonText]}>
            Pending ({pendingOrders.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'processing' && styles.activeTabButton]}
          onPress={() => setActiveTab('processing')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'processing' && styles.activeTabButtonText]}>
            Processing ({processingOrders.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'completed' && styles.activeTabButton]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'completed' && styles.activeTabButtonText]}>
            Completed ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order #, customer or type"
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
      
      {isLoading && !refreshing ? (
        <ActivityIndicator size={50} color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No orders found</Text>
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff6b00',
  },
  tabButtonText: {
    color: '#666',
    fontSize: 14,
  },
  activeTabButtonText: {
    color: '#ff6b00',
    fontWeight: 'bold',
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
    marginBottom: 15,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    marginLeft: 10,
  },
  cardContent: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#ff6b00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
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
  },
});

export default OrdersScreen;
