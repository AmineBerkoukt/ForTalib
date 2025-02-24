import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

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
      // Handle errors before the request is sent
      return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle token expiration (optional: redirect to login or refresh token)
        console.error("Unauthorized! Redirecting to login...");
        // For example:
        // window.location.href = "/login";
      }
      return Promise.reject(error);
    }
);

export default api;
