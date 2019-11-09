import axios from 'axios';
import secrets from './secrets.json';

const api = axios.create({
  ...secrets,
});

export default api;
