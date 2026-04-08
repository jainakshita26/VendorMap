// src/features/search/components/SearchResultCard.jsx
import { useNavigate } from "react-router-dom";

const SearchResultCard = ({ product, userCoords }) => {
  const navigate = useNavigate();

  const shop = product.shop;

  // calculate distance if coords available
  const getDistance = () => {
  if (!userCoords || !shop?.location?.coordinates) return null;
  
  const [shopLng, shopLat] = shop.location.coordinates;

  // ✅ skip if coordinates are [0,0] — means no real location saved
  if (shopLng === 0 && shopLat === 0) return null;

  const R = 6371;
  const dLat = ((shopLat - userCoords.lat) * Math.PI) / 180;
  const dLng = ((shopLng - userCoords.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userCoords.lat * Math.PI) / 180) *
    Math.cos((shopLat * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

  const distance = getDistance();

  return (
    <div
      onClick={() => navigate(`/shops/${shop?._id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group flex gap-4 p-4"
    >
      {/* Product Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-2xl">📦</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">

        {/* Product name + price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-sm font-bold text-blue-600 flex-shrink-0">
            ₹{product.price}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {product.description}
          </p>
        )}

        {/* Shop info */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🏪</span>
            <span className="text-xs font-medium text-gray-600">
              {shop?.shopName}
            </span>
            {shop?.category && (
              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                {shop.category}
              </span>
            )}
          </div>

          {/* Distance */}
          {distance && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
              📍 {distance} km
            </span>
          )}
        </div>

        {/* Shop location */}
        {shop?.location?.address && (
          <p className="text-xs text-gray-400 mt-0.5">
            {shop.location.address}
          </p>
        )}

      </div>
    </div>
  );
};

export default SearchResultCard;