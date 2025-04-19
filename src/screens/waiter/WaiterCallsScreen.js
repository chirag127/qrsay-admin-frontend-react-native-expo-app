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
import { Card, Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useWaiterCall } from '../../context/WaiterCallContext';
import Header from '../../components/common/Header';

const WaiterCallsScreen = () => {
  const { waiterCalls, loadWaiterCalls, acknowledgeWaiterCall, resolveWaiterCall, isLoading } = useWaiterCall();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCalls, setFilteredCalls] = useState([]);

  useEffect(() => {
    loadWaiterCalls();
  }, []);

  useEffect(() => {
    filterCalls();
  }, [waiterCalls, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWaiterCalls();
    setRefreshing(false);
  };

  const filterCalls = () => {
    if (!searchQuery.trim()) {
      setFilteredCalls(waiterCalls);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = waiterCalls.filter(
      call => 
        call.tableName.toLowerCase().includes(query) ||
        call.customerName.toLowerCase().includes(query) ||
        (call.message && call.message.toLowerCase().includes(query))
    );
    
    setFilteredCalls(filtered);
  };

  const handleAcknowledge = async (callId) => {
    await acknowledgeWaiterCall(callId);
  };

  const handleResolve = async (callId) => {
    await resolveWaiterCall(callId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFC107'; // Warning/yellow
      case 'acknowledged':
        return '#2196F3'; // Info/blue
      case 'resolved':
        return '#4CAF50'; // Success/green
      default:
        return '#757575'; // Grey
    }
  };

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.tableName}>Table {item.tableName}</Text>
        <Badge 
          value={item.status.toUpperCase()} 
          badgeStyle={{ backgroundColor: getStatusColor(item.status) }}
          containerStyle={styles.badge}
        />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Icon name="user" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.customerName}</Text>
        </View>
        
        {item.message ? (
          <View style={styles.infoRow}>
            <Icon name="comment" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.message}</Text>
          </View>
        ) : null}
        
        <View style={styles.infoRow}>
          <Icon name="clock-o" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.createdAt}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.acknowledgeButton]}
            onPress={() => handleAcknowledge(item.callId)}
          >
            <Icon name="check" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Acknowledge</Text>
          </TouchableOpacity>
        )}
        
        {item.status !== 'resolved' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.resolveButton]}
            onPress={() => handleResolve(item.callId)}
          >
            <Icon name="check-circle" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Resolve</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Waiter Calls" />
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by table, customer or message"
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
        <ActivityIndicator size="large" color="#ff6b00" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredCalls}
          renderItem={renderItem}
          keyExtractor={(item) => item.callId}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="bell-slash" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No waiter calls found</Text>
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
  tableName: {
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
  acknowledgeButton: {
    backgroundColor: '#2196F3',
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
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
  },
});

export default WaiterCallsScreen;
