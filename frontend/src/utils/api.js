import axios from "axios";

const baseURL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof window !== "undefined" && window.location && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://moodsync-2-o7ws.onrender.com/api");

const api = axios.create({
  baseURL,
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
