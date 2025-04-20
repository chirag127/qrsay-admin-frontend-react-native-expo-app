import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Appbar, Card, Title, Paragraph, Badge, Button, Divider, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useWaiterCalls } from '../../context/WaiterCallContext';
import { COLORS, SIZES, WAITER_CALL_STATUS } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

const WaiterCallsScreen = ({ navigation }) => {
  const { waiterCalls, loading, error, fetchWaiterCalls, acknowledgeCall, resolveCall } = useWaiterCalls();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCalls, setFilteredCalls] = useState([]);
  
  useEffect(() => {
    fetchWaiterCalls();
  }, []);
  
  useEffect(() => {
    applyFilter();
  }, [waiterCalls, searchQuery]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWaiterCalls();
    setRefreshing(false);
  };
  
  const applyFilter = () => {
    const query = searchQuery.toLowerCase();
    
    if (!query) {
      setFilteredCalls(waiterCalls);
      return;
    }
    
    const filtered = waiterCalls.filter(
      call => 
        call.customerName.toLowerCase().includes(query) ||
        call.tableName.toLowerCase().includes(query) ||
        call.message.toLowerCase().includes(query) ||
        call.status.toLowerCase().includes(query)
    );
    
    setFilteredCalls(filtered);
  };
  
  const handleAcknowledgeCall = async (callId) => {
    try {
      await acknowledgeCall(callId);
    } catch (error) {
      console.error('Error acknowledging call:', error);
    }
  };
  
  const handleResolveCall = async (callId) => {
    try {
      await resolveCall(callId);
    } catch (error) {
      console.error('Error resolving call:', error);
    }
  };
  
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case WAITER_CALL_STATUS.PENDING:
        return styles.pendingBadge;
      case WAITER_CALL_STATUS.ACKNOWLEDGED:
        return styles.acknowledgedBadge;
      case WAITER_CALL_STATUS.RESOLVED:
        return styles.resolvedBadge;
      default:
        return styles.pendingBadge;
    }
  };
  
  const renderWaiterCallItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View>
            <Title style={styles.cardTitle}>{item.customerName}</Title>
            <Paragraph style={styles.cardDate}>{item.createdAt}</Paragraph>
          </View>
          <Badge style={[styles.badge, getStatusBadgeStyle(item.status)]}>
            {item.status}
          </Badge>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Table:</Text>
          <Text style={styles.infoValue}>{item.tableName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Message:</Text>
          <Text style={styles.infoValue}>{item.message || 'No message'}</Text>
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
        {item.status === WAITER_CALL_STATUS.PENDING && (
          <Button 
            mode="contained" 
            onPress={() => handleAcknowledgeCall(item.callId)}
            style={styles.acknowledgeButton}
            icon="check"
          >
            Acknowledge
          </Button>
        )}
        
        {item.status !== WAITER_CALL_STATUS.RESOLVED && (
          <Button 
            mode="contained" 
            onPress={() => handleResolveCall(item.callId)}
            style={styles.resolveButton}
            icon="check-all"
          >
            Resolve
          </Button>
        )}
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
        <Appbar.Content title="Waiter Calls" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search waiter calls..."
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
        data={filteredCalls}
        keyExtractor={(item) => item.callId}
        renderItem={renderWaiterCallItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="call-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No waiter calls found</Text>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  cardDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  badge: {
    fontSize: SIZES.small,
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
  },
  acknowledgedBadge: {
    backgroundColor: COLORS.info,
  },
  resolvedBadge: {
    backgroundColor: COLORS.success,
  },
  divider: {
    marginVertical: SIZES.base,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: SIZES.base / 2,
  },
  infoLabel: {
    width: 80,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  infoValue: {
    flex: 1,
    color: COLORS.text,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  acknowledgeButton: {
    backgroundColor: COLORS.info,
    marginRight: SIZES.base,
  },
  resolveButton: {
    backgroundColor: COLORS.success,
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

export default WaiterCallsScreen;
