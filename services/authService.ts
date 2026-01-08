import { User } from '../types';
import { supabase } from './supabaseClient';

const SESSION_KEY = 'etihad_session';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user found');

    // Get profile details (role, etc.)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const loggedInUser: User = {
      id: data.user.id,
      name: profile?.full_name || data.user.user_metadata?.full_name || 'User',
      email: data.user.email!,
      role: profile?.role || 'CUSTOMER'
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
    return loggedInUser;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed');

    // Create profile entry
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: data.user.id, full_name: name, role: 'CUSTOMER' }
      ]);

    if (profileError) console.error('Profile creation error:', profileError);

    const newUser: User = {
      id: data.user.id,
      name: name,
      email: data.user.email!,
      role: 'CUSTOMER'
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  autoRegister: async (name: string, email: string): Promise<{ userId: string, password: string }> => {
    // Generate a secure random password
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      // If user already exists, we might get an error. 
      // In a real app we'd handle "user already exists" gracefully.
      throw error;
    }

    if (!data.user) throw new Error('Auto-registration failed');

    // Create profile entry
    await supabase
      .from('profiles')
      .insert([
        { id: data.user.id, full_name: name, role: 'CUSTOMER' }
      ]);

    return { userId: data.user.id, password };
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  refreshUserProfile: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    const updatedUser: User = {
      id: user.id,
      name: profile.full_name || user.user_metadata?.full_name || 'User',
      email: user.email!,
      role: profile.role || 'CUSTOMER'
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }
};