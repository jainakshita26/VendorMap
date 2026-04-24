// src/features/shop/pages/ShopDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import useShopDetail from "../hooks/useShopDetail";
import ProductCard from "../components/ProductCard";
import ReviewSection from "../components/ReviewSection";
import StarRating from "../components/StarRating";
import useFavourites from "../hooks/useFavourites";
import useAuth from "../../auth/hooks/useAuth";

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="w-full h-40 bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const ShopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shop, products, loading, error } = useShopDetail(id);
  const { handleToggle, isFavourite } = useFavourites();
  const { isAuthenticated, isCustomer } = useAuth();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={() => navigate("/shops")} className="text-blue-600 text-sm hover:underline">
            ← Back to shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Shop Header */}
      <div className="bg-white border-b border-gray-100">

        {/* Banner image */}
        <div className="w-full h-56 bg-gray-100 overflow-hidden relative">
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          ) : shop?.shopImage ? (
            <img src={shop.shopImage} alt={shop.shopName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <span className="text-6xl">🏪</span>
            </div>
          )}

          {/* ── Heart button on banner ── */}
          {!loading && isAuthenticated && isCustomer && (
            <button
              onClick={() => handleToggle(id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
            >
              <span className={`text-lg ${isFavourite(id) ? "text-red-500" : "text-gray-300"}`}>
                ♥
              </span>
            </button>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-5">
          <button
            onClick={() => navigate("/shops")}
            className="text-sm text-blue-600 hover:underline mb-3 flex items-center gap-1"
          >
            ← Back to shops
          </button>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ) : (
            <div className="space-y-2">

              {/* Name + category + favourite button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-800">{shop?.shopName}</h1>
                  {shop?.category && (
                    <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-1 rounded-full">
                      {shop.category}
                    </span>
                  )}
                </div>

                {/* Save button next to shop name — text version */}
                {isAuthenticated && isCustomer && (
                  <button
                    onClick={() => handleToggle(id)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${isFavourite(id)
                        ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-400"
                      }`}
                  >
                    <span>{isFavourite(id) ? "♥" : "♡"}</span>
                    <span>{isFavourite(id) ? "Saved" : "Save Shop"}</span>
                  </button>
                )}
              </div>

              {/* Rating summary */}
              {shop?.reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(shop.averageRating)} readonly size="sm" />
                  <span className="text-sm font-semibold text-gray-700">
                    {shop.averageRating}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({shop.reviewCount} {shop.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {shop?.description && (
                <p className="text-sm text-gray-500">{shop.description}</p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                {shop?.location?.address && (
                  <span className="flex items-center gap-1">
                    <span>📍</span>{shop.location.address}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span>👤</span>{shop?.owner?.name}
                </span>
              </div>
              {/* ← add contact buttons here */}
              {shop?.phone && (
                <div className="flex items-center gap-2 pt-2">
                  <a href={`tel:+91${shop.phone}`}
                    className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition">
                    📞 Call Shop
                  </a>
                  <a href={`https://wa.me/91${shop.phone}?text=Hi, I found your shop on VendorMap!`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white transition">
                    💬 WhatsApp
                  </a>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Products</h2>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">📦</span>
            <p className="text-gray-500 text-sm font-medium">No products yet</p>
            <p className="text-gray-400 text-xs mt-1">This shop hasn't added any products</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Reviews Section */}
      {!loading && (
        <div className="border-t border-gray-100">
          <ReviewSection
            shopId={id}
            shopOwnerId={shop?.owner?._id}
          />
        </div>
      )}

    </div>
  );
};

export default ShopDetailPage;