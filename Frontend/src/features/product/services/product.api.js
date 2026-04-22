// src/features/product/services/product.api.js
import axiosInstance from "../../../core/axios/axiosInstance";

// GET /shops/:shopId/products — public
export const getProductsByShop = async (shopId) => {
  const response = await axiosInstance.get(`/shops/${shopId}/products`);
  return response.data;
};

// POST /add/:shopId/products — vendor only
export const addProduct = async (shopId, formData) => {
  const res = await axiosInstance.post(`/add/${shopId}/products`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// PUT /products/:productId — vendor only
export const updateProduct = async (productId, formData) => {
  const res = await axiosInstance.put(`/products/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE /products/:productId — vendor only
export const deleteProduct = async (productId) => {
  const response = await axiosInstance.delete(`/products/${productId}`);
  return response.data;
};

// src/features/product/services/product.api.js


export const searchProducts = async (query, lat, lng, radius = 50) => {
  let url = `/products/search?q=${encodeURIComponent(query)}`;
  if (lat && lng) url += `&lat=${lat}&lng=${lng}&radius=${radius}`;
  const response = await axiosInstance.get(url);
  return response.data;
};