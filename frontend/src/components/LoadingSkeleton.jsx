import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-16 bg-slate-100 rounded-lg"></div>
          <div className="h-16 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
