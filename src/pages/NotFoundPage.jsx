import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, Compass } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto border border-brand-100 shadow-sm">
          <BookOpen className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The study notes or page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" size="md" leftIcon={Compass}>
              Explore Notes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
