import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopCard from "../components/ShopCard";
import useFavourites from "../hooks/useFavourites";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

const FavouritesPage = () => {
  const navigate = useNavigate();
  const { favourites, loading, handleToggle, isFavourite } = useFavourites();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-800">
            My Favourites
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Shops you've saved
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && favourites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">♥</span>
            <p className="text-gray-600 font-medium text-lg">No favourites yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              Tap the heart on any shop to save it here
            </p>
            <button
              onClick={() => navigate("/shops")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
            >
              Browse Shops
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && favourites.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-5">
              {favourites.length} saved {favourites.length === 1 ? "shop" : "shops"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favourites.map((shop) => (
                <ShopCard
                  key={shop._id}
                  shop={shop}
                  isFavourite={isFavourite(shop._id)}
                  onToggleFavourite={handleToggle}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FavouritesPage;