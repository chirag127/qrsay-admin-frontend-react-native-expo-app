import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, TextInput, Button, HelperText, RadioButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { COLORS, SIZES } from '../../constants';

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
  role: Yup.string()
    .oneOf(['admin', 'manager', 'staff'], 'Invalid role')
    .required('Role is required'),
});

const AddUserScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // This would typically be an API call
      // const response = await createUser(values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'User created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add User" />
      </Appbar.Header>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Formik
            initialValues={{
              name: '',
              email: '',
              phoneNumber: '',
              password: '',
              confirmPassword: '',
              role: 'staff',
            }}
            validationSchema={UserSchema}
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
                
                <TextInput
                  label="Password"
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
                  label="Confirm Password"
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
                
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  loading={loading}
                  disabled={loading}
                >
                  Create User
                </Button>
                
                <Button
                  mode="outlined"
                  onPress={() => navigation.goBack()}
                  style={styles.cancelButton}
                  disabled={loading}
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
  submitButton: {
    marginTop: SIZES.medium,
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    marginTop: SIZES.base,
    borderColor: COLORS.primary,
  },
});

export default AddUserScreen;
