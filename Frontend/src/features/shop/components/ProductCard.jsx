// src/features/shop/components/ProductCard.jsx
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">

      {/* Product Image */}
      <div className="w-full h-40 bg-gray-100 overflow-hidden">
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
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-1">

        <h4 className="text-sm font-semibold text-gray-800">
          {product.name}
        </h4>

        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}

        <p className="text-base font-bold text-blue-600 pt-1">
          ₹{product.price}
        </p>

      </div>
    </div>
  );
};

export default ProductCard;