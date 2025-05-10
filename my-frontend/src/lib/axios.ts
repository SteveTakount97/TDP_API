import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3333/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token'); 

  if (token) {
    try {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token envoyé dans le header:', config.headers.Authorization);
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
    }
  } else {
    console.warn(' Aucun token trouvé dans le localStorage');
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
