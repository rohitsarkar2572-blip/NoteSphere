import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading...', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} text-brand-600 animate-spin mb-3`} />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-soft animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-full bg-slate-100 rounded mb-1" />
        <div className="h-4 w-2/3 bg-slate-100 rounded mb-4" />
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>
        <div className="h-8 w-20 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
};

export default Loader;
