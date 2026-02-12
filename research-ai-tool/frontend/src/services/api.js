/**
 * Axios API Service
 * Handles all backend communication for PDF upload and analysis
 */

import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for large PDF processing
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * Upload and analyze a PDF file
 * @param {File} file - PDF file to upload
 * @param {Function} onUploadProgress - Progress callback (receives percentage 0-100)
 * @returns {Promise<Object>} Analysis results
 */
export const uploadAndAnalyzePDF = async (file, onUploadProgress) => {
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
        
        // Call progress callback if provided
        if (onUploadProgress) {
          onUploadProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.detail || 'Upload failed');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Error in request setup
      throw new Error(error.message || 'Failed to upload file');
    }
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Server health status
 */
export const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    throw new Error('Server is not responding');
  }
};

export default apiClient;
