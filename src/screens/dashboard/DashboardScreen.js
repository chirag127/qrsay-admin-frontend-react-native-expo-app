import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Badge, Button, Divider, Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useWaiterCalls } from '../../context/WaiterCallContext';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

const DashboardScreen = ({ navigation }) => {
  const { user, restaurant } = useAuth();
  const { 
    pendingOrders, 
    processingOrders, 
    completedOrders, 
    cancelledOrders, 
    activeDineIn,
    loading: ordersLoading, 
    refreshOrders 
  } = useOrders();
  
  const { 
    waiterCalls, 
    loading: waiterCallsLoading, 
    fetchWaiterCalls 
  } = useWaiterCalls();
  
  const [activeTab, setActiveTab] = useState('tab1');
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    // Initial data load
    refreshData();
  }, []);
  
  const refreshData = async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
      await fetchWaiterCalls();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const selectTab = (tab) => {
    setActiveTab(tab);
  };
  
  const renderOrderCard = (order) => {
    return (
      <Card key={order._id} style={styles.orderCard}>
        <Card.Content>
          <View style={styles.orderHeader}>
            <View>
              <Title style={styles.orderTitle}>Order #{order.orderId}</Title>
              <Paragraph style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleString()}
              </Paragraph>
            </View>
            <Badge style={styles.orderBadge}>
              {order.customerPreferences.preference}
            </Badge>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.customerInfo}>
            <Text style={styles.infoLabel}>Customer:</Text>
            <Text style={styles.infoValue}>{order.customerName}</Text>
          </View>
          
          {order.customerPreferences.preference.toLowerCase() === 'dine in' && (
            <View style={styles.customerInfo}>
              <Text style={styles.infoLabel}>Table:</Text>
              <Text style={styles.infoValue}>{order.customerPreferences.tableNumber}</Text>
            </View>
          )}
          
          <View style={styles.customerInfo}>
            <Text style={styles.infoLabel}>Total:</Text>
            <Text style={styles.infoValue}>₹{order.totalAmount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.customerInfo}>
            <Text style={styles.infoLabel}>Items:</Text>
            <Text style={styles.infoValue}>{order.items.length}</Text>
          </View>
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('OrderDetails', { orderId: order._id })}
            style={styles.viewButton}
          >
            View Details
          </Button>
        </Card.Actions>
      </Card>
    );
  };
  
  const renderWaiterCallCard = (call) => {
    return (
      <Card key={call.callId} style={styles.orderCard}>
        <Card.Content>
          <View style={styles.orderHeader}>
            <View>
              <Title style={styles.orderTitle}>{call.customerName}</Title>
              <Paragraph style={styles.orderDate}>
                {call.createdAt}
              </Paragraph>
            </View>
            <Badge 
              style={[
                styles.orderBadge,
                call.status === 'pending' ? styles.pendingBadge : 
                call.status === 'acknowledged' ? styles.acknowledgedBadge : 
                styles.resolvedBadge
              ]}
            >
              {call.status}
            </Badge>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.customerInfo}>
            <Text style={styles.infoLabel}>Table:</Text>
            <Text style={styles.infoValue}>{call.tableName}</Text>
          </View>
          
          {call.message && (
            <View style={styles.customerInfo}>
              <Text style={styles.infoLabel}>Message:</Text>
              <Text style={styles.infoValue}>{call.message}</Text>
            </View>
          )}
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          {call.status === 'pending' && (
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('WaiterCalls')}
              style={styles.acknowledgeButton}
            >
              Acknowledge
            </Button>
          )}
          {call.status !== 'resolved' && (
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('WaiterCalls')}
              style={styles.resolveButton}
            >
              Resolve
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };
  
  if (ordersLoading && !refreshing) {
    return <LoadingScreen />;
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="refresh" onPress={refreshData} />
      </Appbar.Header>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
      >
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>Welcome, {user?.name || 'User'}!</Title>
            <Paragraph style={styles.welcomeText}>
              {restaurant?.restaurantName || 'Your Restaurant'} is currently{' '}
              <Text style={restaurant?.restaurantStatus === 'online' ? styles.onlineText : styles.offlineText}>
                {restaurant?.restaurantStatus || 'offline'}
              </Text>
            </Paragraph>
          </Card.Content>
        </Card>
        
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="receipt-outline" size={24} color={COLORS.primary} />
              <Title style={styles.statNumber}>{pendingOrders.length}</Title>
              <Paragraph style={styles.statLabel}>Pending Orders</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="time-outline" size={24} color={COLORS.info} />
              <Title style={styles.statNumber}>{processingOrders.length}</Title>
              <Paragraph style={styles.statLabel}>Processing</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="restaurant-outline" size={24} color={COLORS.success} />
              <Title style={styles.statNumber}>{activeDineIn.length}</Title>
              <Paragraph style={styles.statLabel}>Active Dine-in</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="call-outline" size={24} color={COLORS.warning} />
              <Title style={styles.statNumber}>{waiterCalls.filter(call => call.status !== 'resolved').length}</Title>
              <Paragraph style={styles.statLabel}>Waiter Calls</Paragraph>
            </Card.Content>
          </Card>
        </View>
        
        <Card style={styles.ordersCard}>
          <Card.Title title="My Orders" />
          <Card.Content>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'tab1' && styles.activeTab]}
                onPress={() => selectTab('tab1')}
              >
                <Text style={[styles.tabText, activeTab === 'tab1' && styles.activeTabText]}>
                  Order Received ({pendingOrders.length})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'tab3' && styles.activeTab]}
                onPress={() => selectTab('tab3')}
              >
                <Text style={[styles.tabText, activeTab === 'tab3' && styles.activeTabText]}>
                  Order In Process ({processingOrders.length})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'tab4' && styles.activeTab]}
                onPress={() => selectTab('tab4')}
              >
                <Text style={[styles.tabText, activeTab === 'tab4' && styles.activeTabText]}>
                  Table Status ({activeDineIn.length})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'tab5' && styles.activeTab]}
                onPress={() => selectTab('tab5')}
              >
                <Text style={[styles.tabText, activeTab === 'tab5' && styles.activeTabText]}>
                  Call Waiter ({waiterCalls.filter(call => call.status !== 'resolved').length})
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tabContent}>
              {activeTab === 'tab1' && (
                <View>
                  {pendingOrders.length === 0 ? (
                    <Text style={styles.emptyText}>There are currently no order received.</Text>
                  ) : (
                    pendingOrders.map(order => renderOrderCard(order))
                  )}
                </View>
              )}
              
              {activeTab === 'tab3' && (
                <View>
                  {processingOrders.length === 0 ? (
                    <Text style={styles.emptyText}>There are currently no orders in process.</Text>
                  ) : (
                    processingOrders.map(order => renderOrderCard(order))
                  )}
                </View>
              )}
              
              {activeTab === 'tab4' && (
                <View>
                  {activeDineIn.length === 0 ? (
                    <Text style={styles.emptyText}>There are currently no active dine-in tables.</Text>
                  ) : (
                    activeDineIn.map(order => renderOrderCard(order))
                  )}
                </View>
              )}
              
              {activeTab === 'tab5' && (
                <View>
                  {waiterCalls.filter(call => call.status !== 'resolved').length === 0 ? (
                    <Text style={styles.emptyText}>There are currently no active waiter calls.</Text>
                  ) : (
                    waiterCalls
                      .filter(call => call.status !== 'resolved')
                      .map(call => renderWaiterCallCard(call))
                  )}
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  scrollContent: {
    padding: SIZES.medium,
  },
  welcomeCard: {
    marginBottom: SIZES.medium,
  },
  welcomeTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: SIZES.font,
  },
  onlineText: {
    color: COLORS.success,
    fontWeight: 'bold',
  },
  offlineText: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  statCard: {
    width: '48%',
    marginBottom: SIZES.base,
  },
  statContent: {
    alignItems: 'center',
    padding: SIZES.small,
  },
  statNumber: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    marginVertical: SIZES.base / 2,
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  ordersCard: {
    marginBottom: SIZES.medium,
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.medium,
  },
  tab: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.small,
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.lightGray,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  tabContent: {
    marginTop: SIZES.small,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray,
    marginVertical: SIZES.large,
  },
  orderCard: {
    marginBottom: SIZES.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  orderBadge: {
    backgroundColor: COLORS.primary,
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
  customerInfo: {
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
  viewButton: {
    backgroundColor: COLORS.primary,
  },
  acknowledgeButton: {
    backgroundColor: COLORS.info,
    marginRight: SIZES.base,
  },
  resolveButton: {
    backgroundColor: COLORS.success,
  },
});

export default DashboardScreen;
