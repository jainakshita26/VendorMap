// src/core/axios/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // ← change this to your backend URL/port
  withCredentials: true,               // ← sends HTTP-only cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;