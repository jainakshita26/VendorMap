// const ProductCard = ({ product }) => {

//   const hasDiscount = product.discountPrice &&
//     product.discountPrice > 0 &&
//     product.discountPrice < product.price;

//   const discountPercent = hasDiscount
//     ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
//     : 0;

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">

//       {/* Image */}
//       <div className="w-full h-40 bg-gray-100 overflow-hidden relative">
//         {product.image ? (
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-50">
//             <span className="text-4xl">📦</span>
//           </div>
//         )}

//         {/* Discount badge */}
//         {hasDiscount && (
//           <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//             {discountPercent}% OFF
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div className="p-4 space-y-1">
//         <h4 className="text-sm font-semibold text-gray-800">
//           {product.name}
//         </h4>

//         {product.description && (
//           <p className="text-xs text-gray-500 line-clamp-2">
//             {product.description}
//           </p>
//         )}

//         {/* Price section */}
//         <div className="flex items-center gap-2 pt-1">
//           {hasDiscount ? (
//             <>
//               {/* Discounted price */}
//               <span className="text-base font-bold text-blue-600">
//                 ₹{product.discountPrice}
//               </span>
//               {/* Original price with strikethrough */}
//               <span className="text-sm text-gray-400 line-through">
//                 ₹{product.price}
//               </span>
//             </>
//           ) : (
//             <span className="text-base font-bold text-blue-600">
//               ₹{product.price}
//             </span>
//           )}

//           {/* Unit */}
//           {product.unit && product.unit !== "piece" && (
//             <span className="text-xs text-gray-400">
//               / {product.unit}
//             </span>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProductCard;


import { useState } from "react";

const ProductModal = ({ product, onClose }) => {
  const hasDiscount = product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/35 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        {/* Modal — stop propagation so clicking inside doesn't close */}
        <div
          className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="w-full h-56 bg-gray-100 relative">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <span className="text-6xl">📦</span>
              </div>
            )}

            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {discountPercent}% OFF
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-gray-600 hover:text-gray-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">

            {/* Name + availability */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${product.available !== false
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-500"
                }`}>
                {product.available !== false ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    ₹{product.price}
                  </span>
                  <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">
                    Save ₹{product.price - product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  ₹{product.price}
                </span>
              )}
              {product.unit && product.unit !== "piece" && (
                <span className="text-sm text-gray-400">/ {product.unit}</span>
              )}
            </div>

            {/* Full description */}
            {product.description ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No description available</p>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  const hasDiscount = product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
      >
        {/* Image */}
        <div className="w-full h-40 bg-gray-100 overflow-hidden relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-4xl">📦</span>
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {discountPercent}% OFF
            </div>
          )}

          {/* Tap to view hint */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-40 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Tap to view
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-1">
          <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h4>

          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-blue-600">
                  ₹{product.discountPrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-blue-600">
                ₹{product.price}
              </span>
            )}
            {product.unit && product.unit !== "piece" && (
              <span className="text-xs text-gray-400">/ {product.unit}</span>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;