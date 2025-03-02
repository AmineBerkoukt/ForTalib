import axios from "axios";
import {useNavigate} from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const navigate = useNavigate();
// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Dynamically get the token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        navigate("/login");
      }
      return Promise.reject(error);
    }
);

export default api;
