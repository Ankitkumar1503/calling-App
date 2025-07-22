// app/_layout.tsx
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
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
      
      {/* Tab screens */}
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      
      {/* Other screens that are not in tabs or auth */}
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}