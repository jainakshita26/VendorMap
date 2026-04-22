import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import { getShopStatus } from "../../../core/utils/shopHours"; // ← new

const ShopCard = ({ shop, isFavourite = false, onToggleFavourite }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onToggleFavourite) onToggleFavourite(shop._id);
  };

  // ← new
const { isOpen, label } = getShopStatus(shop.hours, shop.temporarilyClosed);

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

        {/* ← Open/Closed badge */}
        {shop.hours?.length > 0 && (
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
            {/* ← Hours label */}
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