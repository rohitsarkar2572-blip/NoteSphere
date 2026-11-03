import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileSearch, Sparkles, AlertCircle } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/notes/NoteCard';
import NoteFilter from '../components/notes/NoteFilter';
import { CardSkeleton } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    notes,
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
  } = useNotes();
  const { isConfigured } = useAuth();

  // Read URL search params on mount
  useEffect(() => {
    const qSearch = searchParams.get('search');
    const qCourse = searchParams.get('course');
    const qSubject = searchParams.get('subject');
    const qSemester = searchParams.get('semester');
    const qSort = searchParams.get('sort');

    if (qSearch !== null) setSearch(qSearch);
    if (qCourse !== null) setCourse(qCourse);
    if (qSubject !== null) setSubject(qSubject);
    if (qSemester !== null) setSemester(qSemester);
    if (qSort !== null) setSortBy(qSort);
  }, [searchParams]);

  // Sync state back to URL
  const handleResetFilters = () => {
    setSearch('');
    setCourse('All');
    setSubject('All');
    setSemester('All');
    setSortBy('latest');
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="blue">Repository</Badge>
              {!isConfigured && (
                <Badge variant="sample">Dev Preview (Sample Data Isolated)</Badge>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Study Notes
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Filter by engineering stream, semester, or search across peer-uploaded PDFs.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <NoteFilter
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        course={course}
        setCourse={(val) => {
          setCourse(val);
          setPage(1);
        }}
        subject={subject}
        setSubject={(val) => {
          setSubject(val);
          setPage(1);
        }}
        semester={semester}
        setSemester={(val) => {
          setSemester(val);
          setPage(1);
        }}
        sortBy={sortBy}
        setSortBy={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Error state */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="No notes match your filters"
          description="We couldn't find any uploaded notes matching your exact criteria. Try resetting your filters or search keywords."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Page <span className="font-semibold text-slate-800">{page}</span> of{' '}
                <span className="font-semibold text-slate-800">{totalPages}</span> ({totalCount} total notes)
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={ChevronLeft}
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          page === pageNum
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={ChevronRight}
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExplorePage;
