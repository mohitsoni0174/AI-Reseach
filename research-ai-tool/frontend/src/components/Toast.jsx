/**
 * Toast Notification Component
 * Displays error messages with smooth animations
 */

import { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-top-5 duration-200">
      <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-4 pr-12 max-w-md shadow-2xl">
        <div className="flex items-start gap-3">
          {/* Error Icon */}
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Message */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-400 mb-1">Upload Failed</h4>
            <p className="text-sm text-red-200/80">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-red-300/60 hover:text-red-300 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
