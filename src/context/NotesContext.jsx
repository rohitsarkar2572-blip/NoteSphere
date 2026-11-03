import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notesService } from '../services/notesService';
import { storageService } from '../services/storageService';
import { isSupabaseConfigured } from '../services/supabase';
import { SAMPLE_NOTES } from '../data/sampleNotes';
import { useAuth } from './AuthContext';

const NotesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('All');
  const [subject, setSubject] = useState('All');
  const [semester, setSemester] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6;

  // Fetch Public Notes
  const fetchNotes = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError(null);

    const currentSearch = overrides.search !== undefined ? overrides.search : search;
    const currentCourse = overrides.course !== undefined ? overrides.course : course;
    const currentSubject = overrides.subject !== undefined ? overrides.subject : subject;
    const currentSemester = overrides.semester !== undefined ? overrides.semester : semester;
    const currentSort = overrides.sortBy !== undefined ? overrides.sortBy : sortBy;
    const currentPage = overrides.page !== undefined ? overrides.page : page;

    if (isSupabaseConfigured) {
      // Fetch strictly from real Supabase backend
      try {
        const result = await notesService.getNotes({
          search: currentSearch,
          course: currentCourse,
          subject: currentSubject,
          semester: currentSemester,
          sortBy: currentSort,
          page: currentPage,
          limit,
        });

        if (result.error) {
          setError(result.error.message || 'Failed to fetch notes from Supabase');
          setNotes([]);
          setTotalCount(0);
          setTotalPages(1);
        } else {
          setNotes(result.data);
          setTotalCount(result.count);
          setTotalPages(result.totalPages || 1);
        }
      } catch (err) {
        setError(err.message);
        setNotes([]);
      }
    } else {
      // PREVIEW ONLY: Client-side filtering on clearly isolated sample data
      let filtered = [...SAMPLE_NOTES];

      if (currentSearch.trim()) {
        const query = currentSearch.toLowerCase();
        filtered = filtered.filter(
          (n) =>
            n.title.toLowerCase().includes(query) ||
            n.description.toLowerCase().includes(query) ||
            n.subject.toLowerCase().includes(query) ||
            n.course.toLowerCase().includes(query)
        );
      }

      if (currentCourse && currentCourse !== 'All') {
        filtered = filtered.filter((n) => n.course === currentCourse);
      }

      if (currentSubject && currentSubject !== 'All') {
        filtered = filtered.filter((n) => n.subject === currentSubject);
      }

      if (currentSemester && currentSemester !== 'All') {
        filtered = filtered.filter((n) => String(n.semester) === String(currentSemester));
      }

      // Sorting
      if (currentSort === 'latest') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (currentSort === 'oldest') {
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } else if (currentSort === 'popular') {
        filtered.sort((a, b) => b.downloads_count - a.downloads_count);
      } else if (currentSort === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      const total = filtered.length;
      const calculatedPages = Math.max(1, Math.ceil(total / limit));
      const startIndex = (currentPage - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      setNotes(paginatedData);
      setTotalCount(total);
      setTotalPages(calculatedPages);
    }

    setLoading(false);
  }, [search, course, subject, semester, sortBy, page]);

  // Initial and reactive fetch
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Fetch Current User Notes
  const fetchUserNotes = useCallback(async () => {
    if (!user) {
      setUserNotes([]);
      return;
    }

    if (isSupabaseConfigured) {
      const { data, error: userNotesError } = await notesService.getUserNotes(user.id);
      if (userNotesError) {
        setError(userNotesError.message);
        setUserNotes([]);
      } else {
        setUserNotes(data || []);
      }
    } else {
      // In dev preview mode: show a subset of sample notes isolated for preview demonstration
      const devSamples = SAMPLE_NOTES.filter(n => n.user_id === 'sample-user-1').map(n => ({
        ...n,
        isSample: true,
        canEdit: true,
      }));
      setUserNotes(devSamples);
    }
  }, [user]);

  useEffect(() => {
    fetchUserNotes();
  }, [fetchUserNotes]);

  // Upload Note
  const uploadNote = async (formData, file) => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase backend is unconfigured. Please connect Supabase in .env with your project credentials to upload actual notes.',
      };
    }

    if (!user) {
      return {
        success: false,
        error: 'You must be signed in to upload notes.',
      };
    }

    try {
      // Step 1: Upload file to storage
      const uploadRes = await storageService.uploadNoteFile(file, user.id);
      if (uploadRes.error) {
        return { success: false, error: uploadRes.error.message };
      }

      // Step 2: Insert record into database
      const noteRecord = {
        title: formData.title,
        description: formData.description,
        course: formData.course,
        subject: formData.subject,
        semester: formData.semester,
        file_url: uploadRes.publicUrl,
        file_path: uploadRes.path,
        file_name: file.name,
        file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email || 'Anonymous Student',
        downloads_count: 0,
        views_count: 0,
      };

      const { data, error: insertError } = await notesService.createNote(noteRecord);
      if (insertError) {
        await storageService.deleteNoteFile(uploadRes.path);
        return { success: false, error: insertError.message };
      }

      // Refresh notes list
      await fetchNotes();
      await fetchUserNotes();

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    if (!isSupabaseConfigured) {
      // In dev preview: remove from state for UI demonstration
      setUserNotes(prev => prev.filter(n => n.id !== id));
      setNotes(prev => prev.filter(n => n.id !== id));
      return { success: true, devNotice: 'Removed from local preview state.' };
    }

    try {
      const { data: note, error: fetchError } = await notesService.getNoteById(id);
      if (fetchError) return { success: false, error: fetchError.message };
      if (!note || note.user_id !== user?.id) {
        return { success: false, error: 'You can only delete your own notes.' };
      }
      if (note.file_path) {
        const { error: storageError } = await storageService.deleteNoteFile(note.file_path);
        if (storageError) return { success: false, error: storageError.message };
      }
      const { error: delError } = await notesService.deleteNote(id);
      if (delError) return { success: false, error: delError.message };
      await fetchNotes();
      await fetchUserNotes();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update Note
  const updateNote = async (id, updates) => {
    if (!isSupabaseConfigured) {
      // In dev preview: update in memory
      setUserNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
      setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
      return { success: true, devNotice: 'Updated in local preview state.' };
    }

    try {
      const { data, error: upError } = await notesService.updateNote(id, updates);
      if (upError) return { success: false, error: upError.message };
      await fetchNotes();
      await fetchUserNotes();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    notes,
    userNotes,
    loading,
    error,
    search,
    setSearch,
    course,
    setCourse,
    subject,
    setSubject,
    semester,
    setSemester,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    totalCount,
    fetchNotes,
    fetchUserNotes,
    uploadNote,
    deleteNote,
    updateNote,
    isConfigured: isSupabaseConfigured,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
