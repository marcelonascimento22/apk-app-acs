import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
////console.log("API URL:", import.meta.env.VITE_API_URL);

const response = await fetch(
  'https://backend-app-acs.onrender.com/test'
);

const data = await response.json();

console.log(data);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;