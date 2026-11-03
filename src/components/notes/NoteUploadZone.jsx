import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Eye } from 'lucide-react';
import Button from '../common/Button';

export const NoteUploadZone = ({
  file,
  setFile,
  error,
  setError,
  uploadProgress = 0,
  isUploading = false,
  onPreviewLocalFile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_MB = 25;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const validateAndSelectFile = (selectedFile) => {
    setError('');

    if (!selectedFile) return;

    // Check type: must be PDF
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file format. Please upload a valid PDF document (.pdf).');
      return;
    }

    // Check size limit: <= 25MB
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please select a smaller PDF.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-brand-400 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-4 text-brand-600 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base font-semibold text-slate-800 mb-1">
            Drag and drop your PDF notes here
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            or <span className="text-brand-600 font-semibold underline">browse files</span> from your computer
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="bg-slate-200/80 px-2 py-0.5 rounded font-medium text-slate-600">PDF Only</span>
            <span>•</span>
            <span>Maximum size {MAX_FILE_SIZE_MB}MB</span>
            <span>•</span>
            <span>High-resolution scan recommended</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-semibold text-slate-900 truncate">
                    {file.name}
                  </h5>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatBytes(file.size)} • PDF Ready
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onPreviewLocalFile && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  leftIcon={Eye}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewLocalFile(file);
                  }}
                >
                  Preview
                </Button>
              )}
              {!isUploading && (
                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar UI */}
          {isUploading && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Uploading to Supabase Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default NoteUploadZone;
