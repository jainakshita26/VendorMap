// src/features/vendor/pages/VendorDashboard.jsx
import { useState } from "react";
import useVendorShop from "../hooks/useVendorShop";
import useAuth from "../../auth/hooks/useAuth";
import CreateShopForm from "../components/CreateShopForm";
import AddProductForm from "../components/AddProductForm";
import VendorProductCard from "../components/VendorProductCard";
import EditShopForm from "../components/EditShopForm";

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-32 bg-gray-200 rounded-2xl" />
    <div className="h-64 bg-gray-200 rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-56 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  </div>
);

/*
  ShopInfoPanel now accepts:
  shop          → shop data
  onEditClick   → opens edit form
*/
const ShopInfoPanel = ({ shop, onEditClick }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

    {/* Banner */}
    <div className="w-full h-36 bg-gray-100 overflow-hidden relative">
      {shop.shopImage ? (
        <img
          src={shop.shopImage}
          alt={shop.shopName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-blue-50">
          <span className="text-5xl">🏪</span>
        </div>
      )}

      {/*
        Edit button sits on top of banner image
        position: absolute → floats over the image
      */}
      <button
        onClick={onEditClick}
        className="absolute top-3 right-3 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 transition flex items-center gap-1"
      >
        ✏️ Edit Profile
      </button>
    </div>

    {/* Info */}
    <div className="p-5 space-y-2">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-800">
          {shop.shopName}
        </h2>
        {shop.category && (
          <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-1 rounded-full">
            {shop.category}
          </span>
        )}
      </div>

      {shop.description && (
        <p className="text-sm text-gray-500">{shop.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
        {shop.location?.address && (
          <span className="flex items-center gap-1">
            <span>📍</span>{shop.location.address}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span>👤</span>{shop.owner?.name}
        </span>
      </div>
    </div>
  </div>
);

const VendorDashboard = () => {
  const { user } = useAuth();

  /*
    isEditingShop → controls whether EditShopForm is visible
    false → show ShopInfoPanel normally
    true  → show EditShopForm below ShopInfoPanel
  */
  const [isEditingShop, setIsEditingShop] = useState(false);

  const {
    shop,
    products,
    loading,
    error,
    handleCreateShop,
    handleUpdateShop,  // ✅ new
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  } = useVendorShop();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">
            Vendor Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {loading && <DashboardSkeleton />}

        {!loading && error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && !shop && (
          <CreateShopForm onSubmit={handleCreateShop} />
        )}

        {!loading && !error && shop && (
          <div className="space-y-6">

            {/* Shop Info Panel */}
            <ShopInfoPanel
              shop={shop}
              onEditClick={() => setIsEditingShop(true)}
            />

            {/*
              Edit form appears below ShopInfoPanel when edit is clicked
              isEditingShop = true  → show form
              isEditingShop = false → form hidden
            */}
            {isEditingShop && (
              <EditShopForm
                shop={shop}
                onSubmit={handleUpdateShop}
                onClose={() => setIsEditingShop(false)}
              />
            )}

            {/* Products section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-1">
                <AddProductForm onSubmit={handleAddProduct} />
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  Your Products{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    ({products.length})
                  </span>
                </h3>

                {products.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 bg-white rounded-2xl border border-gray-100 text-center">
                    <span className="text-4xl mb-3">📦</span>
                    <p className="text-sm font-medium text-gray-600">
                      No products yet
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add your first product using the form
                    </p>
                  </div>
                )}

                {products.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {products.map((product) => (
                      <VendorProductCard
                        key={product._id}
                        product={product}
                        onUpdate={handleUpdateProduct}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;