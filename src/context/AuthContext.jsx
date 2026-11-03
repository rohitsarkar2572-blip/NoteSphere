import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  // Optional local preview state explicitly labeled for UI testing when Supabase is unconfigured
  const [isDevPreview, setIsDevPreview] = useState(() => {
    return localStorage.getItem('notesphere_dev_preview') === 'true';
  });

  useEffect(() => {
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { session: currentSession } = await authService.getSession();
          setSession(currentSession);
          setUser(currentSession?.user || null);

          const { data } = authService.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);
          });
          unsubscribe = data.subscription.unsubscribe;
        } catch (err) {
          console.error('Error initializing Supabase Auth:', err);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase backend is unconfigured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }
    const { data, error } = await authService.signIn({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  };

  // Register handler
  const register = async (details) => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase backend is unconfigured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }
    const { data, error } = await authService.signUp(details);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  };

  // Logout handler
  const logout = async () => {
    if (isDevPreview) {
      setIsDevPreview(false);
      localStorage.removeItem('notesphere_dev_preview');
      return { success: true };
    }
    if (isSupabaseConfigured) {
      const { error } = await authService.signOut();
      if (error) return { success: false, error: error.message };
    }
    setUser(null);
    setSession(null);
    return { success: true };
  };

  // Profile update handler
  const updateProfile = async (updates) => {
    if (!isSupabaseConfigured) {
      if (isDevPreview) {
        // Dev preview in-memory update for UI feedback only
        return { success: true };
      }
      return {
        success: false,
        error: 'Supabase backend is unconfigured. Connect Supabase to persist profile changes.',
      };
    }
    const { data, error } = await authService.updateProfile(updates);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  // Dev preview toggle (for inspecting protected layouts before Supabase connection)
  const enableDevPreview = () => {
    setIsDevPreview(true);
    localStorage.setItem('notesphere_dev_preview', 'true');
  };

  const disableDevPreview = () => {
    setIsDevPreview(false);
    localStorage.removeItem('notesphere_dev_preview');
  };

  // Active user representation
  const activeUser = user || (isDevPreview ? {
    id: 'dev-preview-user',
    email: 'student.preview@university.edu',
    user_metadata: {
      full_name: 'Dev Student (UI Preview Mode)',
      course: 'Computer Science',
      semester: '4',
    },
    isDevPreview: true,
  } : null);

  const value = {
    user: activeUser,
    session,
    loading,
    isConfigured: isSupabaseConfigured,
    isDevPreview,
    enableDevPreview,
    disableDevPreview,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
