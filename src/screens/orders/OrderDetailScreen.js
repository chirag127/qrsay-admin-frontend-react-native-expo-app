import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { Card, Badge, Divider, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOrder } from '../../context/OrderContext';
import orderService from '../../services/order.service';
import Header from '../../components/common/Header';

const OrderDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;
  const { loadOrders } = useOrder();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [processingTime, setProcessingTime] = useState(15);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrderById(orderId);
      
      if (response && response.data && response.data.order) {
        setOrder(response.data.order);
      } else {
        Alert.alert('Error', 'Failed to load order details');
      }
    } catch (error) {
      console.error('Fetch order details error:', error);
      Alert.alert('Error', 'An error occurred while loading order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    try {
      setIsSubmitting(true);
      
      const data = {
        processingTime,
        customerId: order.customerId,
      };
      
      await orderService.acceptOrder(orderId, data);
      
      setIsAcceptModalVisible(false);
      await loadOrders();
      await fetchOrderDetails();
      
      Alert.alert('Success', 'Order accepted successfully');
    } catch (error) {
      console.error('Accept order error:', error);
      Alert.alert('Error', 'An error occurred while accepting the order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectOrder = async () => {
    try {
      setIsSubmitting(true);
      
      const data = {
        rejectionReason: rejectReason,
        customerId: order.customerId,
      };
      
      await orderService.rejectOrder(orderId, data);
      
      setIsRejectModalVisible(false);
      await loadOrders();
      await fetchOrderDetails();
      
      Alert.alert('Success', 'Order rejected successfully');
    } catch (error) {
      console.error('Reject order error:', error);
      Alert.alert('Error', 'An error occurred while rejecting the order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      setIsSubmitting(true);
      
      await orderService.completeOrder(orderId);
      
      await loadOrders();
      await fetchOrderDetails();
      
      Alert.alert('Success', 'Order completed successfully');
    } catch (error) {
      console.error('Complete order error:', error);
      Alert.alert('Error', 'An error occurred while completing the order');
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Order Details" showBackButton />
        <ActivityIndicator size="large" color="#ff6b00" style={styles.loader} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title="Order Details" showBackButton />
        <View style={styles.emptyContainer}>
          <Icon name="exclamation-circle" size={50} color="#ccc" />
          <Text style={styles.emptyText}>Order not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Order Details" showBackButton />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card containerStyle={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.orderNumber}>Order #{order.orderId}</Text>
            <Badge 
              value={order.orderStatus.toUpperCase()} 
              badgeStyle={{ backgroundColor: getStatusColor(order.orderStatus) }}
              containerStyle={styles.badge}
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{order.customerName || 'N/A'}</Text>
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
            <Text style={styles.sectionTitle}>Order Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{order.customerPreferences?.preference || 'N/A'}</Text>
            </View>
            {order.customerPreferences?.preference === 'Dine In' && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Table:</Text>
                <Text style={styles.infoValue}>{order.customerPreferences?.tableName || 'N/A'}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{new Date(order.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>{new Date(order.createdAt).toLocaleTimeString()}</Text>
            </View>
            {order.processingTime && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Processing Time:</Text>
                <Text style={styles.infoValue}>{order.processingTime} minutes</Text>
              </View>
            )}
            {order.rejectionReason && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rejection Reason:</Text>
                <Text style={styles.infoValue}>{order.rejectionReason}</Text>
              </View>
            )}
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <View style={styles.orderItemHeader}>
                    <Text style={styles.orderItemName}>{item.dishName}</Text>
                    <Text style={styles.orderItemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.orderItemDetails}>
                    <Text style={styles.orderItemQuantity}>Quantity: {item.quantity}</Text>
                    {item.extras && item.extras.length > 0 && (
                      <View style={styles.orderItemExtras}>
                        <Text style={styles.orderItemExtrasLabel}>Extras:</Text>
                        {item.extras.map((extra, extraIndex) => (
                          <Text key={extraIndex} style={styles.orderItemExtra}>
                            - {extra.name} (${extra.price.toFixed(2)})
                          </Text>
                        ))}
                      </View>
                    )}
                    {item.specialInstructions && (
                      <View style={styles.orderItemInstructions}>
                        <Text style={styles.orderItemInstructionsLabel}>Special Instructions:</Text>
                        <Text style={styles.orderItemInstructionsText}>{item.specialInstructions}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>No items in this order</Text>
            )}
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Subtotal:</Text>
              <Text style={styles.infoValue}>${order.subTotal?.toFixed(2) || '0.00'}</Text>
            </View>
            {order.tax > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tax:</Text>
                <Text style={styles.infoValue}>${order.tax?.toFixed(2) || '0.00'}</Text>
              </View>
            )}
            {order.deliveryCharge > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Delivery Charge:</Text>
                <Text style={styles.infoValue}>${order.deliveryCharge?.toFixed(2) || '0.00'}</Text>
              </View>
            )}
            {order.discount > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Discount:</Text>
                <Text style={styles.infoValue}>-${order.discount?.toFixed(2) || '0.00'}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, styles.totalLabel]}>Total:</Text>
              <Text style={[styles.infoValue, styles.totalValue]}>${order.totalAmount?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method:</Text>
              <Text style={styles.infoValue}>{order.paymentMethod || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Status:</Text>
              <Text style={styles.infoValue}>{order.paymentStatus || 'N/A'}</Text>
            </View>
          </View>
          
          {order.orderStatus === 'pending' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => setIsAcceptModalVisible(true)}
              >
                <Icon name="check" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Accept Order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => setIsRejectModalVisible(true)}
              >
                <Icon name="times" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Reject Order</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {order.orderStatus === 'processing' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={handleCompleteOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Icon name="check-circle" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Complete Order</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Card>
      </ScrollView>
      
      {/* Accept Order Modal */}
      <Modal
        visible={isAcceptModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAcceptModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Accept Order</Text>
            
            <Text style={styles.modalText}>
              Please specify the processing time for this order:
            </Text>
            
            <View style={styles.processingTimeContainer}>
              <TouchableOpacity
                style={[styles.timeButton, processingTime === 15 && styles.selectedTimeButton]}
                onPress={() => setProcessingTime(15)}
              >
                <Text style={[styles.timeButtonText, processingTime === 15 && styles.selectedTimeButtonText]}>15 min</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.timeButton, processingTime === 30 && styles.selectedTimeButton]}
                onPress={() => setProcessingTime(30)}
              >
                <Text style={[styles.timeButtonText, processingTime === 30 && styles.selectedTimeButtonText]}>30 min</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.timeButton, processingTime === 45 && styles.selectedTimeButton]}
                onPress={() => setProcessingTime(45)}
              >
                <Text style={[styles.timeButtonText, processingTime === 45 && styles.selectedTimeButtonText]}>45 min</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.timeButton, processingTime === 60 && styles.selectedTimeButton]}
                onPress={() => setProcessingTime(60)}
              >
                <Text style={[styles.timeButtonText, processingTime === 60 && styles.selectedTimeButtonText]}>60 min</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAcceptModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAcceptOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Reject Order Modal */}
      <Modal
        visible={isRejectModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reject Order</Text>
            
            <Text style={styles.modalText}>
              Please select a reason for rejecting this order:
            </Text>
            
            <View style={styles.reasonsContainer}>
              <TouchableOpacity
                style={[styles.reasonButton, rejectReason === 'Out of stock' && styles.selectedReasonButton]}
                onPress={() => setRejectReason('Out of stock')}
              >
                <Text style={[styles.reasonButtonText, rejectReason === 'Out of stock' && styles.selectedReasonButtonText]}>Out of stock</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.reasonButton, rejectReason === 'Kitchen closed' && styles.selectedReasonButton]}
                onPress={() => setRejectReason('Kitchen closed')}
              >
                <Text style={[styles.reasonButtonText, rejectReason === 'Kitchen closed' && styles.selectedReasonButtonText]}>Kitchen closed</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.reasonButton, rejectReason === 'Too busy' && styles.selectedReasonButton]}
                onPress={() => setRejectReason('Too busy')}
              >
                <Text style={[styles.reasonButtonText, rejectReason === 'Too busy' && styles.selectedReasonButtonText]}>Too busy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.reasonButton, rejectReason === 'Other' && styles.selectedReasonButton]}
                onPress={() => setRejectReason('Other')}
              >
                <Text style={[styles.reasonButtonText, rejectReason === 'Other' && styles.selectedReasonButtonText]}>Other</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsRejectModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleRejectOrder}
                disabled={isSubmitting || !rejectReason}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  badge: {
    marginLeft: 10,
  },
  divider: {
    marginVertical: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 140,
    fontWeight: 'bold',
    color: '#666',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b00',
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderItemName: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  orderItemPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ff6b00',
  },
  orderItemDetails: {
    marginTop: 5,
  },
  orderItemQuantity: {
    marginBottom: 5,
  },
  orderItemExtras: {
    marginTop: 5,
  },
  orderItemExtrasLabel: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  orderItemExtra: {
    marginLeft: 10,
    color: '#666',
  },
  orderItemInstructions: {
    marginTop: 5,
  },
  orderItemInstructionsLabel: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  orderItemInstructionsText: {
    fontStyle: 'italic',
    color: '#666',
  },
  noItemsText: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
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
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  processingTimeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeButton: {
    width: '48%',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedTimeButton: {
    backgroundColor: '#ff6b00',
    borderColor: '#ff6b00',
  },
  timeButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  selectedTimeButtonText: {
    color: '#fff',
  },
  reasonsContainer: {
    marginBottom: 20,
  },
  reasonButton: {
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedReasonButton: {
    backgroundColor: '#ff6b00',
    borderColor: '#ff6b00',
  },
  reasonButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  selectedReasonButtonText: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#ff6b00',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderDetailScreen;
