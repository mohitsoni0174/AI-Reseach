/**
 * UploadCard Component
 * Premium glassmorphism card with drag-and-drop PDF upload
 * Features: Progress tracking, animations, loading states
 */

import { useState, useCallback } from 'react';
import { uploadAndAnalyzePDF } from '../services/api';

const UploadCard = ({ onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Handle drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Process file upload
  const processFile = async (file) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      onError('Please upload a PDF file');
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      onError('File size exceeds 50MB limit');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setIsSuccess(false);
      setAnalysisResult(null);

      // Upload with progress tracking
      const result = await uploadAndAnalyzePDF(file, (progress) => {
        setUploadProgress(progress);
      });

      // Success state
      setIsSuccess(true);
      setAnalysisResult(result);
      
      // Reset after 8 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setIsUploading(false);
        setUploadProgress(0);
      }, 8000);

    } catch (error) {
      onError(error.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }, []);

  // Handle file input
  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      {/* Main Upload Card */}
      <div
        className={`relative rounded-3xl backdrop-blur-xl bg-white/5 border transition-all duration-200 ${
          isDragging 
            ? 'border-cyan-400 shadow-2xl shadow-cyan-500/20 scale-[1.02]' 
            : 'border-white/10 hover:border-white/20'
        } ${isSuccess ? 'animate-success' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12">
          {/* Success State */}
          {isSuccess && analysisResult && (
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center animate-success">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Analysis Complete!</h3>
                <p className="text-gray-400">Your earnings call has been analyzed successfully</p>
              </div>

              {/* Analysis Results Preview */}
              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
                <h4 className="text-sm font-semibold text-cyan-400 mb-3">Analysis Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400">{analysisResult.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">File:</span>
                    <span className="text-white truncate ml-2">{analysisResult.filename}</span>
                  </div>
                </div>

                {/* Display actual analysis data */}
                {analysisResult.analysis && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <pre className="text-xs text-gray-300 overflow-auto max-h-64 p-4 rounded-lg bg-black/20">
                      {JSON.stringify(analysisResult.analysis, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload State */}
          {isUploading && !isSuccess && (
            <div className="text-center space-y-6">
              {/* Loading Spinner */}
              <div className="w-20 h-20 mx-auto">
                <div className="w-full h-full rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Analyzing Document...</h3>
                <p className="text-gray-400">Please wait while we process your earnings call</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 relative"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <p className="text-sm text-cyan-400 font-medium">{uploadProgress}% Complete</p>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Upload
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  AI Processing
                </div>
              </div>
            </div>
          )}

          {/* Default Upload State */}
          {!isUploading && !isSuccess && (
            <div className="text-center space-y-6">
              {/* Upload Icon with Glow */}
              <div className="relative w-20 h-20 mx-auto">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 ${isDragging ? 'animate-glow' : 'opacity-80'}`}></div>
                <div className="relative w-full h-full rounded-3xl bg-navy-800 flex items-center justify-center border-2 border-cyan-400/50">
                  <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {isDragging ? 'Drop your PDF here' : 'Upload Earnings Call Transcript'}
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Drag and drop your PDF file or click to browse. Our AI will extract key insights instantly.
                </p>
              </div>

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Choose PDF File
                </label>
              </div>

              {/* File Requirements */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  PDF Only
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Max 50MB
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure & Private
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      </div>

      {/* Additional Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '⚡', title: 'Instant Analysis', desc: 'AI-powered insights in seconds' },
          { icon: '🔒', title: 'Secure Processing', desc: 'Your data is encrypted end-to-end' },
          { icon: '📊', title: 'Detailed Reports', desc: 'Comprehensive earnings breakdowns' },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
            <div className="text-2xl mb-2">{item.icon}</div>
            <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadCard;
