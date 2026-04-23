// src/features/shop/pages/ShopListPage.jsx
import useShops from "../hooks/useShops";
import ShopCard from "../components/ShopCard";
import useFavourites from "../hooks/useFavourites";

const ShopCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

const ShopListPage = () => {
  const {
    shops,
    totalShops,
    allShops,       // ← add this
    loading,
    error,
    isNearby,
    usedRadius,
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    setSortBy,
    categories,
  } = useShops();

  const { handleToggle, isFavourite } = useFavourites();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Header ───────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">

          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {search.trim()
                ? "Search Results"
                : isNearby ? "Shops Near You" : "All Shops"}
            </h1>

            {/* radius badge — hidden while searching */}
            {isNearby && usedRadius && !search.trim() && (
              <span className="text-xs bg-green-50 text-green-600 font-medium px-2 py-1 rounded-full border border-green-200">
                📍 Within {usedRadius}km
              </span>
            )}

            {/* searching all shops badge */}
            {search.trim() && (
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-1 rounded-full border border-blue-200">
                🔍 Searching all shops
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-6">
            {search.trim()
              ? `Showing results from all ${allShops?.length || ""} shops`
              : isNearby
              ? `Showing shops within ${usedRadius}km of your location`
              : "Showing all shops — allow location for nearby results"}
          </p>

          {/* ── Search Bar ──────────────────────────────── */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shops by name, category or location..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* ── Filter Bar ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {loading ? (
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition
                    ${category === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                >
                  {cat}
                </button>
              ))
            )}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="default">Sort: Default</option>
            <option value="name">Sort: A → Z</option>
            <option value="newest">Sort: Newest</option>
          </select>

        </div>

        {/* ── Results count ───────────────────────────────── */}
        {!loading && !error && (
          <p className="text-xs text-gray-400 mb-4">
            {shops.length === 0
              ? "No shops found"
              : `Showing ${shops.length} of ${totalShops} shops`}
            {search && (
              <span className="ml-1">
                for "<span className="text-gray-600 font-medium">{search}</span>"
              </span>
            )}
          </p>
        )}

        {/* ── Error ───────────────────────────────────────── */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* ── Loading skeletons ───────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ShopCardSkeleton key={i} />)}
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────── */}
        {!loading && !error && shops.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">
              {search ? "🔍" : "🏪"}
            </span>
            <h3 className="text-lg font-semibold text-gray-700">
              {search ? "No shops match your search" : isNearby ? "No shops near you" : "No shops found"}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {search
                ? "Try different keywords or clear the search"
                : isNearby
                ? "Try expanding your search radius"
                : "Be the first vendor to open a shop!"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* ── Shop grid ───────────────────────────────────── */}
        {!loading && !error && shops.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard
                key={shop._id}
                shop={shop}
                isFavourite={isFavourite(shop._id)}
                onToggleFavourite={handleToggle}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ShopListPage;