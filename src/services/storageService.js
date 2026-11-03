import { supabase, isSupabaseConfigured } from './supabase';

const DEFAULT_BUCKET = 'notes';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const storageService = {
  async uploadNoteFile(file, userId, bucket = DEFAULT_BUCKET) {
    if (!isSupabaseConfigured || !supabase) {
      return { path: null, publicUrl: null, error: new Error('Supabase is not configured.') };
    }
    if (!userId) return { path: null, publicUrl: null, error: new Error('Please sign in before uploading.') };
    if (!file || file.type !== 'application/pdf') {
      return { path: null, publicUrl: null, error: new Error('Only PDF files are allowed.') };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { path: null, publicUrl: null, error: new Error('PDF must be 10 MB or smaller.') };
    }

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${userId}/${crypto.randomUUID()}_${safeName}`;
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf',
      });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return { path: data.path, publicUrl: urlData?.publicUrl || null, error: null };
    } catch (err) {
      return { path: null, publicUrl: null, error: err };
    }
  },

  getPublicUrl(path, bucket = DEFAULT_BUCKET) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  },

  async deleteNoteFile(path, bucket = DEFAULT_BUCKET) {
    if (!isSupabaseConfigured || !supabase) return { data: null, error: new Error('Supabase is not configured.') };
    try {
      const { data, error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },
};

export default storageService;
