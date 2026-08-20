import React from 'react';
import { AlignLeft, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';

export default function SummaryResults({ results }) {
  if (!results) return null;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-600 mb-3 font-semibold text-sm">
          <AlignLeft className="w-4 h-4" />
          <h3 className="text-slate-900">Executive Summary</h3>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
          {results.summary}
        </p>
      </div>

      {/* Main Ideas */}
      {results.main_ideas && results.main_ideas.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-indigo-600 mb-3 font-semibold text-sm">
            <Lightbulb className="w-4 h-4" />
            <h3 className="text-slate-900">Main Themes & Ideas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.main_ideas.map((idea, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 font-medium text-xs border border-indigo-100"
              >
                {idea}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key Points */}
      {results.key_points && results.key_points.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-indigo-600 mb-3 font-semibold text-sm">
            <CheckCircle className="w-4 h-4" />
            <h3 className="text-slate-900">Key Takeaways</h3>
          </div>
          <ul className="space-y-2">
            {results.key_points.map((point, index) => (
              <li key={index} className="flex items-start text-xs sm:text-sm text-slate-700 space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Suggestions */}
      {results.improvement_suggestions && results.improvement_suggestions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-600 mb-3 font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-slate-900">Improvement Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {results.improvement_suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/60 text-amber-950 text-xs sm:text-sm"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
