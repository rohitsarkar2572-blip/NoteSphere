import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Share2, ShieldCheck, Database, GraduationCap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                NoteSphere
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              The collaborative study resource platform built for university students to exchange high-scoring lecture notes, cheat sheets, and exam prep guides.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" className="hover:text-brand-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-brand-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/explore" className="hover:text-brand-600 transition-colors">
                  All Study Notes
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-brand-600 transition-colors">
                  Upload Notes
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-600 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/explore?sort=popular" className="hover:text-brand-600 transition-colors">
                  Most Downloaded
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Popular Courses
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/explore?course=Computer+Science" className="hover:text-brand-600 transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link to="/explore?course=Mechanical+Engineering" className="hover:text-brand-600 transition-colors">
                  Mechanical Engineering
                </Link>
              </li>
              <li>
                <Link to="/explore?course=Electrical+Engineering" className="hover:text-brand-600 transition-colors">
                  Electrical Engineering
                </Link>
              </li>
              <li>
                <Link to="/explore?course=Business+Administration" className="hover:text-brand-600 transition-colors">
                  Business Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Backend readiness */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Integration Architecture
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Database className="w-3.5 h-3.5 text-brand-600" />
                <span>Supabase Ready</span>
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Frontend services are decoupled and structured for your self-configured Supabase project with zero mock leaks.
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                Clean contract & interfaces
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NoteSphere. Built for academic excellence.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Student Network
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
              Peer-to-Peer Learning
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
