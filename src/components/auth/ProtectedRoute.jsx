import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { Lock, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import Button from '../common/Button';

export const ProtectedRoute = ({ children }) => {
  const { user, loading, enableDevPreview, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Verifying session..." className="min-h-[50vh]" />;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-card text-center">
          <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-brand-600 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Student Access Required
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Please sign in to access your student dashboard, view personal uploads, or upload study notes.
          </p>

          <div className="space-y-3">
            <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}`} className="block">
              <Button variant="primary" size="md" className="w-full" leftIcon={LogIn}>
                Sign In to Continue
              </Button>
            </Link>

            <Link to="/register" className="block">
              <Button variant="outline" size="md" className="w-full">
                Create New Student Account
              </Button>
            </Link>
          </div>

          {/* Dev preview prompt */}
          {!isConfigured && (
            <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50/70 -mx-8 -mb-8 p-6 rounded-b-2xl text-left">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-1">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Frontend Review Mode</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Since your Supabase backend is not yet connected in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">.env</code>, you can enable Dev UI Preview to inspect this page's layout and components immediately.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs font-medium"
                rightIcon={ArrowRight}
                onClick={enableDevPreview}
              >
                Enable Dev UI Preview
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
