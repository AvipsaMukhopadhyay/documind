import React from 'react';
import { Sparkles, Sliders } from 'lucide-react';

export default function SummaryControls({ summaryLength, onLengthChange, onGenerate, isGenerating }) {
  const options = [
    { id: 'short', label: 'Short', desc: '3-5 points / 1 concise para' },
    { id: 'medium', label: 'Medium', desc: '1-3 detailed paragraphs' },
    { id: 'long', label: 'Long', desc: 'Comprehensive, deep breakdown' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold text-sm">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Summary Preferences</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onLengthChange(opt.id)}
            className={`flex flex-col p-3 rounded-lg text-left transition-all border ${
              summaryLength === opt.id
                ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className={`text-xs font-bold ${summaryLength === opt.id ? 'text-indigo-900' : 'text-slate-700'}`}>
              {opt.label}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 leading-tight">{opt.desc}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm ${
          isGenerating ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        <Sparkles className="w-4 h-4" />
        {isGenerating ? 'Analyzing & Summarizing...' : 'Generate Analysis'}
      </button>
    </div>
  );
}
