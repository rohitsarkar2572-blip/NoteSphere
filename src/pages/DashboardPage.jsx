import React from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  FileText,
  Download,
  Eye,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  PlusCircle,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import NoteCard from '../components/notes/NoteCard';

export const DashboardPage = () => {
  const { user, isConfigured, isDevPreview } = useAuth();
  const { userNotes, deleteNote } = useNotes();

  const studentName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const studentCourse = user?.user_metadata?.course || 'Computer Science';
  const studentSemester = user?.user_metadata?.semester || '4';

  // Compute aggregated stats
  const totalUploads = userNotes.length;
  const totalDownloads = userNotes.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);
  const totalViews = userNotes.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
  const impactRating = totalUploads > 0 ? '4.9 ★' : 'New';

  const recentUploads = userNotes.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Welcome Section */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-blue-800 rounded-3xl p-6 sm:p-10 text-white shadow-elevated relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                Student Dashboard
              </span>
              {isDevPreview && (
                <span className="px-3 py-1 rounded-full bg-amber-400/30 text-amber-200 text-xs font-semibold backdrop-blur-sm border border-amber-300/30">
                  Dev UI Preview Mode
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {studentName}! 👋
            </h1>
            <p className="text-brand-100 text-sm max-w-xl leading-relaxed">
              Enrolled in <strong className="text-white">{studentCourse}</strong> (Semester {studentSemester}). Keep uploading and helping your peers prepare for upcoming university exams.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/upload">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={Upload}
                className="bg-white text-brand-700 hover:bg-slate-100 font-bold shadow-md border-none"
              >
                Upload New Note
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Supabase backend status notification */}
      {!isConfigured && (
        <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-brand-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Backend Integration Architecture Ready</h4>
              <p className="text-xs text-slate-400">
                Supply your Supabase project URL and anon key in <code className="bg-slate-800 text-brand-300 px-1 py-0.5 rounded font-mono">.env</code> to bind real student records and storage.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
            Unconfigured (Preview Active)
          </span>
        </div>
      )}

      {/* 2. Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Uploads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              My Uploads
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {totalUploads}
          </div>
          <p className="text-xs text-slate-400">Active study materials</p>
        </div>

        {/* Card 2: Downloads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Downloads
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {totalDownloads}
          </div>
          <p className="text-xs text-slate-400">Peer student downloads</p>
        </div>

        {/* Card 3: Views */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Reads
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {totalViews}
          </div>
          <p className="text-xs text-slate-400">Previews across semesters</p>
        </div>

        {/* Card 4: Impact */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Impact Score
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {impactRating}
          </div>
          <p className="text-xs text-slate-400">Top 5% contributor</p>
        </div>
      </div>

      {/* 3. Recent Uploads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent uploads */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              Recent Personal Uploads
            </h2>
            <Link to="/my-uploads" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Manage All ({userNotes.length})
            </Link>
          </div>

          {recentUploads.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800">No notes uploaded yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Share your first semester lecture PDF or summary notes to start tracking downloads.
              </p>
              <Link to="/upload">
                <Button variant="primary" size="sm" leftIcon={Upload} className="mt-2">
                  Upload First Note
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentUploads.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  showActions={true}
                  onDelete={(id) => deleteNote(id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Study Navigation */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            Quick Study Navigation
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-4">
            <p className="text-xs text-slate-500">
              Need revision material for this week's lectures? Jump directly into your current syllabus:
            </p>

            <div className="space-y-2">
              <Link
                to={`/explore?course=${encodeURIComponent(studentCourse)}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 transition-colors text-xs font-semibold text-slate-700 border border-slate-100"
              >
                <span>My Stream: {studentCourse}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to={`/explore?semester=${studentSemester}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 transition-colors text-xs font-semibold text-slate-700 border border-slate-100"
              >
                <span>Current Semester {studentSemester} Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/explore?sort=popular"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 transition-colors text-xs font-semibold text-slate-700 border border-slate-100"
              >
                <span>Top Downloaded Cheat Sheets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link to="/upload" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={PlusCircle}>
                  Contribute New Material
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
