import React, { useState } from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { SAMPLE_COURSES, SAMPLE_SUBJECTS, SAMPLE_SEMESTERS } from '../../data/sampleNotes';
import Button from '../common/Button';

export const NoteFilter = ({
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
  onReset,
  totalResults = 0,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters =
    search.trim() !== '' ||
    course !== 'All' ||
    subject !== 'All' ||
    semester !== 'All' ||
    sortBy !== 'latest';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-card mb-8">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title, topic, subject, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            className="sm:hidden flex-1 justify-center"
            leftIcon={SlidersHorizontal}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            Filters {hasActiveFilters && '•'}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="md"
              leftIcon={RotateCcw}
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-red-600"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Filter Selects Grid */}
      <div
        className={`mt-4 pt-4 border-t border-slate-100 ${
          showMobileFilters ? 'block' : 'hidden'
        } sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3`}
      >
        {/* Course Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Course
          </label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="All">All Courses</option>
            {SAMPLE_COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="All">All Subjects</option>
            {SAMPLE_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Semester
          </label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="All">All Semesters</option>
            {SAMPLE_SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="latest">Latest Uploads</option>
            <option value="popular">Most Downloaded</option>
            <option value="title">Alphabetical (A - Z)</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Showing {totalResults} available notes</span>
        {hasActiveFilters && (
          <span className="text-brand-600 font-medium hidden sm:inline">
            Filters applied
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteFilter;
