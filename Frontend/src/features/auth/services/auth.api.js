// src/features/auth/services/auth.api.js
import axiosInstance from "../../../core/axios/axiosInstance";

// POST /auth/register
export const registerUser = async (formData) => {
  const response = await axiosInstance.post("/auth/register", formData);
  return response.data;
};

// POST /auth/login
export const loginUser = async (formData) => {
  const response = await axiosInstance.post("/auth/login", formData);
  return response.data;
};

// GET /auth/get-me  ← this is how we check if user is logged in (no localStorage)
export const getMe = async () => {
  const response = await axiosInstance.get("/auth/get-me");
  return response.data;
};

// GET /auth/logout
export const logoutUser = async () => {
  const response = await axiosInstance.get("/auth/logout");
  return response.data;
};