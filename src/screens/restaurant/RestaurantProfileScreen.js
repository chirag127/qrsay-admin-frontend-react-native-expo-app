import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, TextInput, Button, Divider, Card, Title, Paragraph } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

const RestaurantProfileSchema = Yup.object().shape({
  restaurantName: Yup.string().required('Restaurant name is required'),
  restaurantType: Yup.string().required('Restaurant type is required'),
  restaurantPhoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  fssaiLicenseNumber: Yup.string().required('FSSAI license number is required'),
  restaurantEmail: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pinCode: Yup.string().required('PIN code is required'),
    latitude: Yup.string().required('Latitude is required'),
    longitude: Yup.string().required('Longitude is required'),
  }),
});

const RestaurantProfileScreen = ({ navigation }) => {
  const { restaurant, loading, error, updateRestaurantData } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleSubmit = async (values) => {
    try {
      setFormLoading(true);
      await updateRestaurantData(values);
      setEditMode(false);
      Alert.alert('Success', 'Restaurant profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update restaurant profile');
    } finally {
      setFormLoading(false);
    }
  };

  const initialValues = {
    restaurantName: restaurant?.restaurantName || '',
    restaurantType: restaurant?.restaurantType || '',
    restaurantPhoneNumber: restaurant?.restaurantPhoneNumber || '',
    gstNumber: restaurant?.gstNumber || '',
    fssaiLicenseNumber: restaurant?.fssaiLicenseNumber || '',
    restaurantEmail: restaurant?.restaurantEmail || '',
    address: {
      street: restaurant?.address?.street || '',
      city: restaurant?.address?.city || '',
      state: restaurant?.address?.state || '',
      pinCode: restaurant?.address?.pinCode || '',
      latitude: restaurant?.address?.latitude || '',
      longitude: restaurant?.address?.longitude || '',
      landmark: restaurant?.address?.landmark || '',
    },
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Restaurant Profile" />
        {!editMode ? (
          <Appbar.Action icon="pencil" onPress={() => setEditMode(true)} />
        ) : (
          <Appbar.Action icon="close" onPress={() => setEditMode(false)} />
        )}
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {restaurant?.restaurantLogo && (
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: restaurant.restaurantLogo }}
                style={styles.logo}
                resizeMode="cover"
              />
              {editMode && (
                <TouchableOpacity style={styles.editLogoButton}>
                  <Ionicons name="camera" size={20} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {!restaurant?.restaurantLogo && editMode && (
            <TouchableOpacity style={styles.addLogoContainer}>
              <Ionicons name="add-circle-outline" size={40} color={COLORS.primary} />
              <Text style={styles.addLogoText}>Add Restaurant Logo</Text>
            </TouchableOpacity>
          )}

          {error && (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Text style={styles.errorText}>{error}</Text>
              </Card.Content>
            </Card>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={RestaurantProfileSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <Card style={styles.card}>
                  <Card.Content>
                    <Title style={styles.cardTitle}>Basic Information</Title>
                    <Divider style={styles.divider} />

                    <TextInput
                      label="Restaurant Name"
                      value={values.restaurantName}
                      onChangeText={handleChange('restaurantName')}
                      onBlur={handleBlur('restaurantName')}
                      error={touched.restaurantName && errors.restaurantName}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                    />
                    {touched.restaurantName && errors.restaurantName && (
                      <Text style={styles.errorText}>{errors.restaurantName}</Text>
                    )}

                    <TextInput
                      label="Restaurant Type"
                      value={values.restaurantType}
                      onChangeText={handleChange('restaurantType')}
                      onBlur={handleBlur('restaurantType')}
                      error={touched.restaurantType && errors.restaurantType}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                    />
                    {touched.restaurantType && errors.restaurantType && (
                      <Text style={styles.errorText}>{errors.restaurantType}</Text>
                    )}

                    <TextInput
                      label="Phone Number"
                      value={values.restaurantPhoneNumber}
                      onChangeText={handleChange('restaurantPhoneNumber')}
                      onBlur={handleBlur('restaurantPhoneNumber')}
                      error={touched.restaurantPhoneNumber && errors.restaurantPhoneNumber}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                      keyboardType="phone-pad"
                    />
                    {touched.restaurantPhoneNumber && errors.restaurantPhoneNumber && (
                      <Text style={styles.errorText}>{errors.restaurantPhoneNumber}</Text>
                    )}

                    <TextInput
                      label="Email"
                      value={values.restaurantEmail}
                      onChangeText={handleChange('restaurantEmail')}
                      onBlur={handleBlur('restaurantEmail')}
                      error={touched.restaurantEmail && errors.restaurantEmail}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                      keyboardType="email-address"
                    />
                    {touched.restaurantEmail && errors.restaurantEmail && (
                      <Text style={styles.errorText}>{errors.restaurantEmail}</Text>
                    )}
                  </Card.Content>
                </Card>

                <Card style={styles.card}>
                  <Card.Content>
                    <Title style={styles.cardTitle}>License Information</Title>
                    <Divider style={styles.divider} />

                    <TextInput
                      label="FSSAI License Number"
                      value={values.fssaiLicenseNumber}
                      onChangeText={handleChange('fssaiLicenseNumber')}
                      onBlur={handleBlur('fssaiLicenseNumber')}
                      error={touched.fssaiLicenseNumber && errors.fssaiLicenseNumber}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                    />
                    {touched.fssaiLicenseNumber && errors.fssaiLicenseNumber && (
                      <Text style={styles.errorText}>{errors.fssaiLicenseNumber}</Text>
                    )}

                    <TextInput
                      label="GST Number (Optional)"
                      value={values.gstNumber}
                      onChangeText={handleChange('gstNumber')}
                      onBlur={handleBlur('gstNumber')}
                      error={touched.gstNumber && errors.gstNumber}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                    />
                    {touched.gstNumber && errors.gstNumber && (
                      <Text style={styles.errorText}>{errors.gstNumber}</Text>
                    )}
                  </Card.Content>
                </Card>

                <Card style={styles.card}>
                  <Card.Content>
                    <Title style={styles.cardTitle}>Address</Title>
                    <Divider style={styles.divider} />

                    <TextInput
                      label="Street"
                      value={values.address.street}
                      onChangeText={handleChange('address.street')}
                      onBlur={handleBlur('address.street')}
                      error={touched.address?.street && errors.address?.street}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                    />
                    {touched.address?.street && errors.address?.street && (
                      <Text style={styles.errorText}>{errors.address.street}</Text>
                    )}

                    <TextInput
                      label="City"
                      value={values.address.city}
                      onChangeText={handleChange('address.city')}
                      onBlur={handleBlur('address.city')}
                      error={touched.address?.city && errors.address?.city}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                    />
                    {touched.address?.city && errors.address?.city && (
                      <Text style={styles.errorText}>{errors.address.city}</Text>
                    )}

                    <TextInput
                      label="State"
                      value={values.address.state}
                      onChangeText={handleChange('address.state')}
                      onBlur={handleBlur('address.state')}
                      error={touched.address?.state && errors.address?.state}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                    />
                    {touched.address?.state && errors.address?.state && (
                      <Text style={styles.errorText}>{errors.address.state}</Text>
                    )}

                    <TextInput
                      label="PIN Code"
                      value={values.address.pinCode}
                      onChangeText={handleChange('address.pinCode')}
                      onBlur={handleBlur('address.pinCode')}
                      error={touched.address?.pinCode && errors.address?.pinCode}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                      keyboardType="number-pad"
                    />
                    {touched.address?.pinCode && errors.address?.pinCode && (
                      <Text style={styles.errorText}>{errors.address.pinCode}</Text>
                    )}

                    <TextInput
                      label="Landmark (Optional)"
                      value={values.address.landmark}
                      onChangeText={handleChange('address.landmark')}
                      onBlur={handleBlur('address.landmark')}
                      error={touched.address?.landmark && errors.address?.landmark}
                      style={styles.input}
                      disabled={!editMode}
                      mode="outlined"
                    />
                    {touched.address?.landmark && errors.address?.landmark && (
                      <Text style={styles.errorText}>{errors.address.landmark}</Text>
                    )}

                    <View style={styles.rowContainer}>
                      <TextInput
                        label="Latitude"
                        value={values.address.latitude}
                        onChangeText={handleChange('address.latitude')}
                        onBlur={handleBlur('address.latitude')}
                        error={touched.address?.latitude && errors.address?.latitude}
                        style={[styles.input, styles.halfInput]}
                        disabled={!editMode}
                        mode="outlined"
                        keyboardType="decimal-pad"
                      />
                      <TextInput
                        label="Longitude"
                        value={values.address.longitude}
                        onChangeText={handleChange('address.longitude')}
                        onBlur={handleBlur('address.longitude')}
                        error={touched.address?.longitude && errors.address?.longitude}
                        style={[styles.input, styles.halfInput]}
                        disabled={!editMode}
                        mode="outlined"
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <View style={styles.rowContainer}>
                      {touched.address?.latitude && errors.address?.latitude && (
                        <Text style={[styles.errorText, styles.halfInput]}>{errors.address.latitude}</Text>
                      )}
                      {touched.address?.longitude && errors.address?.longitude && (
                        <Text style={[styles.errorText, styles.halfInput]}>{errors.address.longitude}</Text>
                      )}
                    </View>

                    {editMode && (
                      <Button
                        mode="outlined"
                        onPress={() => {
                          // This would typically use a location picker or map
                          Alert.alert('Location', 'This would open a map to pick location');
                        }}
                        style={styles.locationButton}
                        icon="map-marker"
                      >
                        Pick Location on Map
                      </Button>
                    )}
                  </Card.Content>
                </Card>

                {editMode && (
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      onPress={handleSubmit}
                      style={styles.submitButton}
                      loading={formLoading}
                      disabled={formLoading}
                    >
                      Save Changes
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => setEditMode(false)}
                      style={styles.cancelButton}
                      disabled={formLoading}
                    >
                      Cancel
                    </Button>
                  </View>
                )}
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.large,
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  editLogoButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.large,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    alignSelf: 'center',
  },
  addLogoText: {
    color: COLORS.primary,
    marginTop: SIZES.base,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
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
  input: {
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    marginBottom: SIZES.medium,
  },
  locationButton: {
    marginTop: SIZES.base,
    borderColor: COLORS.primary,
  },
  buttonContainer: {
    marginTop: SIZES.medium,
  },
  submitButton: {
    marginBottom: SIZES.base,
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    borderColor: COLORS.primary,
  },
});

export default RestaurantProfileScreen;
