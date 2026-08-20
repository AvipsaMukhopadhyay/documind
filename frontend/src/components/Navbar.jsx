import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function Navbar({ onReset, hasDocument }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              DocuMind <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">AI</span>
            </span>
            <p className="text-xs text-slate-500 hidden sm:block">Intelligent Document Assistant</p>
          </div>
        </div>

        {hasDocument && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3.5 py-2 rounded-lg transition-colors border border-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
            Upload New File
          </button>
        )}
      </div>
    </header>
  );
}
