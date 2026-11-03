import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  User,
  HardDrive,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import PdfPreviewModal from './PdfPreviewModal';

export const NoteCard = ({
  note,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = (e) => {
    e.stopPropagation();
    if (note.file_url) {
      window.open(note.file_url, '_blank', 'noopener,noreferrer');
    } else {
      alert('File URL not configured.');
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-300 p-5 shadow-card hover:shadow-elevated transition-all duration-200 flex flex-col justify-between">
        <div>
          {/* Card Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="blue" size="sm">
                {note.course}
              </Badge>
              <Badge variant="purple" size="sm">
                Sem {note.semester}
              </Badge>
            </div>

            {note.isSample && (
              <Badge variant="sample" size="sm" title="Preview sample isolated from backend">
                Preview Sample
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => setIsPreviewOpen(true)}
            className="text-base font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 cursor-pointer mb-2"
          >
            {note.title}
          </h3>

          {/* Subject tag */}
          <p className="text-xs font-medium text-brand-700 bg-brand-50/70 inline-block px-2 py-0.5 rounded-md mb-2.5">
            {note.subject}
          </p>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {note.description}
          </p>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-4 border-t border-slate-100 mt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1 truncate max-w-[130px]">
              <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{note.user_name || 'Student'}</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-slate-400" />
                {note.downloads_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                {note.file_size || 'PDF'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions ? (
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                leftIcon={Eye}
                onClick={() => setIsPreviewOpen(true)}
              >
                View
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                leftIcon={Edit2}
                onClick={() => onEdit && onEdit(note)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                leftIcon={Trash2}
                onClick={() => onDelete && onDelete(note.id)}
              >
                Delete
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                leftIcon={Eye}
                onClick={() => setIsPreviewOpen(true)}
              >
                Preview PDF
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                leftIcon={Download}
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        note={note}
      />
    </>
  );
};

export default NoteCard;
