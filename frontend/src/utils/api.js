import axios from "axios";

const api = axios.create({
  baseURL: "https://moodsync-2-o7ws.onrender.com/api", // your backend deployed on Render
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
