import axios from 'axios';

const API = axios.create({
  baseURL: process.env.LOGSIGN_URL,
  withCredentials: false, // if you use cookies/sessions
});

export default API;
