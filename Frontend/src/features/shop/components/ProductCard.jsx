const ProductCard = ({ product }) => {

  const hasDiscount = product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">

      {/* Image */}
      <div className="w-full h-40 bg-gray-100 overflow-hidden relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <h4 className="text-sm font-semibold text-gray-800">
          {product.name}
        </h4>

        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price section */}
        <div className="flex items-center gap-2 pt-1">
          {hasDiscount ? (
            <>
              {/* Discounted price */}
              <span className="text-base font-bold text-blue-600">
                ₹{product.discountPrice}
              </span>
              {/* Original price with strikethrough */}
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-blue-600">
              ₹{product.price}
            </span>
          )}

          {/* Unit */}
          {product.unit && product.unit !== "piece" && (
            <span className="text-xs text-gray-400">
              / {product.unit}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductCard;