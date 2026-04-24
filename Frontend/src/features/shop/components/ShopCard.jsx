import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import { getShopStatus } from "../../../core/utils/shopHours";

// haversine distance calculation
const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const ShopCard = ({ shop, isFavourite = false, onToggleFavourite, userCoords, isSearching }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onToggleFavourite) onToggleFavourite(shop._id);
  };

  const { isOpen, label } = getShopStatus(shop.hours, shop.temporarilyClosed);

  // calculate distance only when searching + user coords available
  const distance = (() => {
    if (!isSearching || !userCoords) return null;
    const coords = shop.location?.coordinates;
    if (!coords || (coords[0] === 0 && coords[1] === 0)) return null;
    const [shopLng, shopLat] = coords;
    const km = getDistanceKm(userCoords.lat, userCoords.lng, shopLat, shopLng);
    return km < 1
      ? `${Math.round(km * 1000)} m away`
      : `${km.toFixed(1)} km away`;
  })();

  return (
    <div
      onClick={() => navigate(`/shops/${shop._id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 group"
    >
      <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
        {shop.shopImage ? (
          <img
            src={shop.shopImage}
            alt={shop.shopName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50">
            <span className="text-4xl">🏪</span>
          </div>
        )}

        {/* Open/Closed badge */}
        {shop.hours?.length > 0 && isOpen !== null && (
          <div className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            isOpen
              ? "bg-green-500 text-white"
              : "bg-gray-800 text-white opacity-80"
          }`}>
            {isOpen ? "● Open" : "● Closed"}
          </div>
        )}

        {isAuthenticated && isCustomer && (
          <button
            onClick={handleHeartClick}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
          >
            <span className={`text-base ${isFavourite ? "text-red-500" : "text-gray-300"}`}>♥</span>
          </button>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
            {shop.shopName}
          </h3>
          {shop.category && (
            <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              {shop.category}
            </span>
          )}
        </div>

        {shop.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{shop.description}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex flex-col gap-0.5">
            {shop.location?.address && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>📍</span>
                <span>{shop.location.address}</span>
              </div>
            )}

            {/* ← distance badge — only shows when searching */}
            {distance && (
              <div className="flex items-center gap-1 text-xs font-medium text-blue-500">
                <span>📏</span>
                <span>{distance}</span>
              </div>
            )}

            {/* Hours label */}
            {shop.hours?.length > 0 && label && (
              <span className={`text-xs ${isOpen ? "text-green-600" : "text-gray-400"}`}>
                {label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {shop.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs font-medium text-yellow-600">
                <span>★</span>
                <span>{shop.averageRating}</span>
                <span className="text-gray-400 font-normal">({shop.reviewCount})</span>
              </div>
            )}
            {shop.views > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>👁️</span>
                <span>{shop.views}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;