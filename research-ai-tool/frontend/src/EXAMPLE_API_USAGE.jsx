/**
 * Example: React Component with Full Error Handling
 * Shows how to use the API service with proper error diagnosis
 */

import { useEffect, useState } from 'react';
import { uploadAndAnalyzePDF, checkServerHealth } from '../services/api';

export const ExampleAPIUsage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test 1: Check health on mount
  useEffect(() => {
    const testHealth = async () => {
      setLoading(true);
      try {
        const result = await checkServerHealth();
        if (result.success) {
          console.log('✅ Backend connected:', result.data);
          setHealth(result.data);
          setError(null);
        } else {
          console.error('❌ Backend error:', result.error);
          setHealth(null);
          setError(result.error);
        }
      } catch (err) {
        console.error('❌ Health check failed:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    testHealth();
  }, []);

  // Test 2: Upload with full error handling
  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📄 Uploading:', file.name);
      
      const result = await uploadAndAnalyzePDF(file, (progress) => {
        console.log(`📊 Progress: ${progress}%`);
      });

      console.log('✅ Upload successful:', result);
      // Handle result...
      
    } catch (err) {
      console.error('❌ Upload failed:', err.message);
      setError({
        type: 'UPLOAD_ERROR',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Health Status */}
      <div className={`p-4 rounded-lg ${health ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
        {loading && <p className="text-yellow-400">🔄 Testing connection...</p>}
        {health && (
          <div className="text-green-400">
            <p>✅ Backend Status: {health.status}</p>
            <p className="text-sm text-green-300">{health.service} v{health.version}</p>
          </div>
        )}
        {error && (
          <div className="text-red-400">
            <p>❌ Connection failed</p>
            <p className="text-sm text-red-300">{error.message || error.type}</p>
          </div>
        )}
      </div>

      {/* Upload Example */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={loading}
        className="block"
      />
    </div>
  );
};
