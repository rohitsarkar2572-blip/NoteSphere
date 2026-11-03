import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Notes Service for NoteSphere
 * Communicates with the Supabase 'notes' table when connected.
 * 
 * Recommended Supabase Schema for 'notes':
 * - id: uuid (primary key, default gen_random_uuid())
 * - title: text
 * - description: text
 * - course: text
 * - subject: text
 * - semester: text or integer
 * - file_url: text (URL to PDF in storage)
 * - file_path: text (storage path)
 * - file_name: text
 * - file_size: text or bigint
 * - user_id: uuid (foreign key references auth.users.id)
 * - user_name: text
 * - downloads_count: integer (default 0)
 * - views_count: integer (default 0)
 * - created_at: timestamp with time zone (default now())
 * - updated_at: timestamp with time zone (default now())
 */

export const notesService = {
  /**
   * Fetch notes with optional filtering, search, sorting and pagination
   */
  async getNotes({
    search = '',
    course = '',
    subject = '',
    semester = '',
    sortBy = 'latest',
    page = 1,
    limit = 9,
  } = {}) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: [],
        count: 0,
        page,
        totalPages: 0,
        isConfigured: false,
        error: null,
      };
    }

    try {
      let query = supabase.from('notes').select('*', { count: 'exact' });

      // Apply search across title, description, subject
      if (search.trim()) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%,subject.ilike.%${search}%`
        );
      }

      // Course filter
      if (course && course !== 'All') {
        query = query.eq('course', course);
      }

      // Subject filter
      if (subject && subject !== 'All') {
        query = query.eq('subject', subject);
      }

      // Semester filter
      if (semester && semester !== 'All') {
        query = query.eq('semester', semester);
      }

      // Sorting
      if (sortBy === 'latest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'popular') {
        query = query.order('downloads_count', { ascending: false });
      } else if (sortBy === 'title') {
        query = query.order('title', { ascending: true });
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
        isConfigured: true,
        error: null,
      };
    } catch (err) {
      return {
        data: [],
        count: 0,
        page,
        totalPages: 0,
        isConfigured: true,
        error: err,
      };
    }
  },

  /**
   * Fetch a single note by ID
   */
  async getNoteById(id) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error('Supabase is not configured.'),
      };
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Create / insert a new note record
   */
  async createNote(noteData) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error(
          'Supabase backend is unconfigured. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to create notes in your database.'
        ),
      };
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Update an existing note record
   */
  async updateNote(id, updates) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error('Supabase is not configured.'),
      };
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Delete a note record
   */
  async deleteNote(id) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error('Supabase is not configured.'),
      };
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Fetch all notes uploaded by a specific user
   */
  async getUserNotes(userId) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: [], error: null, isConfigured: false };
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null, isConfigured: true };
    } catch (err) {
      return { data: [], error: err, isConfigured: true };
    }
  },
};

export default notesService;
