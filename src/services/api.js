import axios from 'axios';
import secrets from './secrets.json';

const api = axios.create({
  baseURL: secrets.baseURL,
  headers: {
    apikey: secrets.apikey,
  },
});

export default api;
