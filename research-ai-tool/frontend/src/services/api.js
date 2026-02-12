/**
 * Axios API Service with Advanced Error Handling
 * Handles all backend communication for PDF upload and analysis
 * Includes debugging, logging, and CORS diagnostics
 */

import axios from 'axios';

// Load API URL from environment or use local fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Log API configuration for debugging
console.log('🔌 API Service Initialized');
console.log('📍 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', import.meta.env.MODE);
console.log('📦 Vite API URL env var:', import.meta.env.VITE_API_URL);

// Create axios instance with production-ready config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout
  withCredentials: false, // Set to true if using authentication cookies
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor - Log all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 [${config.method.toUpperCase()}] ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Log responses and errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Parse and diagnose axios errors
 * @param {Error} error - Axios error object
 * @returns {Object} Detailed error information
 */
const diagnoseError = (error) => {
  const diagnosis = {
    type: 'UNKNOWN',
    message: 'Unknown error occurred',
    details: {},
    serverReachable: false,
    corsIssue: false,
    timeoutIssue: false,
  };

  if (error.response) {
    // Server responded with error status
    diagnosis.type = 'SERVER_ERROR';
    diagnosis.serverReachable = true;
    diagnosis.message = error.response.data?.detail || `Server error: ${error.response.status}`;
    diagnosis.details = {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    };

    // Check for CORS error (403, 405, etc)
    if (error.response.status === 403 || error.response.status === 405) {
      diagnosis.corsIssue = true;
      diagnosis.message = '🚫 CORS Error: Backend not allowing this origin';
    }

    console.error('📊 Server Error Details:', diagnosis.details);
  } else if (error.request) {
    // Request made but no response
    diagnosis.type = 'NETWORK_ERROR';
    diagnosis.message = 'No server response - Backend may be offline or unreachable';
    diagnosis.details = {
      url: error.request.responseURL || API_BASE_URL,
      method: error.config?.method,
      timeout: error.code === 'ECONNABORTED',
    };

    // Detect timeout
    if (error.code === 'ECONNABORTED') {
      diagnosis.timeoutIssue = true;
      diagnosis.message = 'Request timeout (60 seconds) - Server took too long to respond';
    }

    console.error('🌐 Network Error Details:', diagnosis.details);
  } else if (error.code === 'ERR_CANCELED') {
    diagnosis.type = 'CANCELLED';
    diagnosis.message = 'Request was cancelled';
  } else {
    // Error in request setup
    diagnosis.type = 'CLIENT_ERROR';
    diagnosis.message = error.message || 'Failed to make request';
    diagnosis.details = { error: error.toString() };

    console.error('⚙️ Client Error:', error);
  }

  console.group('🔍 Error Diagnosis');
  console.table(diagnosis);
  console.groupEnd();

  return diagnosis;
};

/**
 * Test endpoint to verify backend connectivity
 * @returns {Promise<Object>} Health check response
 */
export const checkServerHealth = async () => {
  try {
    console.log('🏥 Performing health check on', API_BASE_URL);
    const response = await apiClient.get('/', {
      timeout: 10000, // Shorter timeout for health check
    });

    console.log('✅ Health Check Passed:', response.data);
    console.table({
      'Status': response.data.status,
      'Service': response.data.service,
      'Version': response.data.version,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const diagnosis = diagnoseError(error);
    console.error('❌ Health Check Failed:', diagnosis);

    return {
      success: false,
      error: diagnosis,
    };
  }
};

/**
 * Upload and analyze a PDF file
 * @param {File} file - PDF file to upload
 * @param {Function} onUploadProgress - Progress callback (receives percentage 0-100)
 * @returns {Promise<Object>} Analysis results
 */
export const uploadAndAnalyzePDF = async (file, onUploadProgress) => {
  console.log(`📄 Starting upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

  // Create FormData to send file
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Make POST request with progress tracking
    const response = await apiClient.post('/analyze', formData, {
      onUploadProgress: (progressEvent) => {
        // Calculate upload percentage
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        console.log(`📊 Upload progress: ${percentCompleted}%`);

        // Call progress callback if provided
        if (onUploadProgress) {
          onUploadProgress(percentCompleted);
        }
      },
      timeout: 120000, // 2 minutes for large files
    });

    console.log('✅ Upload successful:', response.data);
    return response.data;
  } catch (error) {
    const diagnosis = diagnoseError(error);
    console.error('❌ Upload failed', diagnosis);

    // Create user-friendly error message
    let userMessage = diagnosis.message;

    if (diagnosis.corsIssue) {
      userMessage = '🚫 CORS Error: Backend needs to allow requests from this frontend URL';
    } else if (diagnosis.timeoutIssue) {
      userMessage = '⏱️ Request timeout: Backend took too long to respond. Try again.';
    } else if (diagnosis.type === 'NETWORK_ERROR') {
      userMessage = `🌐 Network Error: Cannot reach server at ${API_BASE_URL}`;
    }

    throw new Error(userMessage);
  }
};

/**
 * Exposed for browser console debugging
 * Usage: window.api.testFetch()
 */
export const testFetch = async () => {
  console.log('🧪 Testing fetch with axios...');
  console.log('API URL:', API_BASE_URL);
  
  try {
    const result = await checkServerHealth();
    if (result.success) {
      console.log('✅ Connection successful!');
      return result.data;
    } else {
      console.error('❌ Connection failed:', result.error);
      return null;
    }
  } catch (err) {
    console.error('❌ Test failed:', err);
    return null;
  }
};

// Expose API client for browser console debugging
if (typeof window !== 'undefined') {
  window.apiDebug = {
    testHealth: checkServerHealth,
    testFetch,
    baseUrl: API_BASE_URL,
    client: apiClient,
  };

  console.log('🛠️ Debug tools available as window.apiDebug');
  console.log('   - window.apiDebug.testHealth() - Test connection');
  console.log('   - window.apiDebug.testFetch() - Alias for testHealth');
  console.log('   - window.apiDebug.baseUrl - Current API URL');
}

export default apiClient;
