// src/features/shop/hooks/useShopDetail.js
import { useState, useEffect } from "react";
import { getShopById } from "../services/shop.api";
import { getProductsByShop } from "../../product/services/product.api";

const useShopDetail = (shopId) => {
  const [shop, setShop]         = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!shopId) return;

    const fetchShopDetail = async () => {
      try {
        const [shopData, productsData] = await Promise.all([
          getShopById(shopId),
          getProductsByShop(shopId),
        ]);

        setShop(shopData.shop);   // ✅ { shop } from getShopById
        setProducts(productsData); // ✅ plain array from getProductsByShop
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load shop.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetail();
  }, [shopId]);

  return { shop, products, loading, error };
};

export default useShopDetail;