import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { OrderProvider } from './src/context/OrderContext';
import { WaiterCallProvider } from './src/context/WaiterCallContext';
import { COLORS } from './src/constants';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Warning: ...',  // Add specific warnings to ignore
  'Require cycle:',
]);

// Create a theme for react-native-paper
const theme = {
  colors: {
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.white,
    text: COLORS.text,
    error: COLORS.error,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <OrderProvider>
            <WaiterCallProvider>
              <StatusBar style="light" backgroundColor={COLORS.primary} />
              <AppNavigator />
              <Toast />
            </WaiterCallProvider>
          </OrderProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
