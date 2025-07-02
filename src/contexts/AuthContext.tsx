import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/expense';
import { authService } from '../services/auth';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'employee' | 'manager') => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found existing session, fetching user data...');
          const userData = await authService.getCurrentUser();
          setUser(userData);
          console.log('User data loaded:', userData);
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('Auth initialization complete');
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            console.log('User signed in, fetching profile...');
            const userData = await authService.getCurrentUser();
            setUser(userData);
            console.log('User profile loaded after sign in:', userData);
          } catch (error) {
            console.error('Error fetching user data after sign in:', error);
            setUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
        }
        
        // Don't set loading to false here as it can cause race conditions
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process...');
      const { user: userData } = await authService.login(email, password);
      setUser(userData);
      console.log('Login successful, user set:', userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'employee' | 'manager') => {
    try {
      console.log('Starting signup process...');
      const { user: userData } = await authService.signup(name, email, password, role);
      setUser(userData);
      console.log('Signup successful, user set:', userData);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  console.log('Auth context state:', { user: !!user, loading, isAuthenticated: !!user });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};