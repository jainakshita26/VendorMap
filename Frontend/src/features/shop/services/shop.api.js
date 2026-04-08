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

export const createShop = async (shopData) => {
  const response = await axiosInstance.post("/shops/create", shopData);
  return response.data;
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
export const updateShop = async (shopData) => {
  const response = await axiosInstance.put("/shops/update", shopData);
  return response.data;
};