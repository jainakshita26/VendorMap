// src/features/search/pages/SearchPage.jsx
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import useSearch from "../hooks/useSearch";
import SearchResultCard from "../components/SearchResultCard";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);

  const {
    query,
    results,
    loading,
    error,
    searched,
    userCoords,
    handleSearch,
  } = useSearch();

  // sync URL query param with search
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q) handleSearch(q);
    // focus input on mount
    inputRef.current?.focus();
  }, []);

  const onInputChange = (e) => {
    const q = e.target.value;
    handleSearch(q);
    // update URL without navigation
    if (q) {
      setSearchParams({ q });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky Search Header ─────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4">

          {/* Search input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={onInputChange}
              placeholder="Search for products, e.g. chocolate, shirt, rice..."
              className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
            />
            {query && (
              <button
                onClick={() => { handleSearch(""); setSearchParams({}); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Location indicator */}
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            {userCoords ? (
              <>
                <span className="text-green-500">📍</span>
                Showing results near your location
              </>
            ) : (
              <>
                <span>📍</span>
                Allow location for nearby results
              </>
            )}
          </p>

        </div>
      </div>

      {/* ── Results ──────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-6">

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Initial state — nothing searched yet */}
        {!loading && !searched && !query && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <h3 className="text-lg font-semibold text-gray-700">
              Search for anything
            </h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Find products across all nearby shops —
              chocolate, rice, shirts, electronics and more
            </p>
            {/* Popular searches */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {["Chocolate", "Rice", "Shirt", "Medicine", "Notebook"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    handleSearch(s);
                    setSearchParams({ q: s });
                  }}
                  className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">😕</span>
            <h3 className="text-lg font-semibold text-gray-700">
              No results for "{query}"
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Try a different search term or check nearby shops
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {results.length} {results.length === 1 ? "result" : "results"} for{" "}
              <span className="text-gray-600 font-medium">"{query}"</span>
              {userCoords && " — sorted by distance"}
            </p>
            <div className="space-y-3">
              {results.map((product) => (
                <SearchResultCard
                  key={product._id}
                  product={product}
                  userCoords={userCoords}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SearchPage;