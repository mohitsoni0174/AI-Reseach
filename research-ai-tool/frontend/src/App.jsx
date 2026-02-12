/**
 * Main App Component
 * Premium SaaS Dashboard Layout
 */

import { useState } from 'react';
import Header from './components/Header';
import UploadCard from './components/UploadCard';
import Toast from './components/Toast';

function App() {
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle errors from child components
  const handleError = (message) => {
    setErrorMessage(message);
  };

  // Close toast notification
  const closeToast = () => {
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-sm font-medium text-cyan-400">Powered by OpenAI GPT-4</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Transform Earnings Calls into
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Actionable Insights
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Upload your earnings call transcript and let our AI extract key metrics, 
              sentiment analysis, and strategic insights in seconds.
            </p>
          </div>

          {/* Upload Section */}
          <UploadCard onError={handleError} />

          {/* Footer Info */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              Trusted by financial analysts worldwide • Enterprise-grade security • SOC 2 Compliant
            </p>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {errorMessage && (
        <Toast message={errorMessage} onClose={closeToast} />
      )}
    </div>
  );
}

export default App;
