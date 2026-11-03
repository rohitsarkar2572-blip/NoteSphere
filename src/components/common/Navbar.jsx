import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Upload,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  Menu,
  X,
  Compass,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';
import Badge from './Badge';

export const Navbar = () => {
  const { user, logout, isDevPreview, enableDevPreview, disableDevPreview } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? 'text-brand-600 bg-brand-50/80 font-semibold'
        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700 font-semibold'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  NoteSphere
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                  Student Exchange
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/explore" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-slate-400" />
                  Explore Notes
                </span>
              </NavLink>

              {user && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <span className="flex items-center gap-1.5">
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </span>
                  </NavLink>
                  <NavLink to="/my-uploads" className={navLinkClass}>
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      My Uploads
                    </span>
                  </NavLink>
                </>
              )}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/upload">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Upload}
                  className="shadow-sm font-semibold"
                >
                  Upload Notes
                </Button>
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-elevated border border-slate-100 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        {user.isDevPreview && (
                          <Badge variant="sample" size="sm" className="mt-1">
                            Dev Preview User
                          </Badge>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/my-uploads"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        My Uploads
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                  {/* Quick Dev Preview Mode Toggle Button for frontend inspection without backend */}
                  <button
                    onClick={isDevPreview ? disableDevPreview : enableDevPreview}
                    title="Toggle Development UI Preview for Protected Routes"
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-brand-600 hover:border-brand-200 bg-slate-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    <span>{isDevPreview ? 'Exit UI Preview' : 'Dev UI Preview'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Link to="/upload">
                <Button variant="primary" size="sm" className="px-2.5 py-1.5">
                  <Upload className="w-4 h-4" />
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <NavLink
              to="/"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="w-4 h-4 text-brand-500" />
              Home
            </NavLink>
            <NavLink
              to="/explore"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass className="w-4 h-4 text-brand-500" />
              Explore Notes
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-500" />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/my-uploads"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4 text-brand-500" />
                  My Uploads
                </NavLink>
                <NavLink
                  to="/profile"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 text-brand-500" />
                  Profile
                </NavLink>
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Button variant="outline" size="md" onClick={handleLogout} leftIcon={LogOut}>
                    Sign Out ({user.user_metadata?.full_name || user.email})
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Create Student Account
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    if (isDevPreview) disableDevPreview();
                    else enableDevPreview();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs text-center border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  {isDevPreview ? 'Disable Dev UI Preview' : 'Enable Dev UI Preview (View All Pages)'}
                </button>
              </div>
            )}
          </div>
        )}
      </header>
  );
};

export default Navbar;
