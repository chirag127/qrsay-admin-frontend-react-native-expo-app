import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../constants';

const ResetPasswordSchema = Yup.object().shape({
  token: Yup.string()
    .required('Reset token is required'),
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
});

const ResetPasswordScreen = ({ navigation, route }) => {
  const { resetPassword, error } = useAuth();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  // Get token from route params if available
  const initialToken = route.params?.token || '';

  const formik = useFormik({
    initialValues: {
      token: initialToken,
      password: '',
      confirmPassword: '',
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await resetPassword(values.password, values.token);
        Alert.alert(
          'Password Reset Successful',
          'Your password has been reset successfully. Please login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } catch (error) {
        console.error('Reset password error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleSecureConfirmEntry = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry);
  };

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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your reset token and create a new password for your account.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Reset Token"
            value={formik.values.token}
            onChangeText={formik.handleChange('token')}
            onBlur={formik.handleBlur('token')}
            error={formik.touched.token && formik.errors.token}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="key" color={COLORS.gray} />}
            autoCapitalize="none"
          />
          {formik.touched.token && formik.errors.token && (
            <Text style={styles.errorText}>{formik.errors.token}</Text>
          )}

          <TextInput
            label="New Password"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            error={formik.touched.password && formik.errors.password}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            secureTextEntry={secureTextEntry}
            left={<TextInput.Icon icon="lock" color={COLORS.gray} />}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye' : 'eye-off'}
                color={COLORS.gray}
                onPress={toggleSecureEntry}
              />
            }
          />
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.errorText}>{formik.errors.password}</Text>
          )}

          <TextInput
            label="Confirm New Password"
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            secureTextEntry={secureConfirmTextEntry}
            left={<TextInput.Icon icon="lock-check" color={COLORS.gray} />}
            right={
              <TextInput.Icon
                icon={secureConfirmTextEntry ? 'eye' : 'eye-off'}
                color={COLORS.gray}
                onPress={toggleSecureConfirmEntry}
              />
            }
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            mode="contained"
            onPress={formik.handleSubmit}
            style={styles.button}
            contentStyle={styles.buttonContent}
            loading={loading}
            disabled={loading}
            color={COLORS.primary}
          >
            Reset Password
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

export default ResetPasswordScreen;
