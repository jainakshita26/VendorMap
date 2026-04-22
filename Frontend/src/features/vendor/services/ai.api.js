import axiosInstance from "../../../core/axios/axiosInstance";

export const generateProductDescription = async (productName, category = "") => {
  const res = await axiosInstance.post("/ai/generate-description", {
    productName,
    category,
  });
  return res.data;
};