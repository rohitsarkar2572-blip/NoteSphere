import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Calendar, Eye, EyeOff, BookOpen, AlertCircle, Database, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_COURSES, SAMPLE_SEMESTERS } from '../data/sampleNotes';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    semester: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, isConfigured, enableDevPreview } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter a valid full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.course) {
      newErrors.course = 'Please select your university course / stream';
    }

    if (!formData.semester) {
      newErrors.semester = 'Please select your current semester';
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
        'Supabase backend is unconfigured. As per project guidelines, please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable actual user signups.'
      );
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      course: formData.course,
      semester: formData.semester,
    });

    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setSubmitError(result.error || 'Failed to create student account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
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
            Create Your Student Account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Join your peers and share semester study notes.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
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
              label="Full Name"
              id="fullName"
              name="fullName"
              placeholder="e.g. Aarav Sharma"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              leftIcon={User}
              required
            />

            <Input
              label="University Email"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 chars"
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-type password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                leftIcon={Lock}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Course selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Course / Program <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border text-sm py-2.5 pl-9 pr-3 ${
                      errors.course ? 'border-red-300 bg-red-50/20' : 'border-slate-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                  >
                    <option value="">Select your course...</option>
                    {SAMPLE_COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.course && (
                  <p className="mt-1 text-xs text-red-600">{errors.course}</p>
                )}
              </div>

              {/* Semester selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Current Semester <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border text-sm py-2.5 pl-9 pr-3 ${
                      errors.semester ? 'border-red-300 bg-red-50/20' : 'border-slate-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                  >
                    <option value="">Select semester...</option>
                    {SAMPLE_SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.semester && (
                  <p className="mt-1 text-xs text-red-600">{errors.semester}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4 font-semibold"
              isLoading={isSubmitting}
            >
              Complete Registration
            </Button>
          </form>

          {!isConfigured && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs font-semibold"
                leftIcon={Sparkles}
                onClick={() => {
                  enableDevPreview();
                  navigate('/dashboard');
                }}
              >
                Inspect Dashboard via Dev UI Preview
              </Button>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
