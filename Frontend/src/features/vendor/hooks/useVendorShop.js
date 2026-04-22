// src/features/vendor/hooks/useVendorShop.js
import { useState, useEffect } from "react";
import { getMyShop, createShop, updateShop } from "../../shop/services/shop.api";
import {
  getProductsByShop,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../product/services/product.api";
import { updateHours } from "../../shop/services/shop.api";
import { toggleTemporaryClosed } from "../../shop/services/shop.api";
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

        const productsData = await getProductsByShop(data.shop._id);
        setProducts(productsData);

      } catch (err) {
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
  // formData is built in CreateShopForm and passed here directly
  const handleCreateShop = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createShop(formData); // ← use service, not axiosInstance directly
      setShop(data.shop);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create shop");
      throw err; // re-throw so form can catch it too
    } finally {
      setLoading(false);
    }
  };

  // ── Update shop ───────────────────────────────────────────────
  // formData is built in EditShopForm and passed here directly
  const handleUpdateShop = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateShop(formData); // ← use service
      setShop(data.shop);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update shop");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Add product ───────────────────────────────────────────────
  // formData is built in AddProductForm and passed here directly
  const handleAddProduct = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addProduct(shop._id, formData); // ← passes FormData
      setProducts((prev) => [...prev, data.product]);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Update product ────────────────────────────────────────────
  const handleUpdateProduct = async (productId, formData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateProduct(productId, formData); // ← passes FormData
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? data.product : p))
      );
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Delete product ────────────────────────────────────────────
  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // add inside useVendorShop
const handleUpdateHours = async (hours) => {
  try {
    setLoading(true);
    const data = await updateHours(hours);
    setShop(data.shop);
    return data;
  } catch (err) {
    setError(err?.response?.data?.message || "Failed to update hours");
    throw err;
  } finally {
    setLoading(false);
  }
};

const handleToggleTemporaryClosed = async () => {
  try {
    setLoading(true);
    const data = await toggleTemporaryClosed();
    setShop(data.shop);
    return data;
  } catch (err) {
    setError(err?.response?.data?.message || "Failed to update status");
    throw err;
  } finally {
    setLoading(false);
  }
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
    handleUpdateHours,
    handleToggleTemporaryClosed
  };
};

export default useVendorShop;