import React from 'react';
import { FileQuestion } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = FileQuestion,
  title = 'No notes found',
  description = 'Try adjusting your search keywords, course, or semester filters.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-100 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
