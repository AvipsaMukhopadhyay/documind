import React, { useState } from 'react';
import { FileText, Eye, EyeOff, Copy, Check } from 'lucide-react';

export default function ExtractedTextViewer({ documentInfo }) {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(documentInfo.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
              {documentInfo.filename}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{documentInfo.file_type}</span>
              <span>•</span>
              <span>{documentInfo.pages} {documentInfo.pages === 1 ? 'Page' : 'Pages'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1 transition"
            title="Copy Text"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition"
            title={isVisible ? 'Hide Extracted Text' : 'Show Extracted Text'}
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isVisible && (
        <div className="p-4 flex-1 overflow-y-auto max-h-[600px] bg-slate-900/5">
          <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed select-text">
            {documentInfo.text}
          </pre>
        </div>
      )}
    </div>
  );
}
