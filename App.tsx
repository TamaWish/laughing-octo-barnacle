import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppNavigator />
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
