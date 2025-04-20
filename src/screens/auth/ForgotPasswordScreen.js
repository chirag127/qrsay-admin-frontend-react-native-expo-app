import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../constants';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const { forgotPassword, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await forgotPassword(values.email);
        setSuccess(true);
        Alert.alert(
          'Password Reset Email Sent',
          'Please check your email for instructions to reset your password.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } catch (error) {
        console.error('Forgot password error:', error);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            error={formik.touched.email && formik.errors.email}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="email" color={COLORS.gray} />}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={styles.errorText}>{formik.errors.email}</Text>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {success && (
            <Text style={styles.successText}>
              Password reset email sent. Please check your inbox.
            </Text>
          )}

          <Button
            mode="contained"
            onPress={formik.handleSubmit}
            style={styles.button}
            contentStyle={styles.buttonContent}
            loading={loading}
            disabled={loading}
            color={COLORS.primary}
          >
            Send Reset Link
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.extraLarge,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.extraLarge,
    left: SIZES.extraLarge,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.base,
    marginHorizontal: SIZES.large,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  successText: {
    color: COLORS.success,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  button: {
    marginTop: SIZES.medium,
    borderRadius: SIZES.base,
  },
  buttonContent: {
    height: 50,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  loginText: {
    color: COLORS.gray,
    fontSize: SIZES.font,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
