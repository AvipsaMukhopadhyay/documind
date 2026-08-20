import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import ExtractedTextViewer from './components/ExtractedTextViewer';
import SummaryControls from './components/SummaryControls';
import SummaryResults from './components/SummaryResults';
import LoadingSkeleton from './components/LoadingSkeleton';
import { uploadDocument, summarizeText } from './services/api';

export default function App() {
  const [documentInfo, setDocumentInfo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setErrorMessage('');
    setAnalysisResults(null);

    try {
      const data = await uploadDocument(file);
      setDocumentInfo(data);
      handleGenerateSummary(data.text, summaryLength);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateSummary = async (textToSummarize = null, length = summaryLength) => {
    const text = textToSummarize || documentInfo?.text;
    if (!text) return;

    setIsSummarizing(true);
    setErrorMessage('');

    try {
      const results = await summarizeText(text, length);
      setAnalysisResults(results);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleReset = () => {
    setDocumentInfo(null);
    setAnalysisResults(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onReset={handleReset} hasDocument={Boolean(documentInfo)} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!documentInfo ? (
          <FileUpload
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            error={errorMessage}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Document Viewer */}
            <div className="lg:col-span-5 h-full">
              <ExtractedTextViewer documentInfo={documentInfo} />
            </div>

            {/* Right Column: Controls & AI Analysis */}
            <div className="lg:col-span-7 space-y-6">
              <SummaryControls
                summaryLength={summaryLength}
                onLengthChange={(len) => {
                  setSummaryLength(len);
                  handleGenerateSummary(documentInfo.text, len);
                }}
                onGenerate={() => handleGenerateSummary(documentInfo.text, summaryLength)}
                isGenerating={isSummarizing}
              />

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                  {errorMessage}
                </div>
              )}

              {isSummarizing ? (
                <LoadingSkeleton />
              ) : (
                <SummaryResults results={analysisResults} />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500">
        DocuMind AI &copy; {new Date().getFullYear()} — Built with FastAPI & React
      </footer>
    </div>
  );
}
