import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ErrorBoundary from 'react-native-error-boundary';

// Mengimpor halaman LiveScreen yang baru saja kita buat
import LiveScreen from './src/screens/LiveScreen';

// Komponen Tampilan Error (Jika terjadi crash)
const CustomFallback = (props) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>Oops! Ada yang salah.</Text>
    <Text style={styles.errorText}>{props.error.toString()}</Text>
    <Text style={styles.errorSub}>Jangan panik, perbaiki kodenya dan muat ulang.</Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <SafeAreaView style={styles.container}>
          
          {/* Memanggil halaman LiveScreen di sini */}
          <LiveScreen />
          
          <StatusBar style="light" />
        </SafeAreaView>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050507',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#1a1a24',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    color: '#ef4444',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorSub: {
    color: '#9ca3af',
    fontSize: 12,
  }
});
