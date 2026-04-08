// src/features/shop/hooks/useShops.js
import { useState, useEffect, useMemo, useRef } from "react";
import { getAllShops, getNearbyShops } from "../services/shop.api";

const useShops = () => {
  const [shops, setShops]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [isNearby, setIsNearby]     = useState(false);

  /*
    usedRadius tells us WHICH radius actually found shops:
    5  → "Shops within 5km"
    20 → "Shops within 20km"
    50 → "Shops within 50km"
    null → "All Shops" (either denied or none found nearby)
  */
  const [usedRadius, setUsedRadius] = useState(null);

  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [sortBy, setSortBy]         = useState("default");

  /*
    useRef prevents the effect from running twice.
    In React StrictMode, effects run twice in development.
    hasFetched.current = true after first run → skips second run.
  */
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // fallback — just get all shops
    const fetchAllShops = async () => {
      try {
        const data = await getAllShops();
        setShops(data.shops);
        setIsNearby(false);
        setUsedRadius(null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load shops.");
      } finally {
        setLoading(false);
      }
    };

    // main — get nearby shops with smart radius
    const fetchNearbyShops = async (lat, lng) => {
      try {
        /*
          getNearbyShops sends lat + lng to backend
          Backend tries 5km → 20km → 50km → all
          Returns { shops, usedRadius }
        */
        const data = await getNearbyShops(lat, lng);
        setShops(data.shops);
        setUsedRadius(data.usedRadius);

        /*
          isNearby = true only when actual radius was used
          isNearby = false when showing all shops (usedRadius = null)
        */
        setIsNearby(data.usedRadius !== null);
      } catch {
        // nearby API failed → fallback to all shops
        await fetchAllShops();
      } finally {
        setLoading(false);
      }
    };

    /*
      navigator.geolocation → browser's built-in GPS API
      getCurrentPosition → asks user for location permission
      
      Two callbacks:
      1. Success (pos) → user allowed, we have coordinates
      2. Error ()      → user denied, use fallback
      
      timeout: 5000 → if GPS takes more than 5 seconds → treat as denied
    */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchNearbyShops(
            pos.coords.latitude,
            pos.coords.longitude
          );
        },
        () => fetchAllShops(), // denied
        { timeout: 5000 }
      );
    } else {
      // browser doesn't support geolocation
      fetchAllShops();
    }
  }, []); // empty array → runs only once on mount

  /*
    useMemo → only recalculates when shops/search/category/sortBy changes
    Without useMemo → recalculates on every single render → slow
  */
  const filteredShops = useMemo(() => {
    let result = [...shops];

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
  }, [shops, search, category, sortBy]);

  const categories = useMemo(() => {
    const cats = [...new Set(shops.map((s) => s.category).filter(Boolean))];
    return ["All", ...cats];
  }, [shops]);

  return {
    shops: filteredShops,
    totalShops: shops.length,
    loading,
    error,
    isNearby,
    usedRadius,     // ← new
    search, setSearch,
    category, setCategory,
    sortBy, setSortBy,
    categories,
  };
};

export default useShops;