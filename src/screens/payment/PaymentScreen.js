import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Divider, List, Switch, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

// This would typically come from an API service
const getPaymentSettings = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          paymentSettings: {
            cashOnDelivery: true,
            onlinePayment: true,
            razorpay: {
              enabled: true,
              keyId: 'rzp_test_1234567890',
              keySecret: '••••••••••••••',
            },
            stripe: {
              enabled: false,
              publishableKey: '',
              secretKey: '',
            },
            paypal: {
              enabled: false,
              clientId: '',
              clientSecret: '',
            },
            tax: {
              enabled: true,
              percentage: 5,
              name: 'GST',
            },
          }
        }
      });
    }, 1000);
  });
};

const PaymentScreen = ({ navigation }) => {
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [editingTax, setEditingTax] = useState(false);
  const [taxName, setTaxName] = useState('');
  const [taxPercentage, setTaxPercentage] = useState('');
  
  useEffect(() => {
    fetchPaymentSettings();
  }, []);
  
  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPaymentSettings();
      
      if (response && response.data && response.data.paymentSettings) {
        setPaymentSettings(response.data.paymentSettings);
        setTaxName(response.data.paymentSettings.tax.name);
        setTaxPercentage(response.data.paymentSettings.tax.percentage.toString());
      } else {
        setError('Failed to load payment settings');
      }
    } catch (err) {
      setError(err.message || 'Failed to load payment settings');
      console.error('Error fetching payment settings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentSettings();
    setRefreshing(false);
  };
  
  const handleTogglePaymentMethod = async (method) => {
    try {
      // This would typically be an API call
      // const response = await updatePaymentSettings({
      //   ...paymentSettings,
      //   [method]: !paymentSettings[method],
      // });
      
      // For now, update the local state
      setPaymentSettings({
        ...paymentSettings,
        [method]: !paymentSettings[method],
      });
      
      Alert.alert('Success', `${method === 'cashOnDelivery' ? 'Cash on Delivery' : 'Online Payment'} ${!paymentSettings[method] ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating payment settings:', error);
      Alert.alert('Error', 'Failed to update payment settings');
    }
  };
  
  const handleTogglePaymentGateway = async (gateway) => {
    try {
      // This would typically be an API call
      // const response = await updatePaymentSettings({
      //   ...paymentSettings,
      //   [gateway]: {
      //     ...paymentSettings[gateway],
      //     enabled: !paymentSettings[gateway].enabled,
      //   },
      // });
      
      // For now, update the local state
      setPaymentSettings({
        ...paymentSettings,
        [gateway]: {
          ...paymentSettings[gateway],
          enabled: !paymentSettings[gateway].enabled,
        },
      });
      
      Alert.alert('Success', `${gateway.charAt(0).toUpperCase() + gateway.slice(1)} ${!paymentSettings[gateway].enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating payment gateway:', error);
      Alert.alert('Error', 'Failed to update payment gateway');
    }
  };
  
  const handleToggleTax = async () => {
    try {
      // This would typically be an API call
      // const response = await updatePaymentSettings({
      //   ...paymentSettings,
      //   tax: {
      //     ...paymentSettings.tax,
      //     enabled: !paymentSettings.tax.enabled,
      //   },
      // });
      
      // For now, update the local state
      setPaymentSettings({
        ...paymentSettings,
        tax: {
          ...paymentSettings.tax,
          enabled: !paymentSettings.tax.enabled,
        },
      });
      
      Alert.alert('Success', `Tax ${!paymentSettings.tax.enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating tax settings:', error);
      Alert.alert('Error', 'Failed to update tax settings');
    }
  };
  
  const handleUpdateTax = async () => {
    if (!taxName.trim()) {
      Alert.alert('Error', 'Tax name cannot be empty');
      return;
    }
    
    if (!taxPercentage.trim() || isNaN(parseFloat(taxPercentage)) || parseFloat(taxPercentage) < 0) {
      Alert.alert('Error', 'Please enter a valid tax percentage');
      return;
    }
    
    try {
      // This would typically be an API call
      // const response = await updatePaymentSettings({
      //   ...paymentSettings,
      //   tax: {
      //     ...paymentSettings.tax,
      //     name: taxName,
      //     percentage: parseFloat(taxPercentage),
      //   },
      // });
      
      // For now, update the local state
      setPaymentSettings({
        ...paymentSettings,
        tax: {
          ...paymentSettings.tax,
          name: taxName,
          percentage: parseFloat(taxPercentage),
        },
      });
      
      setEditingTax(false);
      Alert.alert('Success', 'Tax settings updated successfully');
    } catch (error) {
      console.error('Error updating tax settings:', error);
      Alert.alert('Error', 'Failed to update tax settings');
    }
  };
  
  if (loading && !refreshing) {
    return <LoadingScreen />;
  }
  
  if (error || !paymentSettings) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title="Payment Settings" />
        </Appbar.Header>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{error || 'Failed to load payment settings'}</Text>
          <Button mode="contained" onPress={fetchPaymentSettings} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Payment Settings" />
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
            <Title style={styles.cardTitle}>Payment Methods</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Cash on Delivery"
              description="Allow customers to pay with cash on delivery"
              left={props => <List.Icon {...props} icon="cash" />}
              right={props => (
                <Switch
                  value={paymentSettings.cashOnDelivery}
                  onValueChange={() => handleTogglePaymentMethod('cashOnDelivery')}
                  color={COLORS.primary}
                />
              )}
            />
            
            <List.Item
              title="Online Payment"
              description="Allow customers to pay online"
              left={props => <List.Icon {...props} icon="credit-card" />}
              right={props => (
                <Switch
                  value={paymentSettings.onlinePayment}
                  onValueChange={() => handleTogglePaymentMethod('onlinePayment')}
                  color={COLORS.primary}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Payment Gateways</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Razorpay"
              description={paymentSettings.razorpay.enabled ? 'Enabled' : 'Disabled'}
              left={props => <List.Icon {...props} icon="credit-card-outline" />}
              right={props => (
                <Switch
                  value={paymentSettings.razorpay.enabled}
                  onValueChange={() => handleTogglePaymentGateway('razorpay')}
                  color={COLORS.primary}
                />
              )}
            />
            
            {paymentSettings.razorpay.enabled && (
              <View style={styles.gatewayDetails}>
                <View style={styles.keyValuePair}>
                  <Text style={styles.keyLabel}>Key ID:</Text>
                  <Text style={styles.keyValue}>{paymentSettings.razorpay.keyId}</Text>
                </View>
                <View style={styles.keyValuePair}>
                  <Text style={styles.keyLabel}>Key Secret:</Text>
                  <Text style={styles.keyValue}>{paymentSettings.razorpay.keySecret}</Text>
                </View>
                <Button
                  mode="outlined"
                  onPress={() => {
                    Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
                  }}
                  style={styles.updateButton}
                  icon="pencil"
                >
                  Update Keys
                </Button>
              </View>
            )}
            
            <List.Item
              title="Stripe"
              description={paymentSettings.stripe.enabled ? 'Enabled' : 'Disabled'}
              left={props => <List.Icon {...props} icon="credit-card-outline" />}
              right={props => (
                <Switch
                  value={paymentSettings.stripe.enabled}
                  onValueChange={() => handleTogglePaymentGateway('stripe')}
                  color={COLORS.primary}
                />
              )}
            />
            
            {paymentSettings.stripe.enabled && (
              <View style={styles.gatewayDetails}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
                  }}
                  style={styles.updateButton}
                  icon="pencil"
                >
                  Configure Stripe
                </Button>
              </View>
            )}
            
            <List.Item
              title="PayPal"
              description={paymentSettings.paypal.enabled ? 'Enabled' : 'Disabled'}
              left={props => <List.Icon {...props} icon="credit-card-outline" />}
              right={props => (
                <Switch
                  value={paymentSettings.paypal.enabled}
                  onValueChange={() => handleTogglePaymentGateway('paypal')}
                  color={COLORS.primary}
                />
              )}
            />
            
            {paymentSettings.paypal.enabled && (
              <View style={styles.gatewayDetails}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
                  }}
                  style={styles.updateButton}
                  icon="pencil"
                >
                  Configure PayPal
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Tax Settings</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Apply Tax"
              description={`Apply ${paymentSettings.tax.name} (${paymentSettings.tax.percentage}%) to orders`}
              left={props => <List.Icon {...props} icon="percent" />}
              right={props => (
                <Switch
                  value={paymentSettings.tax.enabled}
                  onValueChange={handleToggleTax}
                  color={COLORS.primary}
                />
              )}
            />
            
            {paymentSettings.tax.enabled && !editingTax && (
              <Button
                mode="outlined"
                onPress={() => setEditingTax(true)}
                style={styles.updateButton}
                icon="pencil"
              >
                Edit Tax Settings
              </Button>
            )}
            
            {paymentSettings.tax.enabled && editingTax && (
              <View style={styles.taxForm}>
                <TextInput
                  label="Tax Name"
                  value={taxName}
                  onChangeText={setTaxName}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Tax Percentage"
                  value={taxPercentage}
                  onChangeText={setTaxPercentage}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  right={<TextInput.Affix text="%" />}
                />
                <View style={styles.taxFormButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setEditingTax(false);
                      setTaxName(paymentSettings.tax.name);
                      setTaxPercentage(paymentSettings.tax.percentage.toString());
                    }}
                    style={[styles.taxFormButton, styles.cancelButton]}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleUpdateTax}
                    style={[styles.taxFormButton, styles.saveButton]}
                  >
                    Save
                  </Button>
                </View>
              </View>
            )}
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
    paddingBottom: SIZES.extraLarge,
  },
  card: {
    marginBottom: SIZES.medium,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    marginVertical: SIZES.base,
  },
  gatewayDetails: {
    paddingHorizontal: SIZES.medium,
    paddingBottom: SIZES.medium,
  },
  keyValuePair: {
    flexDirection: 'row',
    marginBottom: SIZES.base / 2,
  },
  keyLabel: {
    width: 80,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  keyValue: {
    flex: 1,
    color: COLORS.text,
  },
  updateButton: {
    marginTop: SIZES.base,
    borderColor: COLORS.primary,
  },
  taxForm: {
    paddingHorizontal: SIZES.medium,
    paddingBottom: SIZES.medium,
  },
  input: {
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white,
  },
  taxFormButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.base,
  },
  taxFormButton: {
    marginLeft: SIZES.base,
  },
  cancelButton: {
    borderColor: COLORS.gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.extraLarge,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginVertical: SIZES.medium,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
  },
});

export default PaymentScreen;
