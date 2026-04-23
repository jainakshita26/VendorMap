// src/features/shop/hooks/useShops.js
import { useState, useEffect, useMemo, useRef } from "react";
import { getAllShops, getNearbyShops } from "../services/shop.api";

const useShops = () => {
  const [nearbyShops, setNearbyShops] = useState([]); // ← nearby only
  const [allShops, setAllShops]       = useState([]); // ← all shops for search
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [isNearby, setIsNearby]       = useState(false);
  const [usedRadius, setUsedRadius]   = useState(null);

  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy]     = useState("default");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAllShops = async () => {
      try {
        const data = await getAllShops();
        setAllShops(data.shops);   // ← always store all shops
        setNearbyShops(data.shops);
        setIsNearby(false);
        setUsedRadius(null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load shops.");
      } finally {
        setLoading(false);
      }
    };

    const fetchNearbyShops = async (lat, lng) => {
      try {
        const [nearbyData, allData] = await Promise.all([
          getNearbyShops(lat, lng), // ← fetch nearby
          getAllShops(),             // ← fetch all at same time
        ]);

        setNearbyShops(nearbyData.shops);
        setAllShops(allData.shops);  // ← store all for search
        setUsedRadius(nearbyData.usedRadius);
        setIsNearby(nearbyData.usedRadius !== null);
      } catch {
        await fetchAllShops();
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchNearbyShops(pos.coords.latitude, pos.coords.longitude),
        () => fetchAllShops(),
        { timeout: 5000 }
      );
    } else {
      fetchAllShops();
    }
  }, []);

  const filteredShops = useMemo(() => {
    /*
      Key logic:
      - If search is active → search across ALL shops (ignore radius)
      - If no search → show nearby shops only
    */
    const base = search.trim() ? allShops : nearbyShops;

    let result = [...base];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.shopName?.toLowerCase().includes(q) ||
          s.location?.address?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((s) => s.category === category);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.shopName.localeCompare(b.shopName));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [nearbyShops, allShops, search, category, sortBy]);

  // categories from all shops so filters always show everything
  const categories = useMemo(() => {
    const cats = [...new Set(allShops.map((s) => s.category).filter(Boolean))];
    return ["All", ...cats];
  }, [allShops]);

  return {
    shops: filteredShops,
    totalShops: search.trim() ? allShops.length : nearbyShops.length,
    allShops,
    loading,
    error,
    isNearby: isNearby && !search.trim(), // ← hide "nearby" badge when searching
    usedRadius,
    search, setSearch,
    category, setCategory,
    sortBy, setSortBy,
    categories,
  };
};

export default useShops;