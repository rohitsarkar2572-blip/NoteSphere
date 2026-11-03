import React from 'react';
import { Download, ExternalLink, FileText, User, Calendar, HardDrive, BookOpen } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const PdfPreviewModal = ({ isOpen, onClose, note }) => {
  if (!note) return null;

  const handleDownload = () => {
    if (note.file_url) {
      window.open(note.file_url, '_blank', 'noopener,noreferrer');
    } else {
      alert('File URL is not available for this note.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note.title}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Metadata Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue">{note.course}</Badge>
            <Badge variant="gray">{note.subject}</Badge>
            <Badge variant="purple">Sem {note.semester}</Badge>
            {note.isSample && (
              <Badge variant="sample">Dev Sample</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={ExternalLink}
              onClick={() => window.open(note.file_url, '_blank')}
            >
              Open Tab
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Download}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* Note Details */}
        <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
          <p className="line-clamp-3 leading-relaxed">{note.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Uploaded by <strong className="text-slate-600 ml-0.5">{note.user_name || 'Student'}</strong>
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              {note.file_size || 'PDF'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(note.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Embedded PDF Viewer Frame */}
        <div className="relative w-full h-[60vh] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
          {note.file_url ? (
            <iframe
              src={`${note.file_url}#toolbar=1&navpanes=0`}
              title={note.title}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="text-center p-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-medium text-slate-700">PDF Preview Not Available</p>
              <p className="text-xs text-slate-500 mt-1">This note does not have a valid file URL attached.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PdfPreviewModal;
