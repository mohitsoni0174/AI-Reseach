/**
 * API Status Component
 * Displays connection status to backend
 * Auto-tests health check on mount
 */

import { useEffect, useState } from 'react';
import { checkServerHealth } from '../services/api';

const APIStatus = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      const result = await checkServerHealth();
      if (result.success) {
        setStatus('connected');
        setError(null);
      } else {
        setStatus('disconnected');
        setError(result.error);
      }
    };

    testConnection();
    // Retest every 30 seconds
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'connected') {
    return (
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span className="text-xs font-medium text-green-400">Backend Connected</span>
      </div>
    );
  }

  if (status === 'disconnected') {
    return (
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
        <span className="text-xs font-medium text-red-400">Backend Offline</span>
        {error && (
          <div className="ml-2 text-xs text-red-300/70 max-w-xs">
            {error.type === 'NETWORK_ERROR' && '(Network unreachable)'}
            {error.type === 'TIMEOUT' && '(Timeout)'}
            {error.corsIssue && '(CORS issue)'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm">
      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-spin"></div>
      <span className="text-xs font-medium text-yellow-400">Testing Connection...</span>
    </div>
  );
};

export default APIStatus;
