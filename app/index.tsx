import { Redirect } from 'expo-router';
import { useAuth } from './providers/AuthProvider';

export default function Index() {
  const { user } = useAuth();

  // If user is authenticated, redirect to main app
  if (user) {
    return <Redirect href="/apps/tabs/dialPad" />;
  }

  // If not authenticated, redirect to auth
  return <Redirect href="/auth/login" />;
}
