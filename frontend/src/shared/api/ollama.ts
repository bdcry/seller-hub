import axios from 'axios';

export const ollamaApi = axios.create({
  baseURL: 'http://127.0.0.1:11434/api',
});
