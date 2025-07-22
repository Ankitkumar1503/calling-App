// app/auth/_layout.tsx
import { Stack } from 'expo-router';
import CustomHeader from '../../component/UI/CustomHeader';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <CustomHeader />, // Default header for all auth screens
        contentStyle: {
          backgroundColor: 'transparent',
          marginTop: -130
        }
      }}
    >
      <Stack.Screen
        name="_layout"
        options={{
          headerBackVisible: false, // No back button on login
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up", // Custom title
        }}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{
          title: "Reset Password",
        }}
      />
    </Stack>
  );
}