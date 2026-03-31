import { useState, useCallback } from 'react';
import { uploadPDF } from '../services/api';

export const useUploadPDF = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file) => {
    if (!file) {
      setError('Please select a file');
      return null;
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      });

      const result = await uploadPDF(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);

      return result;
    } catch (err) {
      setIsLoading(false);
      setProgress(0);
      setError(err.message || 'Failed to upload PDF');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setProgress(0);
  }, []);

  return {
    uploadFile,
    isLoading,
    error,
    progress,
    reset,
  };
};
