import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, BookOpen, AlertCircle, ArrowRight, Sparkles, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { login, isConfigured, enableDevPreview } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    if (!isConfigured) {
      setIsSubmitting(false);
      setSubmitError(
        'Supabase backend is unconfigured. As per project instructions, please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable actual authentication.'
      );
      return;
    }

    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(redirectPath);
    } else {
      setSubmitError(result.error || 'Invalid credentials or sign-in failed.');
    }
  };

  const handleDevPreviewLogin = () => {
    enableDevPreview();
    navigate(redirectPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Branding header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              NoteSphere
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, Student
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to access your course materials and dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
          {/* Unconfigured Alert notice */}
          {!isConfigured && (
            <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Database className="w-4 h-4 text-amber-700" />
                <span>Supabase Backend Not Yet Connected</span>
              </div>
              <p>
                Credentials in <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">.env</code> are unconfigured. To test frontend UI pages immediately, you can use the Dev UI Preview mode below.
              </p>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="student@university.edu"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={Mail}
              required
            />

            <div>
              <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={Lock}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
              <div className="flex justify-end mt-1.5">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset emails will be sent via your configured Supabase Auth SMTP service.');
                  }}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-semibold"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          {/* Dev preview bypass for testing */}
          {!isConfigured && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 mb-2">
                Need to review protected frontend screens without credentials?
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs font-semibold"
                leftIcon={Sparkles}
                onClick={handleDevPreviewLogin}
              >
                Inspect Dashboard via Dev UI Preview
              </Button>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
