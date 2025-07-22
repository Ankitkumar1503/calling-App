// hooks/useProtectedRoute.ts
import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useAuth } from '../providers/AuthProvider';

export function useProtectedRoute() {
  const { user, initialized, error } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Don't do anything if auth is not initialized yet
    if (!initialized) {
      console.log('Auth not initialized yet');
      return;
    }

    // Reset navigation flag when auth state changes
    hasNavigated.current = false;

    // If there's an auth error, redirect to login
    if (error) {
      console.log('Auth error, redirecting to login:', error);
      router.replace('/auth/login');
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    console.log('Current segments:', segments);
    console.log('In auth group:', inAuthGroup);
    console.log('User exists:', !!user);
    console.log('Has navigated:', hasNavigated.current);
    
    // Prevent multiple navigations
    if (hasNavigated.current) {
      return;
    }

    if (!user && !inAuthGroup) {
      console.log('No user, redirecting to login');
      hasNavigated.current = true;
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      console.log('User logged in, redirecting to dialpad');
      hasNavigated.current = true;
      // Use the correct route path based on your file structure
      router.replace('/apps/tabs/dialPad'); // or '/apps/tabs/dialpad' - check your actual file name
    }
  }, [user, initialized, segments, error, router]);

  return {
    user,
    initialized,
    error,
  };
}