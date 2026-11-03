import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Upload,
  Search,
  Trash2,
  Edit,
  Eye,
  AlertTriangle,
  Download,
  Calendar,
  Sparkles,
  HardDrive
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_SUBJECTS, SAMPLE_SEMESTERS } from '../data/sampleNotes';
import NoteCard from '../components/notes/NoteCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

export const MyUploadsPage = () => {
  const { userNotes, deleteNote, updateNote } = useNotes();
  const { isConfigured, isDevPreview } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
  });

  // Filter personal uploads
  const filteredNotes = userNotes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.subject.toLowerCase().includes(q) ||
      n.course.toLowerCase().includes(q)
    );
  });

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setEditFormData({
      title: note.title,
      description: note.description,
      subject: note.subject,
      semester: String(note.semester),
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingNote) return;

    await updateNote(editingNote.id, editFormData);
    setEditingNote(null);
  };

  const handleConfirmDelete = async () => {
    if (deletingNoteId) {
      await deleteNote(deletingNoteId);
      setDeletingNoteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Uploaded Notes
            </h1>
            {isDevPreview && (
              <Badge variant="sample">Preview Records</Badge>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Manage, edit, review, or delete your shared study materials and PDFs.
          </p>
        </div>

        <Link to="/upload">
          <Button variant="primary" size="md" leftIcon={Upload} className="font-semibold shadow-sm">
            Upload New Note
          </Button>
        </Link>
      </div>

      {/* Search / Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within my uploads..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
          Total items: <strong className="text-slate-800">{userNotes.length}</strong>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={userNotes.length === 0 ? "You haven't uploaded any notes yet" : "No matching uploads found"}
          description={
            userNotes.length === 0
              ? "Share your first lecture summaries, formulas, or semester guide with your peers."
              : "Try adjusting your search keywords."
          }
          actionLabel={userNotes.length === 0 ? "Upload Your First Note" : "Clear Search"}
          onAction={() => {
            if (userNotes.length === 0) {
              window.location.href = '/upload';
            } else {
              setSearchQuery('');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              showActions={true}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeletingNoteId(id)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingNote && (
        <Modal
          isOpen={Boolean(editingNote)}
          onClose={() => setEditingNote(null)}
          title="Edit Note Details"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Note Title"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  list="edit-subjects-list"
                  value={editFormData.subject}
                  onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
                <datalist id="edit-subjects-list">
                  {SAMPLE_SUBJECTS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Semester
                </label>
                <select
                  value={editFormData.semester}
                  onChange={(e) => setEditFormData({ ...editFormData, semester: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                >
                  {SAMPLE_SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setEditingNote(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingNoteId && (
        <Modal
          isOpen={Boolean(deletingNoteId)}
          onClose={() => setDeletingNoteId(null)}
          title="Delete Study Note?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Are you sure you want to delete this study note? Fellow students will no longer be able to download or view it.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingNoteId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                leftIcon={Trash2}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyUploadsPage;
