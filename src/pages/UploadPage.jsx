import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, AlertCircle, CheckCircle2, FileText, ArrowRight, Eye, Database } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_COURSES, SAMPLE_SUBJECTS, SAMPLE_SEMESTERS } from '../data/sampleNotes';
import NoteUploadZone from '../components/notes/NoteUploadZone';
import PdfPreviewModal from '../components/notes/PdfPreviewModal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const UploadPage = () => {
  const { uploadNote, isConfigured } = useNotes();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: user?.user_metadata?.course || '',
    subject: '',
    semester: user?.user_metadata?.semester || '',
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [successNote, setSuccessNote] = useState(null);
  const [previewingLocalNote, setPreviewingLocalNote] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!file) {
      setFileError('Please select or drop a PDF note file');
      newErrors.file = true;
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a brief description of the notes';
    }

    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.semester) {
      newErrors.semester = 'Please select a semester';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  const handlePreviewLocalFile = (selectedFile) => {
    if (!selectedFile) return;
    const fileUrl = URL.createObjectURL(selectedFile);
    setPreviewingLocalNote({
      title: formData.title || selectedFile.name,
      description: formData.description || 'Local PDF selected for upload.',
      course: formData.course || 'Selected Course',
      subject: formData.subject || 'Selected Subject',
      semester: formData.semester || '1',
      file_url: fileUrl,
      file_name: selectedFile.name,
      file_size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      user_name: user?.user_metadata?.full_name || 'You',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!isConfigured) {
      setSubmitError(
        'Supabase backend is unconfigured. As per development guidelines, fake uploads are disabled. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable actual storage uploads.'
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    // Simulate progressive upload feedback while executing real upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 20 : prev));
    }, 200);

    const result = await uploadNote(formData, file);
    clearInterval(progressInterval);
    setUploadProgress(100);
    setIsUploading(false);

    if (result.success) {
      setSuccessNote(result.data);
    } else {
      setSubmitError(result.error || 'Failed to upload notes to Supabase.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Study Notes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Share your high-quality handwritten notes, formulas, or summaries in PDF format.
        </p>
      </div>

      {/* Backend connection warning */}
      {!isConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold text-sm">Supabase Storage & Database Unconfigured</p>
            <p>
              The frontend upload form, PDF file validation, drag-and-drop mechanics, and progress bar are fully interactive. Actual backend uploads require your Supabase bucket (<code className="bg-amber-100 font-mono px-1 rounded">notes</code>) and credentials in <code className="bg-amber-100 font-mono px-1 rounded">.env</code>.
            </p>
          </div>
        </div>
      )}

      {/* Success View */}
      {successNote ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Notes Uploaded Successfully!</h2>
          <p className="text-sm text-slate-600">
            "{successNote.title}" is now available in the student directory.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSuccessNote(null);
                setFile(null);
                setFormData({
                  title: '',
                  description: '',
                  course: user?.user_metadata?.course || '',
                  subject: '',
                  semester: user?.user_metadata?.semester || '',
                });
              }}
            >
              Upload Another
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={ArrowRight}
              onClick={() => navigate('/my-uploads')}
            >
              View in My Uploads
            </Button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Drag and drop file zone */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                PDF Document <span className="text-red-500">*</span>
              </label>
              <NoteUploadZone
                file={file}
                setFile={setFile}
                error={fileError}
                setError={setFileError}
                uploadProgress={uploadProgress}
                isUploading={isUploading}
                onPreviewLocalFile={handlePreviewLocalFile}
              />
            </div>

            {/* 2. Note metadata */}
            <div className="grid grid-cols-1 gap-5">
              <Input
                label="Note Title"
                id="title"
                name="title"
                placeholder="e.g. Complete DSA Handwritten Notes (Graphs & Trees)"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                helperText="Clear and descriptive titles help fellow students find your notes faster."
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description & Topics Covered <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Summarize the core topics, formulas, syllabus coverage, or professor references..."
                  className={`w-full rounded-lg border text-sm p-3 ${
                    errors.description ? 'border-red-300 bg-red-50/20' : 'border-slate-300 bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.description}</p>
                )}
              </div>

              {/* Course, Subject, Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className={`w-full rounded-lg border text-sm py-2.5 px-3 ${
                      errors.course ? 'border-red-300 bg-red-50/20' : 'border-slate-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                  >
                    <option value="">Select Course...</option>
                    {SAMPLE_COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.course && (
                    <p className="mt-1 text-xs text-red-600">{errors.course}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    list="sample-subjects-list"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Operating Systems"
                    className={`w-full rounded-lg border text-sm py-2 px-3 ${
                      errors.subject ? 'border-red-300 bg-red-50/20' : 'border-slate-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                  />
                  <datalist id="sample-subjects-list">
                    {SAMPLE_SUBJECTS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
                  )}
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={`w-full rounded-lg border text-sm py-2.5 px-3 ${
                      errors.semester ? 'border-red-300 bg-red-50/20' : 'border-slate-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                  >
                    <option value="">Select Semester...</option>
                    {SAMPLE_SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="mt-1 text-xs text-red-600">{errors.semester}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(-1)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isUploading}
                leftIcon={Upload}
                className="font-semibold shadow-sm"
              >
                Publish Note
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Local PDF Preview Modal */}
      {previewingLocalNote && (
        <PdfPreviewModal
          isOpen={Boolean(previewingLocalNote)}
          onClose={() => setPreviewingLocalNote(null)}
          note={previewingLocalNote}
        />
      )}
    </div>
  );
};

export default UploadPage;
