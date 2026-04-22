// src/features/shop/services/shop.api.js
import axiosInstance from "../../../core/axios/axiosInstance";

export const getAllShops = async () => {
  const response = await axiosInstance.get("/shops");
  return response.data;
};

export const getShopById = async (shopId) => {
  const response = await axiosInstance.get(`/shops/${shopId}`);
  return response.data;
};

export const createShop = async (formData) => {
  const res = await axiosInstance.post("/shops/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getMyShop = async () => {
  const response = await axiosInstance.get("/shops/my-shop");
  return response.data;
};

// ✅ new
export const getNearbyShops = async (lat, lng, radius = 10) => {
  const response = await axiosInstance.get(
    `/shops/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
  );
  return response.data;
};

/*
  updateShop:
  Sends updated shopImage and description to backend
  PUT /api/shops/update
*/

export const updateShop = async (formData) => {
  const res = await axiosInstance.put("/shops/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};



export const getReviews = async (shopId) => {
  const res = await axiosInstance.get(`/shops/${shopId}/reviews`);
  return res.data;
};

export const addReview = async (shopId, data) => {
  const res = await axiosInstance.post(`/shops/${shopId}/reviews`, data);
  return res.data;
};

export const deleteReview = async (shopId) => {
  const res = await axiosInstance.delete(`/shops/${shopId}/reviews`);
  return res.data;
};

export const getFavourites = async () => {
  const res = await axiosInstance.get("/users/favourites");
  return res.data;
};

export const toggleFavourite = async (shopId) => {
  const res = await axiosInstance.post(`/users/favourites/${shopId}`);
  return res.data;
};

export const toggleTemporaryClosed = async () => {
  const res = await axiosInstance.put("/shops/toggle-closed");
  return res.data;
};

export const updateHours = async (hours) => {
  const res = await axiosInstance.put("/shops/hours", { hours });
  return res.data;
};