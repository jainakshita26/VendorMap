// src/features/shop/components/ShopCard.jsx
import { useNavigate } from "react-router-dom";

const ShopCard = ({ shop }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/shops/${shop._id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 group"
    >
      {/* Image */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
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
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">

        {/* Name + category */}
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

        {/* Description */}
        {shop.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {shop.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {shop.location?.address && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>📍</span>
              <span>{shop.location.address}</span>
            </div>
          )}
          {shop.views > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
              <span>👁️</span>
              <span>{shop.views}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShopCard;


// ### What's working now

// | Feature | How |
// |---|---|
// | Search by name | Filters instantly as you type |
// | Search by category | Same search box |
// | Search by location | Same search box |
// | Filter by category | Pills — click to filter |
// | Sort A→Z / Newest | Dropdown |
// | Clear search | ✕ button appears when searching |
// | Empty search state | Different message + clear button |
// | View count on card | Shows if views > 0 |

// ### Key design decision — no extra API calls
// ```
// All 3 features (search, filter, sort) work on
// already-fetched shops array using useMemo
// → instant response
// → no loading spinner on filter
// → works offline too