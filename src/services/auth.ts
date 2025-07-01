import { supabase } from '../lib/supabase';
import { User } from '../types/expense';

interface LoginResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Login failed');
    }

    // Get user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      // If user profile doesn't exist, create a default one
      const defaultUser = {
        id: authData.user.id,
        name: authData.user.email?.split('@')[0] || 'User',
        email: authData.user.email || '',
        role: 'employee' as const,
        department: 'General'
      };

      // Try to insert the user profile
      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert(defaultUser)
        .select()
        .single();

      if (insertError) {
        console.error('Failed to create user profile:', insertError);
        throw new Error('Failed to create user profile');
      }

      const user: User = {
        id: newUserData.id,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        department: newUserData.department || 'General'
      };

      return {
        user,
        token: authData.session?.access_token || ''
      };
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department || 'General'
    };

    return {
      user,
      token: authData.session?.access_token || ''
    };
  }

  async signup(name: string, email: string, password: string, role: 'employee' | 'manager'): Promise<LoginResponse> {
    // First, sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Signup failed');
    }

    // Create user profile in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        role,
        department: role === 'manager' ? 'Management' : 'General'
      })
      .select()
      .single();

    if (userError || !userData) {
      throw new Error('Failed to create user profile');
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department || 'General'
    };

    return {
      user,
      token: authData.session?.access_token || ''
    };
  }

  async getCurrentUser(): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      throw new Error('Not authenticated');
    }

    // Get user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      // If user profile doesn't exist, create a default one
      const defaultUser = {
        id: authData.user.id,
        name: authData.user.email?.split('@')[0] || 'User',
        email: authData.user.email || '',
        role: 'employee' as const,
        department: 'General'
      };

      // Try to insert the user profile
      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert(defaultUser)
        .select()
        .single();

      if (insertError) {
        console.error('Failed to create user profile:', insertError);
        throw new Error('Failed to fetch user profile');
      }

      return {
        id: newUserData.id,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        department: newUserData.department || 'General'
      };
    }

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department || 'General'
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }
}

export const authService = new AuthService();