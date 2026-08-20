import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function FileUpload({ onFileUpload, isUploading, error }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSubmit(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      validateAndSubmit(files[0]);
    }
  };

  const validateAndSubmit = (file) => {
    setSelectedFile(file);
    onFileUpload(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Upload any document. <br className="hidden sm:inline" />
          <span className="text-indigo-600">Understand it instantly.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Extract raw content, generate structured summaries, find key takeaways, and get AI-powered improvement suggestions in seconds.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-white ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400 hover:shadow-md'
        } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base sm:text-lg font-semibold text-slate-800">
              Drag & drop your document here, or <span className="text-indigo-600 underline">browse</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Supports PDF, Scanned PDF, PNG, JPG, or JPEG (Max 15MB)
            </p>
          </div>

          {selectedFile && !error && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <File className="w-4 h-4 text-indigo-500" />
              {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Processing Failed</p>
            <p className="text-xs sm:text-sm text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Hybrid OCR & PDF</h4>
            <p className="text-xs text-slate-500 mt-1">Automatically falls back to Tesseract OCR when processing scanned files.</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Structured Insights</h4>
            <p className="text-xs text-slate-500 mt-1">Get main ideas, key takeaways, and suggestions in standardized formats.</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Secure & Ephemeral</h4>
            <p className="text-xs text-slate-500 mt-1">Files are analyzed in memory and never permanently stored on servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
