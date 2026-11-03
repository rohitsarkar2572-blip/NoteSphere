import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Authentication Service for NoteSphere
 * Connects directly to Supabase Auth when credentials are supplied.
 */

export const authService = {
  /**
   * Register a new student account
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} params.fullName
   * @param {string} params.course
   * @param {string|number} params.semester
   */
  async signUp({ email, password, fullName, course, semester }) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error(
          'Supabase backend is unconfigured. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable authentication.'
        ),
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            course,
            semester,
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign in an existing student
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   */
  async signIn({ email, password }) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error(
          'Supabase backend is unconfigured. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to log in.'
        ),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign out current student
   */
  async signOut() {
    if (!isSupabaseConfigured || !supabase) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Get currently logged-in user
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: null };
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (err) {
      return { user: null, error: err };
    }
  },

  /**
   * Get active session
   */
  async getSession() {
    if (!isSupabaseConfigured || !supabase) {
      return { session: null, error: null };
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (err) {
      return { session: null, error: err };
    }
  },

  /**
   * Listen to auth state transitions
   * @param {Function} callback
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured || !supabase) {
      // Return a no-op unsubscribe if unconfigured
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  /**
   * Update student profile metadata
   * @param {Object} updates
   */
  async updateProfile(updates) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error(
          'Supabase backend is unconfigured. Cannot persist profile updates without Supabase credentials.'
        ),
      };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },
};

export default authService;
