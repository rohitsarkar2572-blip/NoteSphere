import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Database,
  FileText,
  Shield,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { SAMPLE_COURSES, SAMPLE_SEMESTERS } from '../data/sampleNotes';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const ProfilePage = () => {
  const { user, updateProfile, isConfigured, isDevPreview } = useAuth();
  const { userNotes } = useNotes();

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    course: user?.user_metadata?.course || 'Computer Science',
    semester: user?.user_metadata?.semester || '4',
    bio: user?.user_metadata?.bio || 'Undergraduate student sharing lecture summaries and exam notes.',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    const res = await updateProfile({
      full_name: formData.fullName,
      course: formData.course,
      semester: formData.semester,
      bio: formData.bio,
    });

    setIsSaving(false);

    if (res.success) {
      setSuccessMessage('Profile information saved successfully!');
    } else {
      setErrorMessage(res.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal university credentials, enrolled course, and academic bio.
        </p>
      </div>

      {/* Backend Status Notice */}
      {!isConfigured && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold text-sm">Supabase Profile Persistence</p>
            <p>
              When your Supabase backend is configured, profile modifications update <code className="bg-amber-100 font-mono px-1 rounded">auth.users</code> metadata and your public profiles table.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Student Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              {formData.fullName?.charAt(0) || user?.email?.charAt(0) || 'S'}
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {formData.fullName || 'Student'}
            </h3>
            <p className="text-xs text-slate-500 mb-3 truncate">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
              <Badge variant="blue" size="sm">
                {formData.course}
              </Badge>
              <Badge variant="purple" size="sm">
                Semester {formData.semester}
              </Badge>
              {isDevPreview && (
                <Badge variant="sample" size="sm">
                  Dev Preview
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 mb-6">
              "{formData.bio}"
            </p>

            {/* Quick stats list */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
              <div className="bg-slate-50/70 p-2.5 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                  Uploads
                </span>
                <span className="text-base font-bold text-slate-800">
                  {userNotes.length} Notes
                </span>
              </div>

              <div className="bg-slate-50/70 p-2.5 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                  Account Type
                </span>
                <span className="text-base font-bold text-brand-600">
                  Student
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              Edit Student Details
            </h2>

            {successMessage && (
              <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                leftIcon={User}
                placeholder="Aarav Sharma"
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                disabled={true}
                helperText="Email is bound to your university auth credentials."
                leftIcon={Mail}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Course / Major
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {SAMPLE_COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {SAMPLE_SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Academic Bio / Interests
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell peers what you study or what notes you specialize in..."
                  className="w-full rounded-lg border border-slate-300 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={Save}
                  isLoading={isSaving}
                  className="font-semibold shadow-sm"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
