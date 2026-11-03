import { createClient } from '@supabase/supabase-js';

/**
 * NoteSphere Supabase Client Configuration
 * 
 * To connect your Supabase backend:
 * 1. Create a project at https://supabase.com
 * 2. Copy your Project URL and Anon/Public Key from Project Settings > API
 * 3. Create a .env file in the project root based on .env.example:
 *    VITE_SUPABASE_URL=https://your-project.supabase.co
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 * 4. Restart the Vite dev server.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// True only if valid non-empty environment variables have been provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project')
);

// Create and export the Supabase client instance if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper to get the supabase instance or return a descriptive error
 */
export const getSupabase = () => {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }
  return supabase;
};

export default supabase;
