import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Appbar, Card, Title, Paragraph, Badge, Button, Divider, Chip, Dialog, Portal, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrderContext';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';
import * as orderService from '../../services/orderService';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const { refreshOrders, changeOrderStatus } = useOrders();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);
  
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would typically be a separate API call to get order details
      // For now, we'll simulate it by finding the order in the existing orders
      const response = await orderService.getOrderById(orderId);
      
      if (response && response.data && response.data.order) {
        setOrder(response.data.order);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load order details');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrderDetails();
    setRefreshing(false);
  };
  
  const handleAcceptOrder = async () => {
    try {
      await changeOrderStatus(orderId, ORDER_STATUS.PROCESSING);
      await fetchOrderDetails();
      Alert.alert('Success', 'Order has been accepted');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to accept order');
    }
  };
  
  const handleCompleteOrder = async () => {
    try {
      await changeOrderStatus(orderId, ORDER_STATUS.COMPLETED);
      await fetchOrderDetails();
      Alert.alert('Success', 'Order has been completed');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to complete order');
    }
  };
  
  const handleCancelOrder = async () => {
    try {
      await changeOrderStatus(orderId, ORDER_STATUS.CANCELLED, cancelReason);
      setCancelDialogVisible(false);
      setCancelReason('');
      await fetchOrderDetails();
      Alert.alert('Success', 'Order has been cancelled');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to cancel order');
    }
  };
  
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return styles.pendingBadge;
      case ORDER_STATUS.PROCESSING:
        return styles.processingBadge;
      case ORDER_STATUS.COMPLETED:
        return styles.completedBadge;
      case ORDER_STATUS.CANCELLED:
        return styles.cancelledBadge;
      default:
        return styles.pendingBadge;
    }
  };
  
  if (loading && !refreshing) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Order Details" />
        </Appbar.Header>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchOrderDetails} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      </View>
    );
  }
  
  if (!order) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Order Details" />
        </Appbar.Header>
        
        <View style={styles.errorContainer}>
          <Ionicons name="document-outline" size={64} color={COLORS.gray} />
          <Text style={styles.emptyText}>Order not found</Text>
          <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Order #${order.orderId}`} />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.orderHeader}>
              <View>
                <Title style={styles.orderTitle}>Order #{order.orderId}</Title>
                <Paragraph style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleString()}
                </Paragraph>
              </View>
              <Badge style={[styles.badge, getStatusBadgeStyle(order.orderStatus)]}>
                {order.orderStatus}
              </Badge>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Customer Information</Title>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{order.customerName}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{order.customerPhone || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{order.customerEmail || 'N/A'}</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Order Information</Title>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type:</Text>
                <Text style={styles.infoValue}>{order.customerPreferences.preference}</Text>
              </View>
              
              {order.customerPreferences.preference.toLowerCase() === 'dine in' && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Table:</Text>
                  <Text style={styles.infoValue}>{order.customerPreferences.tableNumber}</Text>
                </View>
              )}
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment:</Text>
                <View style={styles.paymentInfo}>
                  <Chip 
                    icon={order.paymentStatus === 'paid' ? 'check-circle' : 'clock-outline'}
                    style={order.paymentStatus === 'paid' ? styles.paidChip : styles.pendingChip}
                  >
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                  </Chip>
                  
                  <Chip icon="credit-card" style={styles.paymentMethodChip}>
                    {order.paymentMethod}
                  </Chip>
                </View>
              </View>
              
              {order.specialInstructions && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Special Instructions:</Text>
                  <Text style={styles.infoValue}>{order.specialInstructions}</Text>
                </View>
              )}
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Order Items</Title>
              
              {order.items.map((item, index) => (
                <Card key={index} style={styles.itemCard}>
                  <Card.Content>
                    <View style={styles.itemHeader}>
                      <View>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                      </View>
                      <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                    
                    {item.variant && (
                      <View style={styles.itemVariant}>
                        <Text style={styles.variantLabel}>Variant:</Text>
                        <Text style={styles.variantValue}>{item.variant}</Text>
                      </View>
                    )}
                    
                    {item.addOns && item.addOns.length > 0 && (
                      <View style={styles.addOnsContainer}>
                        <Text style={styles.addOnsLabel}>Add-ons:</Text>
                        {item.addOns.map((addon, addonIndex) => (
                          <View key={addonIndex} style={styles.addonItem}>
                            <Text style={styles.addonName}>{addon.name}</Text>
                            <Text style={styles.addonPrice}>₹{addon.price.toFixed(2)}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </Card.Content>
                </Card>
              ))}
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Order Summary</Title>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>₹{order.subTotal.toFixed(2)}</Text>
              </View>
              
              {order.taxAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax:</Text>
                  <Text style={styles.summaryValue}>₹{order.taxAmount.toFixed(2)}</Text>
                </View>
              )}
              
              {order.deliveryCharge > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Charge:</Text>
                  <Text style={styles.summaryValue}>₹{order.deliveryCharge.toFixed(2)}</Text>
                </View>
              )}
              
              {order.discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount:</Text>
                  <Text style={styles.discountValue}>-₹{order.discount.toFixed(2)}</Text>
                </View>
              )}
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>₹{order.totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.actionButtons}>
          {order.orderStatus === ORDER_STATUS.PENDING && (
            <>
              <Button 
                mode="contained" 
                onPress={handleAcceptOrder}
                style={styles.acceptButton}
                icon="check"
              >
                Accept Order
              </Button>
              
              <Button 
                mode="outlined" 
                onPress={() => setCancelDialogVisible(true)}
                style={styles.cancelButton}
                icon="close"
              >
                Cancel Order
              </Button>
            </>
          )}
          
          {order.orderStatus === ORDER_STATUS.PROCESSING && (
            <Button 
              mode="contained" 
              onPress={handleCompleteOrder}
              style={styles.completeButton}
              icon="check-all"
            >
              Complete Order
            </Button>
          )}
        </View>
      </ScrollView>
      
      <Portal>
        <Dialog visible={cancelDialogVisible} onDismiss={() => setCancelDialogVisible(false)}>
          <Dialog.Title>Cancel Order</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to cancel this order?</Paragraph>
            <TextInput
              label="Reason for cancellation"
              value={cancelReason}
              onChangeText={setCancelReason}
              style={styles.reasonInput}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelDialogVisible(false)}>No</Button>
            <Button onPress={handleCancelOrder}>Yes, Cancel</Button>
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
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge * 2,
  },
  card: {
    marginBottom: SIZES.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  badge: {
    fontSize: SIZES.small,
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
  },
  processingBadge: {
    backgroundColor: COLORS.info,
  },
  completedBadge: {
    backgroundColor: COLORS.success,
  },
  cancelledBadge: {
    backgroundColor: COLORS.error,
  },
  divider: {
    marginVertical: SIZES.medium,
  },
  section: {
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: SIZES.base / 2,
    flexWrap: 'wrap',
  },
  infoLabel: {
    width: 120,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  infoValue: {
    flex: 1,
    color: COLORS.text,
  },
  paymentInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paidChip: {
    backgroundColor: '#E8F5E9',
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
  },
  pendingChip: {
    backgroundColor: '#FFF8E1',
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
  },
  paymentMethodChip: {
    backgroundColor: '#E3F2FD',
    marginBottom: SIZES.base,
  },
  itemCard: {
    marginVertical: SIZES.base,
    backgroundColor: '#FAFAFA',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  itemPrice: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  itemVariant: {
    flexDirection: 'row',
    marginTop: SIZES.base,
  },
  variantLabel: {
    width: 60,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  variantValue: {
    fontSize: SIZES.small,
  },
  addOnsContainer: {
    marginTop: SIZES.base,
  },
  addOnsLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: SIZES.medium,
    marginBottom: SIZES.base / 2,
  },
  addonName: {
    fontSize: SIZES.small,
  },
  addonPrice: {
    fontSize: SIZES.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.base / 2,
  },
  summaryLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: SIZES.font,
  },
  discountValue: {
    fontSize: SIZES.font,
    color: COLORS.success,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.base,
    paddingTop: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalLabel: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionButtons: {
    marginTop: SIZES.base,
  },
  acceptButton: {
    backgroundColor: COLORS.success,
    marginBottom: SIZES.base,
  },
  completeButton: {
    backgroundColor: COLORS.success,
  },
  cancelButton: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  reasonInput: {
    marginTop: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.extraLarge,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: COLORS.error,
    textAlign: 'center',
    marginVertical: SIZES.medium,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: SIZES.medium,
  },
  retryButton: {
    marginTop: SIZES.medium,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    marginTop: SIZES.medium,
    backgroundColor: COLORS.primary,
  },
});

export default OrderDetailsScreen;
