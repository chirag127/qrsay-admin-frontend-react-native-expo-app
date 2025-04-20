import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Divider, Searchbar, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

// This would typically come from an API service
const getCustomers = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          customers: [
            { 
              _id: '1', 
              name: 'John Doe', 
              email: 'john@example.com', 
              phone: '1234567890',
              totalOrders: 15,
              totalSpent: 3500,
              lastOrderDate: '2023-06-15T12:30:00.000Z'
            },
            { 
              _id: '2', 
              name: 'Jane Smith', 
              email: 'jane@example.com', 
              phone: '9876543210',
              totalOrders: 8,
              totalSpent: 1800,
              lastOrderDate: '2023-06-10T15:45:00.000Z'
            },
            { 
              _id: '3', 
              name: 'Bob Johnson', 
              email: 'bob@example.com', 
              phone: '5555555555',
              totalOrders: 3,
              totalSpent: 750,
              lastOrderDate: '2023-05-28T09:15:00.000Z'
            },
          ]
        }
      });
    }, 1000);
  });
};

const CustomersScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery]);
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCustomers();
      
      if (response && response.data && response.data.customers) {
        setCustomers(response.data.customers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };
  
  const filterCustomers = () => {
    if (!searchQuery) {
      setFilteredCustomers(customers);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    );
    
    setFilteredCustomers(filtered);
  };
  
  const handleViewCustomerDetails = (customerId) => {
    navigation.navigate('CustomerDetails', { customerId });
  };
  
  const renderCustomerItem = ({ item }) => (
    <Card style={styles.card} onPress={() => handleViewCustomerDetails(item._id)}>
      <Card.Content>
        <View style={styles.customerHeader}>
          <Title style={styles.customerName}>{item.name}</Title>
        </View>
        
        <Paragraph style={styles.customerEmail}>{item.email}</Paragraph>
        <Paragraph style={styles.customerPhone}>{item.phone}</Paragraph>
        
        <Divider style={styles.divider} />
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{item.totalSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{new Date(item.lastOrderDate).toLocaleDateString()}</Text>
            <Text style={styles.statLabel}>Last Order</Text>
          </View>
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="contained" 
          onPress={() => handleViewCustomerDetails(item._id)}
          style={styles.viewButton}
          icon="eye"
        >
          View Details
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
        <Appbar.Content title="Customers" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search customers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item._id}
        renderItem={renderCustomerItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No customers found</Text>
          </View>
        }
      />
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
  searchContainer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge,
  },
  card: {
    marginBottom: SIZES.medium,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  customerEmail: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  customerPhone: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  divider: {
    marginVertical: SIZES.base,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.base,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: COLORS.primary,
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

export default CustomersScreen;
