// src/features/vendor/hooks/useVendorShop.js
import { useState, useEffect } from "react";
import { getMyShop, createShop, updateShop } from "../../shop/services/shop.api";
import {
  getProductsByShop,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../product/services/product.api";
import useAuth from "../../auth/hooks/useAuth";

const useVendorShop = () => {
  const { user } = useAuth();

  const [shop, setShop]         = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ── Fetch vendor's own shop on mount ──────────────────────────
  useEffect(() => {
    const fetchVendorShop = async () => {
      try {
        const data = await getMyShop();
        setShop(data.shop);

        // if shop exists fetch its products immediately
        const productsData = await getProductsByShop(data.shop._id);
        setProducts(productsData); // plain array ✅

      } catch (err) {
        // 404 means vendor has no shop yet — not a real error
        if (err?.response?.status === 404) {
          setShop(null);
        } else {
          setError(err?.response?.data?.message || "Failed to load your shop.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchVendorShop();
  }, [user]);

  // ── Create shop ───────────────────────────────────────────────
  const handleCreateShop = async (shopData) => {
    const data = await createShop(shopData);
    setShop(data.shop);
    setProducts([]);
    return data;
  };

  // ── Add product ───────────────────────────────────────────────
  const handleAddProduct = async (productData) => {
    const data = await addProduct(shop._id, productData);
    setProducts((prev) => [...prev, data.product]);
    return data;
  };

  // ── Update product ────────────────────────────────────────────
  const handleUpdateProduct = async (productId, productData) => {
    const data = await updateProduct(productId, productData);
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? data.product : p))
    );
    return data;
  };

  // ── Delete product ────────────────────────────────────────────
  const handleDeleteProduct = async (productId) => {
    await deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleUpdateShop = async (shopData) => {
  const data = await updateShop(shopData);
  setShop(data.shop); // ← update local state immediately
  return data;
};

  return {
     shop,
  products,
  loading,
  error,
  handleCreateShop,
  handleUpdateShop,  
  handleAddProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  };
};

export default useVendorShop;