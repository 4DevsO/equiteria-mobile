import axios from 'axios';
import secrets from './secrets.json';

const api = axios.create({
  baseURL: 'https://api.github.com',
  ...secrets,
});

export default api;
