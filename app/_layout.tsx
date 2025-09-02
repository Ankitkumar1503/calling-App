// app/_layout.tsx
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { CallProvider } from '../contexts/CallContext';
import './global.css';
import { useProtectedRoute } from './hooks/useProtectedRoute';
import { AuthProvider, useAuth } from './providers/AuthProvider';

function AppLayout() {
  useProtectedRoute();
  const { initialized } = useAuth();

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      
      {/* Main app screens */}
      <Stack.Screen name="apps" options={{ headerShown: false }} />
      
      {/* Index route for initial redirect */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CallProvider>
      <AppLayout />
      </CallProvider>
    </AuthProvider>
  );
}