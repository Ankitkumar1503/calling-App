// providers/AuthProvider.tsx
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  initialized: boolean;
  error?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  initialized: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (isMounted) {
          console.log('Auth state changed:', user?.uid || 'No user');
          setUser(user);
          setInitialized(true);
          setError(undefined);
        }
      },
      (err) => {
        if (isMounted) {
          console.error('Auth error:', err);
          setUser(null);
          setInitialized(true);
          setError(err.message);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    initialized,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};