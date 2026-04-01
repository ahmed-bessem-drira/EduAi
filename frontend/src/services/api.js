import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
if (import.meta.env.PROD) {
  API_URL = ''; // Route in relative for Vercel so the proxy kicks in
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 10MB.');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Invalid request.');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error('Network error. Please check your connection.');
  }
);

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/upload/pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const generateContent = async (text, language = 'fr') => {
  const response = await api.post('/api/ai/generate', {
    text,
    language,
  });

  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
