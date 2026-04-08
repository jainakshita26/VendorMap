// src/features/search/hooks/useSearch.js
import { useState, useCallback, useRef } from "react";
import { searchProducts } from "../../product/services/product.api";

const useSearch = () => {
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [searched, setSearched]     = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  const debounceTimer = useRef(null);
  
  // ✅ store coords in ref so it's always current
  const coordsRef = useRef(null);

  // get user coordinates once
  const getUserCoords = useCallback(() => {
    return new Promise((resolve) => {
      // ✅ use ref instead of state — always has latest value
      if (coordsRef.current) {
        resolve(coordsRef.current);
        return;
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            coordsRef.current = coords; // ✅ save to ref
            setUserCoords(coords);      // ✅ also save to state for UI
            resolve(coords);
          },
          () => resolve(null),
          { timeout: 5000 }
        );
      } else {
        resolve(null);
      }
    });
  }, []); // ✅ empty deps — no stale closure

  const handleSearch = useCallback(async (q) => {
    setQuery(q);

    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const coords = await getUserCoords();
        console.log("Coords for search:", coords);

        const data = await searchProducts(
          q,
          coords?.lat,
          coords?.lng
        );

        console.log("Search response:", data);
        setResults(data.results);
        setSearched(true);
      } catch (err) {
        console.log("Search error:", err);
        setError(err?.response?.data?.message || "Search failed.");
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [getUserCoords]);

  return {
    query,
    results,
    loading,
    error,
    searched,
    userCoords,
    handleSearch,
  };
};

export default useSearch;