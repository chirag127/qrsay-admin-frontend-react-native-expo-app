import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, TextInput, Button, HelperText, RadioButton, Switch } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  role: Yup.string()
    .oneOf(['admin', 'manager', 'staff'], 'Invalid role')
    .required('Role is required'),
});

// This would typically come from an API service
const getUserById = async (userId) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          user: {
            _id: userId,
            name: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '1234567890',
            role: 'admin',
            active: true,
          }
        }
      });
    }, 1000);
  });
};

const EditUserScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  
  useEffect(() => {
    fetchUser();
  }, []);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserById(userId);
      
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user details');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // This would typically be an API call
      // const response = await updateUser(userId, values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'User updated successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (error || !user) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit User" />
        </Appbar.Header>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'User not found'}</Text>
          <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }
  
  // Create validation schema based on whether password change is enabled
  const validationSchema = changePassword
    ? UserSchema.shape({
        password: Yup.string()
          .min(8, 'Password must be at least 8 characters')
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
          )
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm password is required'),
      })
    : UserSchema;
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Edit User" />
      </Appbar.Header>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Formik
            initialValues={{
              name: user.name || '',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
              role: user.role || 'staff',
              active: user.active !== undefined ? user.active : true,
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.formContainer}>
                <TextInput
                  label="Full Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name}
                  style={styles.input}
                  mode="outlined"
                  left={<TextInput.Icon icon="account" color={COLORS.gray} />}
                />
                {touched.name && errors.name && (
                  <HelperText type="error">{errors.name}</HelperText>
                )}
                
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" color={COLORS.gray} />}
                />
                {touched.email && errors.email && (
                  <HelperText type="error">{errors.email}</HelperText>
                )}
                
                <TextInput
                  label="Phone Number"
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  error={touched.phoneNumber && errors.phoneNumber}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="phone-pad"
                  left={<TextInput.Icon icon="phone" color={COLORS.gray} />}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <HelperText type="error">{errors.phoneNumber}</HelperText>
                )}
                
                <Text style={styles.label}>Role</Text>
                <RadioButton.Group
                  onValueChange={value => setFieldValue('role', value)}
                  value={values.role}
                >
                  <View style={styles.radioContainer}>
                    <View style={styles.radioButton}>
                      <RadioButton value="admin" color={COLORS.primary} />
                      <Text style={styles.radioLabel}>Admin</Text>
                    </View>
                    <View style={styles.radioButton}>
                      <RadioButton value="manager" color={COLORS.primary} />
                      <Text style={styles.radioLabel}>Manager</Text>
                    </View>
                    <View style={styles.radioButton}>
                      <RadioButton value="staff" color={COLORS.primary} />
                      <Text style={styles.radioLabel}>Staff</Text>
                    </View>
                  </View>
                </RadioButton.Group>
                {touched.role && errors.role && (
                  <HelperText type="error">{errors.role}</HelperText>
                )}
                
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Active</Text>
                  <Switch
                    value={values.active}
                    onValueChange={(value) => setFieldValue('active', value)}
                    color={COLORS.primary}
                  />
                </View>
                
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Change Password</Text>
                  <Switch
                    value={changePassword}
                    onValueChange={setChangePassword}
                    color={COLORS.primary}
                  />
                </View>
                
                {changePassword && (
                  <>
                    <TextInput
                      label="New Password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={touched.password && errors.password}
                      style={styles.input}
                      mode="outlined"
                      secureTextEntry={secureTextEntry}
                      left={<TextInput.Icon icon="lock" color={COLORS.gray} />}
                      right={
                        <TextInput.Icon
                          icon={secureTextEntry ? 'eye' : 'eye-off'}
                          color={COLORS.gray}
                          onPress={() => setSecureTextEntry(!secureTextEntry)}
                        />
                      }
                    />
                    {touched.password && errors.password && (
                      <HelperText type="error">{errors.password}</HelperText>
                    )}
                    
                    <TextInput
                      label="Confirm New Password"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      error={touched.confirmPassword && errors.confirmPassword}
                      style={styles.input}
                      mode="outlined"
                      secureTextEntry={secureConfirmTextEntry}
                      left={<TextInput.Icon icon="lock-check" color={COLORS.gray} />}
                      right={
                        <TextInput.Icon
                          icon={secureConfirmTextEntry ? 'eye' : 'eye-off'}
                          color={COLORS.gray}
                          onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                        />
                      }
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <HelperText type="error">{errors.confirmPassword}</HelperText>
                    )}
                  </>
                )}
                
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  loading={submitting}
                  disabled={submitting}
                >
                  Update User
                </Button>
                
                <Button
                  mode="outlined"
                  onPress={() => navigation.goBack()}
                  style={styles.cancelButton}
                  disabled={submitting}
                >
                  Cancel
                </Button>
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
    paddingBottom: SIZES.extraLarge,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white,
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
    marginTop: SIZES.base,
    color: COLORS.text,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.medium,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  radioLabel: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  switchLabel: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  submitButton: {
    marginTop: SIZES.medium,
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    marginTop: SIZES.base,
    borderColor: COLORS.primary,
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
    marginBottom: SIZES.medium,
  },
  backButton: {
    backgroundColor: COLORS.primary,
  },
});

export default EditUserScreen;
