import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ArrowRight,
  Upload,
  Download,
  CheckCircle,
  FileText,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  Database
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_SUBJECTS } from '../data/sampleNotes';
import NoteCard from '../components/notes/NoteCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const HomePage = () => {
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();
  const { notes, setSearch } = useNotes();
  const { isConfigured } = useAuth();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearch(heroSearch);
      navigate(`/explore?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleSubjectClick = (subj) => {
    navigate(`/explore?subject=${encodeURIComponent(subj)}`);
  };

  // 3 most recent notes
  const recentNotes = notes.slice(0, 3);

  return (
    <div className="space-y-20 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 shadow-sm text-xs font-semibold text-brand-700 animate-in fade-in slide-in-from-top-3 duration-300">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Free Academic Resource Sharing for University Students</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Master Your Courses with Peer-Verified{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                Study Notes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              NoteSphere is the central exchange where ambitious students share lecture summaries, exam cheatsheets, and lab manuals organized by course and semester.
            </p>

            {/* Search Bar in Hero */}
            <form
              onSubmit={handleHeroSearch}
              className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl shadow-elevated border border-slate-200"
            >
              <div className="relative w-full flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search by topic, e.g. Data Structures, Thermodynamics, OS..."
                  className="w-full pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-6 py-3 font-semibold shadow-md"
              >
                Find Notes
              </Button>
            </form>

            {/* Quick Metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-500 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span><strong className="text-slate-900">5,000+</strong> Curated PDF Notes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" />
                <span><strong className="text-slate-900">12,000+</strong> Active Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                <span><strong className="text-slate-900">100%</strong> Free & Community-Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Subjects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Disciplines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Popular Study Subjects
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse the most requested lecture notes and exam preparations.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>Explore all subjects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {SAMPLE_SUBJECTS.map((subj) => (
            <button
              key={subj}
              onClick={() => handleSubjectClick(subj)}
              className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-400 hover:bg-brand-50/40 hover:shadow-soft transition-all duration-150 group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-brand-700 transition-colors line-clamp-2">
                {subj}
              </h4>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Recently Uploaded Notes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Fresh Arrivals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Recently Uploaded Notes
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hand-written lecture summaries and reference PDFs shared this week.
            </p>
          </div>
          <Link to="/explore">
            <Button variant="outline" size="sm" rightIcon={ArrowRight}>
              View All Notes
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              How NoteSphere Works
            </h2>
            <p className="text-sm text-slate-600">
              Simple 3-step workflow designed to save time and elevate your academic grades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-600 text-white font-bold rounded-2xl flex items-center justify-center mx-auto text-lg shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Create Free Profile</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sign up with your university email, pick your engineering or degree course, and set your current semester.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-600 text-white font-bold rounded-2xl flex items-center justify-center mx-auto text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload or Search Notes</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Drag-and-drop your handwritten PDF notes or find existing semester materials using precise subject filters.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-600 text-white font-bold rounded-2xl flex items-center justify-center mx-auto text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Excel in Your Exams</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Preview documents online or download high-resolution PDFs directly to your tablet or laptop for offline revision.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-12 bg-gradient-to-r from-brand-700 to-brand-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-elevated">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold">Have great notes to share?</h3>
              <p className="text-brand-100 text-sm max-w-lg">
                Help junior students, build your academic profile, and contribute to the university community.
              </p>
            </div>
            <Link to="/upload" className="shrink-0">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-brand-800 hover:bg-slate-100 border-none font-bold"
                leftIcon={Upload}
              >
                Upload Your Notes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
