import { useState, useCallback } from 'react';
import { generateContent } from '../services/api';

export const useGenerate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const generate = useCallback(async (text, language = 'fr') => {
    if (!text || text.trim().length < 100) {
      setError('Text content is too short. Please provide at least 100 characters.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      });

      const response = await generateContent(text.trim(), language);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (!response || !response.resume || !response.qcm || !response.questions_ouvertes) {
        throw new Error('Invalid response format from AI service');
      }

      setResult(response);
      
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);

      return response;
    } catch (err) {
      setIsLoading(false);
      setProgress(0);
      setError(err.message || 'Failed to generate content');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setProgress(0);
    setResult(null);
  }, []);

  return {
    generate,
    isLoading,
    error,
    progress,
    result,
    reset,
  };
};
