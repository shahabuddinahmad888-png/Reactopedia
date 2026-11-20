import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: baseURL || undefined, timeout: 15000 });

function ensureApiConfigured() {
  if (!baseURL) throw new Error('Backend API is not configured. Set VITE_API_BASE_URL in .env.');
}

export const getArticles = async () => {
  ensureApiConfigured();
  const response = await api.get('/articles');
  return response.data;
};

export const createArticle = async (articleData) => {
  ensureApiConfigured();
  const response = await api.post('/articles', articleData);
  return response.data;
};
